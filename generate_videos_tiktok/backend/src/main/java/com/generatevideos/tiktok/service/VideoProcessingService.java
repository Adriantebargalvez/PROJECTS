package com.generatevideos.tiktok.service;

import com.generatevideos.tiktok.config.FfmpegProperties;
import com.generatevideos.tiktok.config.FfprobeProperties;
import com.generatevideos.tiktok.config.VideoStorageProperties;
import com.generatevideos.tiktok.dto.UploadResponse;
import com.generatevideos.tiktok.dto.VideoStatusResponse;
import com.generatevideos.tiktok.exception.ApiException;
import jakarta.annotation.PreDestroy;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class VideoProcessingService {

    private static final Logger log = LoggerFactory.getLogger(VideoProcessingService.class);
    private static final DateTimeFormatter LOG_TIME = DateTimeFormatter.ofPattern("HH:mm:ss");
    private static final Pattern CLIP_PATTERN = Pattern.compile("clip_(\\d+)\\.mp4", Pattern.CASE_INSENSITIVE);
    private static final double CLIP_SECONDS = 4.0;
    private static final double MIN_VALID_SECONDS = 8.0;
    private static final int MAX_LOG_LINES = 120;

    private final FfmpegProperties ffmpegProperties;
    private final FfprobeProperties ffprobeProperties;
    private final VideoStorageProperties storageProperties;
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();
    private final AtomicBoolean running = new AtomicBoolean(false);
    private final Random random = new Random();
    private final Object statusLock = new Object();
    private final ArrayDeque<String> statusLogs = new ArrayDeque<>();

    private String operation = "IDLE";
    private String state = "IDLE";
    private int progress = 0;
    private String message = "Preparado.";
    private Instant startedAt;
    private Instant finishedAt;

    public VideoProcessingService(
            FfmpegProperties ffmpegProperties,
            FfprobeProperties ffprobeProperties,
            VideoStorageProperties storageProperties
    ) {
        this.ffmpegProperties = ffmpegProperties;
        this.ffprobeProperties = ffprobeProperties;
        this.storageProperties = storageProperties;
    }

    public UploadResponse upload(List<MultipartFile> files, String outputPath) {
        ensureNoJobRunning();
        if (files == null || files.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Selecciona al menos 3 videos MP4.");
        }
        if (files.size() % 3 != 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "La cantidad de videos debe ser multiplo de 3.");
        }

        Path basePath = resolveOutputPath(outputPath);
        WorkDirs dirs = ensureProjectFolders(basePath);
        int uploaded = 0;

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Uno de los archivos esta vacio.");
            }
            String filename = sanitizeFilename(file.getOriginalFilename());
            if (!filename.toLowerCase(Locale.ROOT).endsWith(".mp4")) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Solo se permiten archivos MP4: " + filename);
            }
            Path target = uniqueTarget(dirs.original().resolve(filename));
            try {
                Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
                uploaded++;
                log.info("Video subido: {}", target);
            } catch (IOException exception) {
                throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "No se pudo guardar el video: " + filename, exception);
            }
        }

        setUploadStatus(uploaded, basePath);
        return new UploadResponse("Videos subidos correctamente.", uploaded, basePath.toString(), getStatus());
    }

    public VideoStatusResponse startConvert(String outputPath) {
        ensureNoJobRunning();
        Path basePath = resolveOutputPath(outputPath);
        assertToolsAvailable();
        return startJob("CONVERTIR", () -> {
            WorkDirs dirs = ensureProjectFolders(basePath);
            int total = convertVideos(dirs, 5, 95);
            complete("Conversion finalizada. Videos convertidos: " + total + ".");
        });
    }

    public VideoStatusResponse startCut(String outputPath) {
        ensureNoJobRunning();
        Path basePath = resolveOutputPath(outputPath);
        assertToolsAvailable();
        return startJob("CORTAR", () -> {
            WorkDirs dirs = ensureProjectFolders(basePath);
            if (listMp4(dirs.tiktok()).isEmpty()) {
                addLog("No hay videos en tiktok/. Se ejecuta conversion previa.");
                convertVideos(dirs, 5, 35);
            }
            int total = cutVideos(dirs, 40, 95);
            complete("Corte finalizado. Clips creados: " + total + ".");
        });
    }

    public VideoStatusResponse startMix(String outputPath) {
        ensureNoJobRunning();
        Path basePath = resolveOutputPath(outputPath);
        assertToolsAvailable();
        return startJob("MEZCLAR", () -> {
            WorkDirs dirs = ensureProjectFolders(basePath);
            dirs = dirs.withFinalDir(prepareResultDirectory(dirs.finalDir()));
            ensureClipsReady(dirs, 5, 55);
            int total = mixVideos(dirs, 60, 98);
            complete("Mezcla finalizada. Videos generados: " + total + " en " + dirs.finalDir() + ".");
        });
    }

    public VideoStatusResponse startRandom(String outputPath, Integer randomCount) {
        ensureNoJobRunning();
        int requested = normalizeRandomCount(randomCount);
        Path basePath = resolveOutputPath(outputPath);
        assertToolsAvailable();
        return startJob("RANDOM", () -> {
            WorkDirs dirs = ensureProjectFolders(basePath);
            dirs = dirs.withRandomDir(prepareResultDirectory(dirs.randomDir()));
            ensureClipsReady(dirs, 5, 55);
            int total = randomVideos(dirs, requested, 60, 98);
            complete("Random finalizado. Videos validos generados: " + total + " en " + dirs.randomDir() + ".");
        });
    }

    public VideoStatusResponse startRunAll(String outputPath, Integer randomCount) {
        ensureNoJobRunning();
        int requestedRandom = randomCount == null ? 0 : randomCount;
        if (requestedRandom < 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "La cantidad de videos random no puede ser negativa.");
        }
        Path basePath = resolveOutputPath(outputPath);
        assertToolsAvailable();
        return startJob("EJECUTAR TODO", () -> {
            WorkDirs dirs = ensureProjectFolders(basePath);
            dirs = dirs.withFinalDir(prepareResultDirectory(dirs.finalDir()));
            if (requestedRandom > 0) {
                dirs = dirs.withRandomDir(prepareResultDirectory(dirs.randomDir()));
            }
            int converted = convertVideos(dirs, 5, 30);
            int clips = cutVideos(dirs, 32, 58);
            int mixed = mixVideos(dirs, 60, requestedRandom > 0 ? 78 : 98);
            int randomGenerated = 0;
            if (requestedRandom > 0) {
                randomGenerated = randomVideos(dirs, requestedRandom, 80, 98);
            }
            cleanupIntermediateFolders(dirs);
            complete("Flujo completo. Convertidos: " + converted
                    + ", clips: " + clips
                    + ", mezclados: " + mixed
                    + ", random: " + randomGenerated
                    + ". Resultados en " + dirs.finalDir()
                    + (requestedRandom > 0 ? " y " + dirs.randomDir() : "")
                    + ". Carpetas temporales borradas.");
        });
    }

    public VideoStatusResponse clean(String outputPath) {
        ensureNoJobRunning();
        Path basePath = resolveOutputPath(outputPath);
        WorkDirs dirs = ensureProjectFolders(basePath);
        try {
            deleteDirectoryContents(dirs.temp());
            Files.createDirectories(dirs.temp());
        } catch (IOException exception) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "No se pudieron limpiar los temporales.", exception);
        }

        synchronized (statusLock) {
            operation = "LIMPIAR";
            state = "COMPLETED";
            progress = 100;
            message = "Temporales limpiados.";
            startedAt = Instant.now();
            finishedAt = Instant.now();
            statusLogs.clear();
            addLogLocked("Temporales limpiados en " + dirs.temp());
        }
        return getStatus();
    }

    public VideoStatusResponse getStatus() {
        synchronized (statusLock) {
            return new VideoStatusResponse(
                    operation,
                    state,
                    progress,
                    running.get(),
                    message,
                    List.copyOf(statusLogs),
                    startedAt,
                    finishedAt
            );
        }
    }

    @PreDestroy
    public void shutdown() {
        executorService.shutdownNow();
    }

    private VideoStatusResponse startJob(String jobOperation, ThrowingRunnable runnable) {
        if (!running.compareAndSet(false, true)) {
            throw new ApiException(HttpStatus.CONFLICT, "Ya hay un proceso en ejecucion.");
        }

        synchronized (statusLock) {
            operation = jobOperation;
            state = "RUNNING";
            progress = 0;
            message = "Proceso iniciado.";
            startedAt = Instant.now();
            finishedAt = null;
            statusLogs.clear();
            addLogLocked("Proceso iniciado: " + jobOperation);
        }

        executorService.submit(() -> {
            try {
                runnable.run();
            } catch (Exception exception) {
                fail(exception);
            } finally {
                running.set(false);
            }
        });

        return getStatus();
    }

    private void setUploadStatus(int uploaded, Path outputPath) {
        synchronized (statusLock) {
            operation = "SUBIR";
            state = "COMPLETED";
            progress = 100;
            message = "Videos subidos correctamente.";
            startedAt = Instant.now();
            finishedAt = Instant.now();
            statusLogs.clear();
            addLogLocked("Videos subidos: " + uploaded);
            addLogLocked("Ruta de trabajo: " + outputPath);
        }
    }

    private void complete(String successMessage) {
        synchronized (statusLock) {
            state = "COMPLETED";
            progress = 100;
            message = successMessage;
            finishedAt = Instant.now();
            addLogLocked(successMessage);
        }
        log.info(successMessage);
    }

    private void fail(Exception exception) {
        String errorMessage = exception instanceof ApiException ? exception.getMessage() : "Error durante el proceso.";
        synchronized (statusLock) {
            state = "ERROR";
            progress = Math.max(progress, 0);
            message = errorMessage;
            finishedAt = Instant.now();
            addLogLocked(errorMessage);
        }
        log.error("Proceso fallido", exception);
    }

    private void update(int newProgress, String newMessage) {
        synchronized (statusLock) {
            progress = Math.max(0, Math.min(99, newProgress));
            message = newMessage;
            addLogLocked(newMessage);
        }
        log.info(newMessage);
    }

    private void addLog(String logLine) {
        synchronized (statusLock) {
            addLogLocked(logLine);
        }
        log.info(logLine);
    }

    private void addLogLocked(String logLine) {
        statusLogs.addLast("[" + LocalTime.now().format(LOG_TIME) + "] " + logLine);
        while (statusLogs.size() > MAX_LOG_LINES) {
            statusLogs.removeFirst();
        }
    }

    private void ensureNoJobRunning() {
        if (running.get()) {
            throw new ApiException(HttpStatus.CONFLICT, "Ya hay un proceso en ejecucion.");
        }
    }

    private void assertToolsAvailable() {
        checkExecutable(ffmpegProperties.getPath(), "No se ha encontrado FFmpeg. Instalalo o configura la ruta.");
        checkExecutable(ffprobeProperties.getPath(), "No se ha encontrado FFprobe. Instalalo o configura la ruta.");
    }

    private void checkExecutable(String executable, String errorMessage) {
        try {
            Process process = new ProcessBuilder(executable, "-version")
                    .redirectErrorStream(true)
                    .start();
            boolean finished = process.waitFor(15, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                throw new ApiException(HttpStatus.BAD_REQUEST, errorMessage);
            }
            if (process.exitValue() != 0) {
                throw new ApiException(HttpStatus.BAD_REQUEST, errorMessage);
            }
        } catch (IOException exception) {
            throw new ApiException(HttpStatus.BAD_REQUEST, errorMessage, exception);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "La comprobacion de FFmpeg fue interrumpida.", exception);
        }
    }

    private Path resolveOutputPath(String rawPath) {
        if (rawPath == null || rawPath.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Indica una ruta de salida.");
        }
        if (rawPath.indexOf('\0') >= 0 || rawPath.contains("..")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "La ruta de salida contiene caracteres no permitidos.");
        }

        Path path;
        try {
            path = Paths.get(rawPath.trim());
        } catch (InvalidPathException exception) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "La ruta de salida no es valida.", exception);
        }

        if (!path.isAbsolute()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "La ruta de salida debe ser absoluta.");
        }

        Path normalized = path.toAbsolutePath().normalize();
        if (Objects.equals(normalized, normalized.getRoot()) || isDangerousSystemPath(normalized)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "La ruta de salida no es segura.");
        }
        validateAllowedRoots(normalized);

        try {
            Files.createDirectories(normalized);
            if (!Files.isDirectory(normalized)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "La ruta de salida no es una carpeta.");
            }
        } catch (IOException exception) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "No se pudo crear la ruta de salida.", exception);
        }

        return normalized;
    }

    private boolean isDangerousSystemPath(Path path) {
        List<String> candidates = new ArrayList<>();
        candidates.add(System.getenv("SystemRoot"));
        candidates.add(System.getenv("WINDIR"));
        candidates.add(System.getenv("ProgramFiles"));
        candidates.add(System.getenv("ProgramFiles(x86)"));
        candidates.add(System.getenv("ProgramData"));
        candidates.add("/bin");
        candidates.add("/boot");
        candidates.add("/dev");
        candidates.add("/etc");
        candidates.add("/lib");
        candidates.add("/proc");
        candidates.add("/root");
        candidates.add("/sbin");
        candidates.add("/sys");
        candidates.add("/usr");
        candidates.add("/var");

        for (String candidate : candidates) {
            if (candidate == null || candidate.isBlank()) {
                continue;
            }
            try {
                Path dangerous = Paths.get(candidate).toAbsolutePath().normalize();
                if (path.equals(dangerous) || path.startsWith(dangerous)) {
                    return true;
                }
            } catch (InvalidPathException ignored) {
                // Ignore environment variables that are not valid paths on this OS.
            }
        }
        return false;
    }

    private void validateAllowedRoots(Path outputPath) {
        List<Path> allowedRoots = allowedRoots();
        if (allowedRoots.isEmpty()) {
            return;
        }
        boolean allowed = allowedRoots.stream().anyMatch(outputPath::startsWith);
        if (!allowed) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "La ruta de salida no esta dentro de las rutas permitidas.");
        }
    }

    private List<Path> allowedRoots() {
        String raw = storageProperties.getAllowedRoots();
        if (raw == null || raw.isBlank()) {
            return List.of();
        }
        return Arrays.stream(raw.split("[,;]"))
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .map(Paths::get)
                .map(path -> path.toAbsolutePath().normalize())
                .toList();
    }

    private WorkDirs ensureProjectFolders(Path basePath) {
        WorkDirs dirs = new WorkDirs(
                basePath.resolve("original"),
                basePath.resolve("tiktok"),
                basePath.resolve("clips"),
                basePath.resolve("final"),
                basePath.resolve("random"),
                basePath.resolve("temp")
        );
        try {
            Files.createDirectories(dirs.original());
            Files.createDirectories(dirs.tiktok());
            Files.createDirectories(dirs.clips());
            Files.createDirectories(dirs.temp());
        } catch (IOException exception) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "No se pudo crear la estructura de carpetas.", exception);
        }
        return dirs;
    }

    private int convertVideos(WorkDirs dirs, int progressStart, int progressEnd) throws IOException, InterruptedException {
        List<Path> videos = listMp4(dirs.original());
        if (videos.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "No hay videos MP4 en original/.");
        }

        for (int index = 0; index < videos.size(); index++) {
            Path input = videos.get(index);
            Path output = dirs.tiktok().resolve(stripExtension(input.getFileName().toString()) + "_tiktok.mp4");
            update(progressFor(progressStart, progressEnd, index, videos.size()), "Convirtiendo " + input.getFileName());
            runProcess(List.of(
                    ffmpegProperties.getPath(),
                    "-y",
                    "-i", input.toString(),
                    "-vf", "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30",
                    "-c:v", "libx264",
                    "-preset", "fast",
                    "-crf", "20",
                    "-c:a", "aac",
                    output.toString()
            ), dirs.temp(), "No se pudo convertir " + input.getFileName());
        }
        update(progressEnd, "Conversion completada.");
        return videos.size();
    }

    private int cutVideos(WorkDirs dirs, int progressStart, int progressEnd) throws IOException, InterruptedException {
        List<Path> videos = listMp4(dirs.tiktok());
        if (videos.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "No hay videos MP4 en tiktok/.");
        }

        int totalClips = 0;
        for (int videoIndex = 0; videoIndex < videos.size(); videoIndex++) {
            Path video = videos.get(videoIndex);
            double duration = probeDuration(video);
            int clipsForVideo = (int) Math.floor(duration / CLIP_SECONDS);
            if (clipsForVideo <= 0) {
                addLog("Se omite " + video.getFileName() + " porque dura menos de 4 segundos.");
                continue;
            }

            Path clipFolder = dirs.clips().resolve(stripExtension(video.getFileName().toString()));
            Files.createDirectories(clipFolder);
            update(progressFor(progressStart, progressEnd, videoIndex, videos.size()), "Cortando " + video.getFileName());

            for (int clipIndex = 0; clipIndex < clipsForVideo; clipIndex++) {
                int startSeconds = (int) (clipIndex * CLIP_SECONDS);
                Path output = clipFolder.resolve(String.format(Locale.ROOT, "clip_%02d.mp4", clipIndex));
                runProcess(List.of(
                        ffmpegProperties.getPath(),
                        "-y",
                        "-ss", String.valueOf(startSeconds),
                        "-t", "4",
                        "-i", video.toString(),
                        "-c:v", "libx264",
                        "-preset", "fast",
                        "-crf", "20",
                        "-c:a", "aac",
                        output.toString()
                ), dirs.temp(), "No se pudo cortar " + video.getFileName());
                totalClips++;
            }
        }

        if (totalClips == 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "No se pudo crear ningun clip de 4 segundos.");
        }
        update(progressEnd, "Corte completado. Clips creados: " + totalClips + ".");
        return totalClips;
    }

    private void ensureClipsReady(WorkDirs dirs, int progressStart, int progressEnd) throws IOException, InterruptedException {
        if (hasUsableClips(dirs)) {
            addLog("Clips disponibles. Se omiten conversion y corte automaticos.");
            return;
        }

        if (listMp4(dirs.tiktok()).isEmpty()) {
            addLog("No hay clips ni videos convertidos. Se ejecuta conversion previa.");
            convertVideos(dirs, progressStart, progressStart + ((progressEnd - progressStart) / 2));
        }

        if (!hasUsableClips(dirs)) {
            addLog("Se ejecuta corte previo para preparar clips.");
            cutVideos(dirs, progressStart + ((progressEnd - progressStart) / 2) + 1, progressEnd);
        }
    }

    private int mixVideos(WorkDirs dirs, int progressStart, int progressEnd) throws IOException, InterruptedException {
        List<Path> folders = clipFoldersWithClips(dirs);
        if (folders.size() < 3) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Se necesitan al menos 3 carpetas de clips.");
        }

        int maxClipIndex = maxClipIndex(folders);
        int totalTasks = countMixTasks(folders, maxClipIndex);
        if (totalTasks == 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "No hay grupos de 3 clips compatibles para mezclar.");
        }

        int outputIndex = 0;
        int processed = 0;
        for (int clipIndex = 0; clipIndex <= maxClipIndex; clipIndex++) {
            for (int groupStart = 0; groupStart + 2 < folders.size(); groupStart += 3) {
                List<Path> clips = List.of(
                        clipPath(folders.get(groupStart), clipIndex),
                        clipPath(folders.get(groupStart + 1), clipIndex),
                        clipPath(folders.get(groupStart + 2), clipIndex)
                );
                if (!clips.stream().allMatch(Files::isRegularFile)) {
                    continue;
                }

                Path output = dirs.finalDir().resolve(String.format(Locale.ROOT, "final_%02d.mp4", outputIndex));
                update(progressFor(progressStart, progressEnd, processed, totalTasks), "Mezclando " + output.getFileName());
                concatClips(clips, output, dirs.temp(), false);
                validateGeneratedVideo(output);
                outputIndex++;
                processed++;
            }
        }

        update(progressEnd, "Mezcla completada.");
        return outputIndex;
    }

    private int randomVideos(WorkDirs dirs, int requested, int progressStart, int progressEnd) throws IOException, InterruptedException {
        List<Path> folders = clipFoldersWithClips(dirs);
        if (folders.size() < 3) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Se necesitan al menos 3 carpetas de clips para random.");
        }

        int validVideos = 0;
        int attempts = 0;
        int maxAttempts = Math.max(requested * 5, requested);
        while (validVideos < requested && attempts < maxAttempts) {
            attempts++;
            List<Path> shuffled = new ArrayList<>(folders);
            java.util.Collections.shuffle(shuffled, random);
            List<Path> selectedFolders = shuffled.subList(0, 3);
            List<Path> selectedClips = new ArrayList<>();
            for (Path folder : selectedFolders) {
                List<Path> clips = listClipFiles(folder);
                selectedClips.add(clips.get(random.nextInt(clips.size())));
            }

            Path output = dirs.randomDir().resolve(String.format(Locale.ROOT, "video_%02d.mp4", validVideos));
            update(progressFor(progressStart, progressEnd, validVideos, requested), "Generando random " + output.getFileName());
            concatClips(selectedClips, output, dirs.temp(), true);
            if (validateGeneratedVideo(output)) {
                validVideos++;
            }
        }

        if (validVideos == 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "No se pudo generar ningun video random valido.");
        }
        if (validVideos < requested) {
            addLog("Solo se generaron " + validVideos + " videos random validos de " + requested + " solicitados.");
        }
        update(progressEnd, "Random completado.");
        return validVideos;
    }

    private void concatClips(List<Path> clips, Path output, Path tempDir, boolean limitToTwelveSeconds) throws IOException, InterruptedException {
        Files.createDirectories(tempDir);
        Files.createDirectories(output.getParent());
        Path listFile = Files.createTempFile(tempDir, "concat-", ".txt");
        try {
            List<String> lines = clips.stream()
                    .map(Path::toAbsolutePath)
                    .map(Path::normalize)
                    .map(this::toFfmpegConcatLine)
                    .toList();
            Files.write(listFile, lines, StandardCharsets.UTF_8);

            List<String> command = new ArrayList<>(List.of(
                    ffmpegProperties.getPath(),
                    "-y",
                    "-f", "concat",
                    "-safe", "0",
                    "-i", listFile.toString()
            ));
            if (limitToTwelveSeconds) {
                command.add("-t");
                command.add("12");
            }
            command.addAll(List.of(
                    "-c:v", "libx264",
                    "-preset", "fast",
                    "-crf", "20",
                    "-c:a", "aac",
                    "-pix_fmt", "yuv420p",
                    output.toString()
            ));
            runProcess(command, tempDir, "No se pudo concatenar clips en " + output.getFileName());
        } finally {
            Files.deleteIfExists(listFile);
        }
    }

    private boolean validateGeneratedVideo(Path video) throws IOException, InterruptedException {
        double duration = probeDuration(video);
        if (duration < MIN_VALID_SECONDS) {
            Files.deleteIfExists(video);
            String reason = String.format(Locale.ROOT, "Borrado %s porque dura %.2f segundos (< %.0f).",
                    video.getFileName(), duration, MIN_VALID_SECONDS);
            addLog(reason);
            log.warn(reason);
            return false;
        }
        return true;
    }

    private double probeDuration(Path video) throws IOException, InterruptedException {
        ProcessResult result = runProcess(List.of(
                ffprobeProperties.getPath(),
                "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1",
                video.toString()
        ), video.getParent(), "No se pudo comprobar la duracion de " + video.getFileName());

        Optional<String> rawDuration = result.output().stream()
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .findFirst();
        if (rawDuration.isEmpty()) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "FFprobe no devolvio la duracion de " + video.getFileName());
        }
        try {
            return Double.parseDouble(rawDuration.get().replace(',', '.'));
        } catch (NumberFormatException exception) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "La duracion devuelta por FFprobe no es valida.", exception);
        }
    }

    private ProcessResult runProcess(List<String> command, Path workDir, String failureMessage) throws IOException, InterruptedException {
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        if (workDir != null) {
            Files.createDirectories(workDir);
            processBuilder.directory(workDir.toFile());
        }
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();
        List<String> output = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.add(line);
            }
        }

        boolean finished = process.waitFor(6, TimeUnit.HOURS);
        if (!finished) {
            process.destroyForcibly();
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, failureMessage + " El proceso excedio el tiempo maximo.");
        }

        int exitCode = process.exitValue();
        if (exitCode != 0) {
            String detail = output.stream()
                    .skip(Math.max(0, output.size() - 8))
                    .reduce("", (left, right) -> left + System.lineSeparator() + right)
                    .trim();
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, failureMessage + (detail.isBlank() ? "" : ": " + detail));
        }
        return new ProcessResult(exitCode, output);
    }

    private List<Path> listMp4(Path directory) throws IOException {
        if (!Files.isDirectory(directory)) {
            return List.of();
        }
        try (Stream<Path> stream = Files.list(directory)) {
            return stream
                    .filter(Files::isRegularFile)
                    .filter(path -> path.getFileName().toString().toLowerCase(Locale.ROOT).endsWith(".mp4"))
                    .sorted(Comparator.comparing(path -> path.getFileName().toString().toLowerCase(Locale.ROOT)))
                    .toList();
        }
    }

    private List<Path> clipFoldersWithClips(WorkDirs dirs) throws IOException {
        if (!Files.isDirectory(dirs.clips())) {
            return List.of();
        }
        try (Stream<Path> stream = Files.list(dirs.clips())) {
            return stream
                    .filter(Files::isDirectory)
                    .filter(path -> {
                        try {
                            return !listClipFiles(path).isEmpty();
                        } catch (IOException exception) {
                            throw new UncheckedIOException(exception);
                        }
                    })
                    .sorted(Comparator.comparing(path -> path.getFileName().toString().toLowerCase(Locale.ROOT)))
                    .toList();
        } catch (UncheckedIOException exception) {
            throw exception.getCause();
        }
    }

    private boolean hasUsableClips(WorkDirs dirs) throws IOException {
        return clipFoldersWithClips(dirs).size() >= 3;
    }

    private List<Path> listClipFiles(Path folder) throws IOException {
        if (!Files.isDirectory(folder)) {
            return List.of();
        }
        try (Stream<Path> stream = Files.list(folder)) {
            return stream
                    .filter(Files::isRegularFile)
                    .filter(path -> CLIP_PATTERN.matcher(path.getFileName().toString()).matches())
                    .sorted(Comparator.comparingInt(this::clipIndex))
                    .toList();
        }
    }

    private int maxClipIndex(List<Path> folders) throws IOException {
        int max = -1;
        for (Path folder : folders) {
            for (Path clip : listClipFiles(folder)) {
                max = Math.max(max, clipIndex(clip));
            }
        }
        return max;
    }

    private int countMixTasks(List<Path> folders, int maxClipIndex) {
        int tasks = 0;
        for (int clipIndex = 0; clipIndex <= maxClipIndex; clipIndex++) {
            for (int groupStart = 0; groupStart + 2 < folders.size(); groupStart += 3) {
                if (Files.isRegularFile(clipPath(folders.get(groupStart), clipIndex))
                        && Files.isRegularFile(clipPath(folders.get(groupStart + 1), clipIndex))
                        && Files.isRegularFile(clipPath(folders.get(groupStart + 2), clipIndex))) {
                    tasks++;
                }
            }
        }
        return tasks;
    }

    private Path clipPath(Path folder, int clipIndex) {
        return folder.resolve(String.format(Locale.ROOT, "clip_%02d.mp4", clipIndex));
    }

    private int clipIndex(Path clip) {
        Matcher matcher = CLIP_PATTERN.matcher(clip.getFileName().toString());
        if (!matcher.matches()) {
            return Integer.MAX_VALUE;
        }
        return Integer.parseInt(matcher.group(1));
    }

    private int progressFor(int start, int end, int currentIndex, int total) {
        if (total <= 0) {
            return end;
        }
        double ratio = currentIndex / (double) total;
        return start + (int) Math.round((end - start) * ratio);
    }

    private String toFfmpegConcatLine(Path path) {
        String normalized = path.toString().replace('\\', '/').replace("'", "'\\''");
        return "file '" + normalized + "'";
    }

    private String sanitizeFilename(String originalFilename) {
        String fallback = "video.mp4";
        String name = Optional.ofNullable(originalFilename)
                .map(Paths::get)
                .map(Path::getFileName)
                .map(Path::toString)
                .orElse(fallback);
        String sanitized = name.replaceAll("[^A-Za-z0-9._-]", "_");
        return sanitized.isBlank() ? fallback : sanitized;
    }

    private Path uniqueTarget(Path target) {
        if (!Files.exists(target)) {
            return target;
        }
        String filename = target.getFileName().toString();
        String base = stripExtension(filename);
        String extension = filename.contains(".") ? filename.substring(filename.lastIndexOf('.')) : "";
        for (int index = 1; index < 10_000; index++) {
            Path candidate = target.getParent().resolve(base + "_" + index + extension);
            if (!Files.exists(candidate)) {
                return candidate;
            }
        }
        throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "No se pudo crear un nombre unico para " + filename);
    }

    private Path prepareResultDirectory(Path preferredDirectory) throws IOException {
        Path resultDirectory = uniqueDirectoryForRun(preferredDirectory);
        Files.createDirectories(resultDirectory);
        if (!resultDirectory.equals(preferredDirectory)) {
            addLog("La carpeta " + preferredDirectory.getFileName() + " ya existia. Nueva salida: " + resultDirectory.getFileName());
        }
        return resultDirectory;
    }

    private Path uniqueDirectoryForRun(Path preferredDirectory) throws IOException {
        if (!Files.exists(preferredDirectory) || isDirectoryEmpty(preferredDirectory)) {
            return preferredDirectory;
        }

        String baseName = preferredDirectory.getFileName().toString();
        Path parent = preferredDirectory.getParent();
        for (int index = 1; index < 10_000; index++) {
            Path candidate = parent.resolve(baseName + "_" + index);
            if (!Files.exists(candidate)) {
                return candidate;
            }
            if (Files.isDirectory(candidate) && isDirectoryEmpty(candidate)) {
                return candidate;
            }
        }
        throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "No se pudo crear una carpeta de salida unica para " + baseName);
    }

    private boolean isDirectoryEmpty(Path directory) throws IOException {
        if (!Files.isDirectory(directory)) {
            return false;
        }
        try (Stream<Path> stream = Files.list(directory)) {
            return stream.findFirst().isEmpty();
        }
    }

    private void cleanupIntermediateFolders(WorkDirs dirs) throws IOException {
        deleteDirectory(dirs.original());
        deleteDirectory(dirs.tiktok());
        deleteDirectory(dirs.clips());
        deleteDirectory(dirs.temp());
        addLog("Borradas carpetas intermedias: original, tiktok, clips y temp.");
    }

    private String stripExtension(String filename) {
        int dot = filename.lastIndexOf('.');
        return dot > 0 ? filename.substring(0, dot) : filename;
    }

    private int normalizeRandomCount(Integer randomCount) {
        if (randomCount == null || randomCount < 1) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Indica cuantos videos random quieres generar.");
        }
        if (randomCount > 10_000) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "La cantidad de videos random es demasiado alta.");
        }
        return randomCount;
    }

    private void deleteDirectoryContents(Path directory) throws IOException {
        if (!Files.exists(directory)) {
            return;
        }
        try (Stream<Path> stream = Files.walk(directory)) {
            stream
                    .sorted(Comparator.reverseOrder())
                    .filter(path -> !path.equals(directory))
                    .forEach(path -> {
                        try {
                            Files.deleteIfExists(path);
                        } catch (IOException exception) {
                            throw new UncheckedIOException(exception);
                        }
                    });
        } catch (UncheckedIOException exception) {
            throw exception.getCause();
        }
    }

    private void deleteDirectory(Path directory) throws IOException {
        if (!Files.exists(directory)) {
            return;
        }
        try (Stream<Path> stream = Files.walk(directory)) {
            stream
                    .sorted(Comparator.reverseOrder())
                    .forEach(path -> {
                        try {
                            Files.deleteIfExists(path);
                        } catch (IOException exception) {
                            throw new UncheckedIOException(exception);
                        }
                    });
        } catch (UncheckedIOException exception) {
            throw exception.getCause();
        }
    }

    @FunctionalInterface
    private interface ThrowingRunnable {
        void run() throws Exception;
    }

    private record WorkDirs(
            Path original,
            Path tiktok,
            Path clips,
            Path finalDir,
            Path randomDir,
            Path temp
    ) {
        private WorkDirs withFinalDir(Path newFinalDir) {
            return new WorkDirs(original, tiktok, clips, newFinalDir, randomDir, temp);
        }

        private WorkDirs withRandomDir(Path newRandomDir) {
            return new WorkDirs(original, tiktok, clips, finalDir, newRandomDir, temp);
        }
    }

    private record ProcessResult(
            int exitCode,
            List<String> output
    ) {
    }
}
