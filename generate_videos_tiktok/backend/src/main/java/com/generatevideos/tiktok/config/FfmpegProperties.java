package com.generatevideos.tiktok.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "ffmpeg")
public class FfmpegProperties {

    private String path = "ffmpeg";

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}
