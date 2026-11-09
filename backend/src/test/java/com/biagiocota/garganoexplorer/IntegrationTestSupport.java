package com.biagiocota.garganoexplorer;

import com.biagiocota.garganoexplorer.attraction.Attraction;
import com.biagiocota.garganoexplorer.photo.CloudinaryClient;
import com.biagiocota.garganoexplorer.user.Role;
import com.biagiocota.garganoexplorer.user.User;
import com.biagiocota.garganoexplorer.user.UserRepository;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestContainerConfiguration.class)
@TestPropertySource(properties = {
        "cloudinary.cloud-name=test-cloud",
        "cloudinary.api-key=test-key",
        "cloudinary.api-secret=test-secret"
})
public abstract class IntegrationTestSupport {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected PasswordEncoder passwordEncoder;

    @MockitoBean
    protected CloudinaryClient cloudinaryClient;

    private static final String PASSWORD = "password123";

    protected static final String VALID_BUSINESS_BODY = """
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

    protected static final String VALID_ATTRACTION_BODY = """
            {
              "name": "Baia delle Zagare",
              "description": "Una delle baie più famose del Gargano, con i faraglioni bianchi che emergono dal mare cristallino. Si raggiunge dal mare oppure attraverso gli stabilimenti della zona. Il periodo migliore per visitarla va da giugno a settembre.",
              "town": "MATTINATA",
              "category": "BEACH"
            }
            """;


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

    protected String createBusinessAs(Cookie cookie)throws Exception{
        MvcResult result = mockMvc.perform(post("/api/businesses")
                        .cookie(cookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_BUSINESS_BODY))
                .andExpect(status().isCreated())
                .andReturn();
        String json = result.getResponse().getContentAsString();
        return JsonPath.read(json , "$.id");
    }

    protected String createBusiness(Cookie ownerCookie) throws Exception{
        String json = mockMvc.perform(post("/api/businesses")
                .cookie(ownerCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(VALID_BUSINESS_BODY))
                .andExpect((status().isCreated()))
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(json , "$.id");
    }

    protected String createAttraction(Cookie adminCookie)throws Exception{
        String json = mockMvc.perform(post("/api/attractions")
                .cookie(adminCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(VALID_ATTRACTION_BODY))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(json , "$.id");
    }

    protected String createAttraction(Cookie adminCookie,String validBody)throws Exception{
          String json = mockMvc.perform(post("/api/attractions")
                .cookie(adminCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(validBody))
                .andExpect(status().isCreated())
                  .andReturn().getResponse().getContentAsString();

          return JsonPath.read(json , "$.id");
    }

    protected  String createBusiness(Cookie ownerCookie , String validBody)throws Exception{
        String json = mockMvc.perform(post("/api/businesses")
                .cookie(ownerCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(validBody))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        return JsonPath.read(json ,"$.id");    }
}
