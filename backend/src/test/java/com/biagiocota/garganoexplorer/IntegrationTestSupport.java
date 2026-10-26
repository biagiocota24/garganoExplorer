package com.biagiocota.garganoexplorer;

import com.biagiocota.garganoexplorer.user.Role;
import com.biagiocota.garganoexplorer.user.User;
import com.biagiocota.garganoexplorer.user.UserRepository;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestContainerConfiguration.class)
public abstract class IntegrationTestSupport {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected PasswordEncoder passwordEncoder;

    private static final String PASSWORD = "password123";


    protected String createUser(Role role) {
        User user = new User();
        String emailGenerated = "admin-" + UUID.randomUUID() + "@test.com";
        user.setEmail(emailGenerated);
        user.setPassword(passwordEncoder.encode(PASSWORD));
        user.setFirstName("Flow");
        user.setLastName("Test");
        user.setRole(role);
        userRepository.saveAndFlush(user);
        return emailGenerated;
    }


    protected Cookie loginAs(String email) throws Exception {
        String body = """
                {"email":"%s",
                "password":"%s"}
                """.formatted(email, PASSWORD);
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andReturn();
        return result.getResponse().getCookie("access_token");
    }
}
