package com.generatevideos.tiktok.dto;

import java.time.Instant;
import java.util.List;

public record VideoStatusResponse(
        String operation,
        String state,
        int progress,
        boolean running,
        String message,
        List<String> logs,
        Instant startedAt,
        Instant finishedAt
) {
}
