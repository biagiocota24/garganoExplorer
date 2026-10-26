package com.biagiocota.garganoexplorer;

import com.biagiocota.garganoexplorer.user.Role;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


public class BusinessIntegrationTest extends IntegrationTestSupport{

    private static final String VALID_BUSINESS_BODY = """
        {
          "name": "Trattoria del Porto",
          "description": "Piccola trattoria a conduzione familiare affacciata sul porto, con cucina di mare e piatti della tradizione garganica. Il menu cambia ogni giorno in base al pescato e ai prodotti dell'orto. In estate si mangia sulla terrazza con vista sulle barche dei pescatori.",
          "category": "RESTAURANT",
          "town": "VIESTE",
          "address": "Via del Porto 12, Vieste",
          "website": "https://esempio.it",
          "priceRange": "MODERATE"
        }
        """;

    private static final String VALID_MODIFIED_BUSINESS_BODY = """
        {
          "name": "Modificata trattoria",
          "description": "Piccola trattoria a conduzione familiare affacciata sul porto, con cucina di mare e piatti della tradizione garganica. Il menu cambia ogni giorno in base al pescato e ai prodotti dell'orto. In estate si mangia sulla terrazza con vista sulle barche dei pescatori.",
          "category": "RESTAURANT",
          "town": "VIESTE",
          "address": "Via del Porto 12, Vieste",
          "website": "https://esempio.it",
          "priceRange": "MODERATE"
        }
        """;

    private static final String JAVASCRIPT_WEBSITE_BUSINESS_BODY = """
        {
          "name": "Modificata trattoria",
          "description": "Piccola trattoria a conduzione familiare affacciata sul porto, con cucina di mare e piatti della tradizione garganica. Il menu cambia ogni giorno in base al pescato e ai prodotti dell'orto. In estate si mangia sulla terrazza con vista sulle barche dei pescatori.",
          "category": "RESTAURANT",
          "town": "VIESTE",
          "address": "Via del Porto 12, Vieste",
          "website": "javascript:alert(1)",
          "priceRange": "MODERATE"
        }
        """;

    private String createBusinessAs(Cookie cookie)throws Exception{
        MvcResult result = mockMvc.perform(post("/api/businesses")
                .cookie(cookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(VALID_BUSINESS_BODY))
                .andExpect(status().isCreated())
                .andReturn();
        String json = result.getResponse().getContentAsString();
        return JsonPath.read(json , "$.id");
    }

    @Test
    void createAsOwnerReturns201() throws Exception {
        String ownerEmail = createUser(Role.OWNER);
        Cookie cookie = loginAs(ownerEmail);
        UUID ownerId = userRepository.findByEmail(ownerEmail).orElseThrow().getId();

        mockMvc.perform(post("/api/businesses")
                .cookie(cookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(VALID_BUSINESS_BODY))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.ownerId").value(ownerId.toString()));
    }

    @Test
    void createAsVisitorReturns403()throws Exception{
        String visitorEmail = createUser(Role.VISITOR);
        Cookie cookie = loginAs(visitorEmail);

        mockMvc.perform(post("/api/businesses")
                .cookie(cookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(VALID_BUSINESS_BODY))
                .andExpect(status().isForbidden());
    }

    @Test
    void mineWithoutLoginReturns401() throws Exception {
        mockMvc.perform(get("/api/businesses/mine"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void updateByOwnerReturns200() throws Exception {
        String ownerEmail = createUser(Role.OWNER);
        Cookie cookie = loginAs(ownerEmail);
        String businessId = createBusinessAs(cookie);

        mockMvc.perform(put("/api/businesses/" + businessId)
                .cookie(cookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(VALID_MODIFIED_BUSINESS_BODY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Modificata trattoria"));
    }

    @Test
    void updateByOtherOwnerReturns403()throws Exception{
        String ownerEmail = createUser(Role.OWNER);
        Cookie cookie = loginAs(ownerEmail);
        String businessId = createBusinessAs(cookie);
        String otherOwnerEmail = createUser(Role.OWNER);
        Cookie cookieOtherOwner = loginAs(otherOwnerEmail);

        mockMvc.perform(put("/api/businesses/"+ businessId)
                .cookie(cookieOtherOwner)
                .contentType(MediaType.APPLICATION_JSON)
                .content(VALID_MODIFIED_BUSINESS_BODY))
                .andExpect(status().isForbidden());
    }

    @Test
    void deleteByAdminReturns204() throws Exception{
        String ownerEmail = createUser(Role.OWNER);
        Cookie cookie = loginAs(ownerEmail);
        String businessId = createBusinessAs(cookie);
        String adminEmail = createUser(Role.ADMIN);
        Cookie adminCookie = loginAs(adminEmail);

        mockMvc.perform(delete("/api/businesses/" + businessId)
                .cookie(adminCookie))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/businesses/" + businessId))
                .andExpect(status().isNotFound());
    }

    @Test
    void javascriptWebsiteReturns400() throws Exception{
        String ownerEmail = createUser(Role.OWNER);
        Cookie cookie = loginAs(ownerEmail);
        String businessId = createBusinessAs(cookie);

        mockMvc.perform(put("/api/businesses/" + businessId)
                .cookie(cookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(JAVASCRIPT_WEBSITE_BUSINESS_BODY))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.website").exists());
    }

}
