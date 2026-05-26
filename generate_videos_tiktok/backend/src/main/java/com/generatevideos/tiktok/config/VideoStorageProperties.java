package com.generatevideos.tiktok.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "video")
public class VideoStorageProperties {

    private String allowedRoots = "";

    public String getAllowedRoots() {
        return allowedRoots;
    }

    public void setAllowedRoots(String allowedRoots) {
        this.allowedRoots = allowedRoots;
    }
}
