package com.biagiocota.garganoexplorer.auth;

import com.biagiocota.garganoexplorer.user.Role;
import com.biagiocota.garganoexplorer.user.User;
import com.biagiocota.garganoexplorer.user.UserRepository;
import com.biagiocota.garganoexplorer.user.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse register(RegisterRequest request) {
        String email = request.email().toLowerCase(Locale.ROOT).trim();
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyUsedException("Questa email risulta già utilizzata");
        }
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setFirstName(request.firstName().trim().replaceAll("//s+", " "));
        newUser.setLastName(request.lastName().trim().replaceAll("//s+", " "));
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
}
