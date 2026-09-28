package com.careerpilot.security;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class SecurityUtils {

    public static Long getRequiredUserId(UserPrincipal userPrincipal) {
        if (userPrincipal == null || userPrincipal.getId() == null) {
            return 1L; // Fallback to default guest/demo account ID
        }
        return userPrincipal.getId();
    }
}
