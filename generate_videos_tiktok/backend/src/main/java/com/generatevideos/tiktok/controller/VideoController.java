package com.generatevideos.tiktok.controller;

import com.generatevideos.tiktok.dto.ProcessRequest;
import com.generatevideos.tiktok.dto.UploadResponse;
import com.generatevideos.tiktok.dto.VideoStatusResponse;
import com.generatevideos.tiktok.service.VideoProcessingService;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/videos")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
public class VideoController {

    private final VideoProcessingService videoProcessingService;

    public VideoController(VideoProcessingService videoProcessingService) {
        this.videoProcessingService = videoProcessingService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UploadResponse upload(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("outputPath") String outputPath
    ) {
        return videoProcessingService.upload(files, outputPath);
    }

    @PostMapping("/convert")
    public ResponseEntity<VideoStatusResponse> convert(@RequestBody ProcessRequest request) {
        return ResponseEntity.accepted().body(videoProcessingService.startConvert(request.outputPath()));
    }

    @PostMapping("/cut")
    public ResponseEntity<VideoStatusResponse> cut(@RequestBody ProcessRequest request) {
        return ResponseEntity.accepted().body(videoProcessingService.startCut(request.outputPath()));
    }

    @PostMapping("/mix")
    public ResponseEntity<VideoStatusResponse> mix(@RequestBody ProcessRequest request) {
        return ResponseEntity.accepted().body(videoProcessingService.startMix(request.outputPath()));
    }

    @PostMapping("/random")
    public ResponseEntity<VideoStatusResponse> random(@RequestBody ProcessRequest request) {
        return ResponseEntity.accepted().body(videoProcessingService.startRandom(request.outputPath(), request.randomCount()));
    }

    @PostMapping("/run-all")
    public ResponseEntity<VideoStatusResponse> runAll(@RequestBody ProcessRequest request) {
        return ResponseEntity.accepted().body(videoProcessingService.startRunAll(request.outputPath(), request.randomCount()));
    }

    @DeleteMapping("/clean")
    public VideoStatusResponse clean(@RequestParam("outputPath") String outputPath) {
        return videoProcessingService.clean(outputPath);
    }

    @GetMapping("/status")
    public VideoStatusResponse status() {
        return videoProcessingService.getStatus();
    }
}
