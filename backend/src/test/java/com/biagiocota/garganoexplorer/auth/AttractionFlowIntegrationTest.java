package com.biagiocota.garganoexplorer.auth;

import com.biagiocota.garganoexplorer.TestContainerConfiguration;
import com.biagiocota.garganoexplorer.user.Role;
import com.biagiocota.garganoexplorer.user.User;
import com.biagiocota.garganoexplorer.user.UserRepository;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import java.util.UUID;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestContainerConfiguration.class)
public class AttractionFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String PASSWORD = "password123";
    private static final String VALID_BODY = """
            {
              "name": "Baia delle Zagare",
              "description": "Una delle baie più famose del Gargano, con i faraglioni bianchi che emergono dal mare cristallino. Si raggiunge dal mare oppure attraverso gli stabilimenti della zona. Il periodo migliore per visitarla va da giugno a settembre.",
              "town": "MATTINATA",
              "category": "BEACH"
            }
            """;
    private static final String INVALID_BODY = """
            {
              "name": "Baia delle Zagare",
              "description": "Una delle baie p",
              "town": "MATTINATA",
              "category": "BEACH"
            }
            """;

    private String createUser(Role role) {
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

    private Cookie loginAs(String email) throws Exception {
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

    @Test
    void creatAsVisitorReturn403() throws Exception {
        String email = createUser(Role.VISITOR);
        Cookie cookie = loginAs(email);

        mockMvc.perform(post("/api/attractions")
                        .cookie(cookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_BODY))
                .andExpect(status().isForbidden());
    }

    @Test
    void listIsPublic() throws Exception {
        mockMvc.perform(get("/api/attractions")).andExpect(status().isOk());
    }

    @Test
    void createWithoutLoginReturn401() throws Exception {
        mockMvc.perform(post("/api/attractions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_BODY))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createAsAdminReturn201() throws Exception {
        String adminEmail = createUser(Role.ADMIN);
        Cookie cookie = loginAs(adminEmail);

        mockMvc.perform(post("/api/attractions")
                        .cookie(cookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_BODY))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    void createWithInvalidBodyReturns400() throws Exception {
        String adminEmail = createUser(Role.ADMIN);
        Cookie cookie = loginAs(adminEmail);

        mockMvc.perform(post("/api/attractions")
                        .cookie(cookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(INVALID_BODY))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.description").exists());
    }

    @Test
    void getUnkownIdReturn404() throws Exception {
        UUID randomId = UUID.randomUUID();

        mockMvc.perform(get("/api/attractions/" + randomId))
                .andExpect(status().isNotFound());
    }


}
