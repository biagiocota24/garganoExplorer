package com.biagiocota.garganoexplorer.auth;

import com.biagiocota.garganoexplorer.security.AuthCookieFactory;
import com.biagiocota.garganoexplorer.user.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final AuthCookieFactory authCookieFactory;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@RequestBody @Valid RegisterRequest request) {
        return authService.register(request);
    }


    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody @Valid LoginRequest request) {
        LoginResult loginResult = authService.login(request);
        ResponseCookie cookie = authCookieFactory.createAuthCookie(loginResult.token());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(loginResult.user());
    }
}
