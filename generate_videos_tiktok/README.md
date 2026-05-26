# generate_videos_tiktok

Aplicacion Angular + Spring Boot para automatizar conversion, corte, mezcla y generacion random de videos con FFmpeg.

## Estructura

```text
generate_videos_tiktok/
  backend/
  frontend/
  docker-compose.yml
  README.md
```

La ruta de salida indicada en la interfaz se prepara asi:

```text
ruta-elegida/
  original/
  tiktok/
  clips/
  final/
  random/
  temp/
```

Al usar `Ejecutar todo`, al terminar se borran las carpetas intermedias `original/`, `tiktok/`, `clips/` y `temp/`. Solo quedan las carpetas de resultado `final/` y `random/`.

Si ya existe una carpeta de resultado con videos, la nueva ejecucion usa un nombre numerado para no pisar resultados anteriores:

```text
final/
final_1/
random/
random_1/
```

## Arranque local en Windows

FFmpeg no esta en el PATH de este equipo. Puedes ponerlo en el PATH o configurar sus rutas antes de arrancar el backend:

```powershell
cd C:\Users\Adrian\Documents\GitHub\PROJECTS\generate_videos_tiktok\backend
$env:FFMPEG_PATH="C:\Users\Adrian\Desktop\BIBOBOT KIDS\ffmpeg-8.0.1-essentials_build\ffmpeg-8.0.1-essentials_build\bin\ffmpeg.exe"
$env:FFPROBE_PATH="C:\Users\Adrian\Desktop\BIBOBOT KIDS\ffmpeg-8.0.1-essentials_build\ffmpeg-8.0.1-essentials_build\bin\ffprobe.exe"
mvn spring-boot:run
```

En otra terminal:

```powershell
cd C:\Users\Adrian\Documents\GitHub\PROJECTS\generate_videos_tiktok\frontend
npm.cmd install
npm.cmd start
```

Abre la interfaz en:

```text
http://localhost:4200
```

El proxy de Angular envia `/api/videos` al backend en `http://localhost:8080`.

## Comandos de verificacion

```powershell
cd C:\Users\Adrian\Documents\GitHub\PROJECTS\generate_videos_tiktok\backend
mvn test

cd C:\Users\Adrian\Documents\GitHub\PROJECTS\generate_videos_tiktok\frontend
npm.cmd run build
```

## Docker

El backend del Dockerfile instala FFmpeg dentro del contenedor. En Docker, usa una ruta de salida dentro de `/data`, por ejemplo:

```text
/data/work
```

Arranque:

```powershell
cd C:\Users\Adrian\Documents\GitHub\PROJECTS\generate_videos_tiktok
docker compose up --build
```

Frontend:

```text
http://localhost:4200
```

Backend:

```text
http://localhost:8080
```

## Uso desde movil

Si ejecutas el backend en tu ordenador, el procesamiento solo funcionara mientras ese ordenador este encendido. Para usar la app desde movil sin depender del PC, despliega backend y frontend en un VPS, servidor o cloud con FFmpeg instalado. El movil solo abre la interfaz web; el servidor es el que ejecuta FFmpeg y guarda los resultados.

Con Docker Compose en un servidor, publica el puerto del frontend y usa `/data/work` como ruta de salida.

## Endpoints

- `POST /api/videos/upload`
- `POST /api/videos/convert`
- `POST /api/videos/cut`
- `POST /api/videos/mix`
- `POST /api/videos/random`
- `POST /api/videos/run-all`
- `DELETE /api/videos/clean`
- `GET /api/videos/status`

## Notas de seguridad

- La ruta de salida debe ser absoluta.
- Se rechazan rutas de sistema peligrosas.
- En Docker se restringe la salida a `/data` con `VIDEO_ALLOWED_ROOTS=/data`.
- FFmpeg y FFprobe se ejecutan con `ProcessBuilder`, sin concatenar comandos como strings.
