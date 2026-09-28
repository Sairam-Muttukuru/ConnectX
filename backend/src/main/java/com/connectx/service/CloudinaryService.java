package com.connectx.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.connectx.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;
import java.util.Set;

@Service
public class CloudinaryService {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryService.class);

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/svg+xml"
    );

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    private final Cloudinary cloudinary;

    @Value("${cloudinary.api-key:}")
    private String apiKey;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public UploadResult uploadAvatar(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded avatar image file cannot be empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("Avatar image size exceeds the maximum limit of 5MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Unsupported image format. Allowed formats: JPEG, PNG, WEBP, GIF");
        }

        // Check if real Cloudinary credentials are configured
        boolean hasValidCredentials = apiKey != null && !apiKey.isBlank() && !"dummy".equalsIgnoreCase(apiKey);

        if (hasValidCredentials) {
            try {
                @SuppressWarnings("unchecked")
                Map<String, Object> uploadResult = cloudinary.uploader().upload(
                        file.getBytes(),
                        ObjectUtils.asMap(
                                "folder", "connectx/avatars",
                                "resource_type", "image",
                                "transformation", "c_fill,g_face,w_300,h_300,q_auto,f_auto"
                        )
                );

                String secureUrl = (String) uploadResult.get("secure_url");
                String publicId = (String) uploadResult.get("public_id");
                log.info("Successfully uploaded avatar to Cloudinary: publicId={}", publicId);
                return new UploadResult(secureUrl, publicId);

            } catch (Exception e) {
                log.warn("Cloudinary upload failed: {}. Falling back to base64 data URI.", e.getMessage());
            }
        } else {
            log.info("No Cloudinary API key provided or using dummy. Using base64 data URI fallback for development.");
        }

        // Graceful development fallback: Convert to data URI so avatar displays instantly without cloud credentials
        try {
            String base64Data = Base64.getEncoder().encodeToString(file.getBytes());
            String dataUri = "data:" + contentType + ";base64," + base64Data;
            return new UploadResult(dataUri, "local-dev-" + System.currentTimeMillis());
        } catch (IOException e) {
            throw new BadRequestException("Failed to process image file: " + e.getMessage());
        }
    }

    public static class UploadResult {
        private final String url;
        private final String publicId;

        public UploadResult(String url, String publicId) {
            this.url = url;
            this.publicId = publicId;
        }

        public String getUrl() {
            return url;
        }

        public String getPublicId() {
            return publicId;
        }
    }
}
