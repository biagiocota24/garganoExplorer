package com.biagiocota.garganoexplorer;

import com.biagiocota.garganoexplorer.user.Role;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
public class MapIntegrationTest extends IntegrationTestSupport{

    private static final String BUSINESS_WITH_COORDINATES_BODY = """
    {
      "name": "Trattoria del Porto",
      "description": "Piccola trattoria a conduzione familiare affacciata sul porto, con cucina di mare e piatti della tradizione garganica. Il menu cambia ogni giorno in base al pescato e ai prodotti dell'orto. In estate si mangia sulla terrazza con vista sulle barche dei pescatori.",
      "category": "RESTAURANT",
      "town": "VIESTE",
      "address": "Via del Porto 12, Vieste",
      "latitude": 41.8836,
      "longitude": 16.1797,
      "website": "https://esempio.it",
      "priceRange": "MODERATE"
    }
    """;

    private static final String ATTRACTION_WITH_COORDINATES_BODY = """
    {
      "name": "Baia delle Zagare",
      "description": "Una delle baie più famose del Gargano, con i faraglioni bianchi che emergono dal mare cristallino. Si raggiunge dal mare oppure attraverso gli stabilimenti della zona. Il periodo migliore per visitarla va da giugno a settembre.",
      "town": "MATTINATA",
      "category": "BEACH",
      "latitude": 41.7589,
      "longitude": 16.0921
    }
    """;

    private static final String ATTRACTION_WITHOUT_COORDINATES_BODY = """
            {
              "name": "Baia delle Zagare",
              "description": "Una delle baie più famose del Gargano, con i faraglioni bianchi che emergono dal mare cristallino. Si raggiunge dal mare oppure attraverso gli stabilimenti della zona. Il periodo migliore per visitarla va da giugno a settembre.",
              "town": "MATTINATA",
              "category": "BEACH"
            }
            """;

    @Test
    void returnsOnlyPlacesWithCoordinates() throws Exception{
        String adminEmail = createUser(Role.ADMIN);
        String ownerEmail = createUser(Role.OWNER);

        Cookie adminCookie = loginAs(adminEmail);
        Cookie ownerCookie = loginAs(ownerEmail);

        String attractionWithCoordinates = createAttraction(adminCookie , ATTRACTION_WITH_COORDINATES_BODY);
        String attractionsWithoutCoordinates = createAttraction(adminCookie , ATTRACTION_WITHOUT_COORDINATES_BODY);

        String businessWithCoordinates = createBusiness(ownerCookie , BUSINESS_WITH_COORDINATES_BODY);

        String json = mockMvc.perform(get("/api/map-places"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        List<String> ids = JsonPath.read(json ,"$[*].id");

        assertThat(ids).contains(attractionWithCoordinates)
                .doesNotContain(attractionsWithoutCoordinates)
                .contains(businessWithCoordinates);

        List<String> typeAttraction = JsonPath.read(json , "$[?(@.id == '%s')].type".formatted(attractionWithCoordinates));
        assertThat(typeAttraction).containsExactly("ATTRACTION");

        List<String> typeBusiness = JsonPath.read(json , "$[?(@.id == '%s')].type".formatted(businessWithCoordinates));
        assertThat(typeBusiness).containsExactly("BUSINESS");

    }

}
