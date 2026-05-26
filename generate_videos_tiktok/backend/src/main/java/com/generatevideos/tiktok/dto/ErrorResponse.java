package com.generatevideos.tiktok.dto;

import java.time.Instant;

public record ErrorResponse(
        String message,
        String detail,
        Instant timestamp
) {
}
