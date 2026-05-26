package com.generatevideos.tiktok.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "ffprobe")
public class FfprobeProperties {

    private String path = "ffprobe";

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}
