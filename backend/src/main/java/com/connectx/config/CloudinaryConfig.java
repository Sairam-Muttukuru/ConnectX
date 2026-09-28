package com.connectx.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud-name:}")
    private String cloudName;

    @Value("${cloudinary.api-key:}")
    private String apiKey;

    @Value("${cloudinary.api-secret:}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", (cloudName != null && !cloudName.isBlank()) ? cloudName : "demo");
        config.put("api_key", (apiKey != null && !apiKey.isBlank()) ? apiKey : "dummy");
        config.put("api_secret", (apiSecret != null && !apiSecret.isBlank()) ? apiSecret : "dummy");
        return new Cloudinary(config);
    }
}
