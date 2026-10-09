package com.biagiocota.garganoexplorer.user;

import com.biagiocota.garganoexplorer.common.tools.TextNormalizerTools;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements ApplicationRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminProperties adminProperties;


    @Override
    public void run(ApplicationArguments args) throws Exception {

        if (adminProperties.email() == null ||
                adminProperties.password() == null ||
                adminProperties.email().isBlank() ||
                adminProperties.password().isBlank()) {
            log.info("Admin non configurato");
            return;
        }

        String email = TextNormalizerTools.email(adminProperties.email());
        if (userRepository.existsByEmail(email)) {
            log.info("Admin già presente");
            return;
        }
        User adminUser = new User();
        adminUser.setFirstName("admin");
        adminUser.setLastName("GarganoExplorer");
        adminUser.setEmail(email);
        String hashedPassword = passwordEncoder.encode(adminProperties.password());
        adminUser.setPassword(hashedPassword);
        adminUser.setRole(Role.ADMIN);

        userRepository.save(adminUser);
        log.info("Admin creato {}", email);
    }

}
