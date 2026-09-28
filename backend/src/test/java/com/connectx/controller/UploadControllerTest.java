package com.connectx.controller;

import com.connectx.service.CloudinaryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class UploadControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CloudinaryService cloudinaryService;

    @InjectMocks
    private UploadController uploadController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(uploadController).build();
    }

    @Test
    @DisplayName("Should successfully upload avatar and return URL")
    void shouldUploadAvatarSuccessfully() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "avatar.png",
                "image/png",
                "sample-image-bytes".getBytes()
        );

        when(cloudinaryService.uploadAvatar(any()))
                .thenReturn(new CloudinaryService.UploadResult("https://res.cloudinary.com/connectx/image/upload/v1/avatar.png", "avatar_123"));

        mockMvc.perform(multipart("/api/upload/avatar").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.url").value("https://res.cloudinary.com/connectx/image/upload/v1/avatar.png"))
                .andExpect(jsonPath("$.publicId").value("avatar_123"));
    }
}
