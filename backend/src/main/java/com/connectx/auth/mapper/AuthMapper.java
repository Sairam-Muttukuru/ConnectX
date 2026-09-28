package com.connectx.auth.mapper;

import com.connectx.auth.dto.AuthUserResponse;
import com.connectx.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {

    public AuthUserResponse toAuthUserResponse(User user) {
        if (user == null) {
            return null;
        }
        return new AuthUserResponse(
            user.getId(),
            user.getUsername(),
            user.getDisplayName() != null ? user.getDisplayName() : user.getUsername(),
            user.getEmail(),
            user.getAvatarUrl(),
            user.isEmailVerified(),
            user.getAccountStatus()
        );
    }
}
