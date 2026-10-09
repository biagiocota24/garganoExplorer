package com.biagiocota.garganoexplorer.auth;

import com.biagiocota.garganoexplorer.TestContainerConfiguration;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;


@SpringBootTest
@AutoConfigureMockMvc
@Import(TestContainerConfiguration.class)
public class AuthFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void fullAuthenticationFlow_worksEndToEnd() throws Exception {
        // Registrazione
        String registerJson = """
                {
                    "email": "flow@test.com",
                    "password": "password123",
                    "firstName": "Flow",
                    "lastName": "Test",
                    "accountType": "VISITOR"
                }
                """;
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerJson))
                .andExpect(status().isCreated());

        // Login ritorna il cookie
        String loginJson = """
                {
                    "email": "flow@test.com",
                    "password": "password123"
                }
                """;
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isOk())
                .andReturn();
        Cookie authCookie = loginResult.getResponse().getCookie("access_token");

        // /Me con il cookie
        mockMvc.perform(get("/api/users/me")
                        .cookie(authCookie))
                .andExpect(status().isOk());

        // Logout
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isNoContent());

        // /Me senza cookie
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized());
    }

}