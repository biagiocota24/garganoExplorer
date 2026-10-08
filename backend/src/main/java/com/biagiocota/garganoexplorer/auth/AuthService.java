package com.biagiocota.garganoexplorer.auth;

import com.biagiocota.garganoexplorer.security.JwtService;
import com.biagiocota.garganoexplorer.user.Role;
import com.biagiocota.garganoexplorer.user.User;
import com.biagiocota.garganoexplorer.user.UserRepository;
import com.biagiocota.garganoexplorer.user.UserResponse;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private String dummyPasswordHash;


    @PostConstruct
    private void initDummyPasswordHash() {
        dummyPasswordHash = passwordEncoder.encode(UUID.randomUUID().toString());
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyUsedException("Questa email risulta già utilizzata");
        }
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setFirstName(normalizeName(request.firstName()));
        newUser.setLastName(normalizeName(request.lastName()));
        String encodedPassword = passwordEncoder.encode(request.password());
        newUser.setPassword(encodedPassword);
        Role role = switch (request.accountType()) {
            case OWNER -> Role.OWNER;
            case VISITOR -> Role.VISITOR;
        };
        newUser.setRole(role);
        User saved = userRepository.saveAndFlush(newUser);
        return UserResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public LoginResult login(LoginRequest request) {
        String email = normalizeEmail(request.email());

        User userFound = userRepository.findByEmail(email).orElse(null);
        //ESEGUE BCRYPT ANCHE CON USER INESISTENTE PER RENDERE I TEMPI DI RISPOSTA UNIFORMI
        if (userFound == null) {
            passwordEncoder.matches(request.password(), dummyPasswordHash);
            throw new InvalidCredentialsException();
        }
        boolean passwordMatch = passwordEncoder.matches(request.password(), userFound.getPassword());
        if (!passwordMatch) {
            throw new InvalidCredentialsException();
        }
        String token = jwtService.generateToken(userFound);

        UserResponse response = UserResponse.from(userFound);
        return new LoginResult(token, response);
    }

    private String normalizeEmail(String email) {
        return email.toLowerCase(Locale.ROOT).trim();
    }

    private String normalizeName(String name) {
        return name.trim().replaceAll("\\s+", " ");
    }


}
