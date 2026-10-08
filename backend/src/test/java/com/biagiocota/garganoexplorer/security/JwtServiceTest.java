package com.biagiocota.garganoexplorer.security;


import com.biagiocota.garganoexplorer.user.User;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;


public class JwtServiceTest {
    private static final String SECRET = "test-secret-0123456789-0123456789-0123456789-0123456789";
    private final JwtService jwtService = new JwtService(new JwtProperties(SECRET, Duration.ofHours(1)));

    private User createUserWithRandomId() {
        User newUser = new User();
        UUID idRandom = UUID.randomUUID();
        newUser.setId(idRandom);
        return newUser;
    }

    @Test
    void generateToken_thenExtractUserId_returnSameId() {
        User newUser = createUserWithRandomId();

        String generatedToken = jwtService.generateToken(newUser);
        UUID extractedId = jwtService.extractUserId(generatedToken);

        assertThat(extractedId).isEqualTo(newUser.getId());
    }


    @Test
    void extractUserId_withTokenSignedByOtherKey_throwsJwtException() {
        JwtProperties fakeJwtProperties = new JwtProperties("12345678901234567890123456789012", Duration.ofHours(24));
        JwtService otherKeyJwtService = new JwtService(fakeJwtProperties);

        User newUser = createUserWithRandomId();
        String generatedToken = otherKeyJwtService.generateToken(newUser);

        assertThrows(JwtException.class, () -> jwtService.extractUserId(generatedToken));
    }

    @Test
    void extractUserId_withExpiredToken_throwsExpiredJwtException() {
        JwtProperties fakeJwtProperties = new JwtProperties(SECRET, Duration.ofMinutes(-10));
        JwtService expiredJwtService = new JwtService(fakeJwtProperties);

        User newUser = createUserWithRandomId();
        String generatedToken = expiredJwtService.generateToken(newUser);

        assertThrows(ExpiredJwtException.class, () -> expiredJwtService.extractUserId(generatedToken));
    }

}
