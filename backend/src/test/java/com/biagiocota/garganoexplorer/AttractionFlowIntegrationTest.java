package com.biagiocota.garganoexplorer;

import com.biagiocota.garganoexplorer.user.Role;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import java.util.UUID;


public class AttractionFlowIntegrationTest extends IntegrationTestSupport {

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
