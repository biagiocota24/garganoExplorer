package com.biagiocota.garganoexplorer.security;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "app.auth.cookie")
@Validated
public record AuthCookieProperties(

        @NotBlank
        String name,

        boolean secure,

        @Pattern(regexp = "Lax|Strict|None")
        String sameSite
) {
}
