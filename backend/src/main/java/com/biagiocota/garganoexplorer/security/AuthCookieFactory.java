package com.biagiocota.garganoexplorer.security;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@RequiredArgsConstructor
public class AuthCookieFactory {

    private final AuthCookieProperties authCookieProperties;
    private final JwtService jwtService;


    public ResponseCookie createAuthCookie(String token) {
        return createResponseCookie(token, jwtService.getExpiration());
    }

    public ResponseCookie clearAuthCookie() {
        return createResponseCookie("", Duration.ZERO);
    }

    private ResponseCookie createResponseCookie(String value, Duration maxAge) {
        return ResponseCookie.from(authCookieProperties.name(), value)
                .httpOnly(true)
                .secure(authCookieProperties.secure())
                .sameSite(authCookieProperties.sameSite())
                .path("/")
                .maxAge(maxAge)
                .build();
    }

}
