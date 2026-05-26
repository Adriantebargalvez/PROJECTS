package com.generatevideos.tiktok.dto;

public record UploadResponse(
        String message,
        int uploadedFiles,
        String outputPath,
        VideoStatusResponse status
) {
}
