package com.biagiocota.garganoexplorer;

import com.biagiocota.garganoexplorer.user.Role;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class FavoriteIntegrationTest extends IntegrationTestSupport{

    private String getBusinessId() throws Exception {
        String ownerEmail = createUser(Role.OWNER);
        Cookie owner = loginAs(ownerEmail);
        return createBusiness(owner);
    }

    private String getAttractionId()throws Exception{
        String adminEmail = createUser(Role.ADMIN);
        Cookie admin = loginAs(adminEmail);
        return createAttraction(admin);
    }

    private Cookie getVisitorCookie() throws Exception {
        String visitorEmail = createUser(Role.VISITOR);
        return loginAs(visitorEmail);
    }

    private void saveAttractionInFavorites(String attractionId, Cookie visitorCookie) throws Exception {
        mockMvc.perform(put("/api/attractions/" + attractionId+"/favorite")
                .cookie(visitorCookie))
                .andExpect(status().isNoContent());
    }


    @Test
    void addBusinessFavorite_thenAppearsInIds() throws Exception{
        String businessId = getBusinessId();
        Cookie visitor = getVisitorCookie();

        mockMvc.perform(put("/api/businesses/"+businessId+"/favorite")
                .cookie(visitor))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/favorites/ids")
                .cookie(visitor))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.businessIds[0]").value(businessId))
                .andExpect(jsonPath("$.businessIds" , hasSize(1)));
    }

    @Test
    void addAttractionFavorite_thenAppearsInIds()throws Exception{
        String attractionId = getAttractionId();
        Cookie visitor = getVisitorCookie();

        mockMvc.perform(put("/api/attractions/"+attractionId+"/favorite")
                .cookie(visitor))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/favorites/ids")
                .cookie(visitor))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.attractionIds[0]").value(attractionId));
    }

    @Test
    void addSameFavoriteTwice_isIdemPotent() throws Exception {
        String businessId = getBusinessId();
        Cookie visitor = getVisitorCookie();

        mockMvc.perform(put("/api/businesses/"+businessId+"/favorite")
                .cookie(visitor))
                .andExpect(status().isNoContent());

        mockMvc.perform(put("/api/businesses/"+businessId+"/favorite")
                        .cookie(visitor))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/favorites/ids")
                .cookie(visitor))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.businessIds", hasSize(1)));
    }

    @Test
    void getMyFavoritesReturnsFullPlaces() throws Exception {
        String businessId = getBusinessId();
        String attractionId = getAttractionId();
        Cookie visitor = getVisitorCookie();

        mockMvc.perform(put("/api/businesses/"+businessId+"/favorite")
                        .cookie(visitor))
                .andExpect(status().isNoContent());
        mockMvc.perform(put("/api/attractions/"+attractionId+"/favorite")
                        .cookie(visitor))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/favorites")
                .cookie(visitor))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.businesses[0].name").exists())
                .andExpect(jsonPath("$.attractions[0].description").exists())
                .andExpect(jsonPath("$.businesses[0].id").value(businessId))
                .andExpect(jsonPath("$.businesses[0].name").exists())
                .andExpect(jsonPath("$.attractions[0].id").value(attractionId));
    }

    @Test
    void favoritesAreIsolatedPerUser() throws Exception {
        String attractionId = getAttractionId();
        Cookie visitor = getVisitorCookie();
        Cookie otherVisitor = getVisitorCookie();

        saveAttractionInFavorites(attractionId , visitor);

        mockMvc.perform(get("/api/favorites/ids")
                .cookie(otherVisitor))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.attractionIds").isEmpty());
    }

    @Test
    void removeFavorite_thenNotInIds() throws Exception {
        String attractionId = getAttractionId();
        Cookie visitor = getVisitorCookie();
        saveAttractionInFavorites(attractionId,visitor);
        mockMvc.perform(get("/api/favorites/ids")
                        .cookie(visitor))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.attractionIds[0]").exists());
        mockMvc.perform(delete("/api/attractions/"+attractionId+"/favorite")
                .cookie(visitor))
                .andExpect(status().isNoContent());
        mockMvc.perform(get("/api/favorites/ids")
                        .cookie(visitor))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.attractionIds").isEmpty());
    }

    @Test
    void removeNonExistingFavorite_returns204()throws Exception{
        String attractionId = getAttractionId();
        Cookie visitor = getVisitorCookie();
        // NON HO SALVATO NULLA NEI FAVORITI
        mockMvc.perform(delete("/api/attractions/"+attractionId+"/favorite")
                        .cookie(visitor))
                .andExpect(status().isNoContent());
    }

    @Test
    void addFavorite_withoutToken_returns401()throws Exception{
        String attractionId = getAttractionId();

        mockMvc.perform(put("/api/attractions/"+attractionId+"/favorite"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getFavorites_withoutToken_returns401()throws Exception{
        mockMvc.perform(get("/api/favorites"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void addFavorite_nonExistingBusiness_returns404()throws Exception{
        String nonExistingBusinessId = "7f3a9c21-8b64-4e2d-a5f1-9c7b3e6d2048";
        Cookie visitor = getVisitorCookie();

        mockMvc.perform(put("/api/businesses/"+nonExistingBusinessId+"/favorite")
                .cookie(visitor))
                .andExpect(status().isNotFound());
    }

    @Test
    void addFavorite_nonExistingAttraction_returns404()throws Exception{
        String nonExistingAttractionId = "7f3a9c21-8b64-4e2d-a5f1-9c7b3e6d2048";
        Cookie visitor = getVisitorCookie();
        mockMvc.perform(put("/api/attractions/"+nonExistingAttractionId+"/favorite")
                        .cookie(visitor))
                .andExpect(status().isNotFound());
    }


    @Test
    void deleteBusiness_withFavorites_removeFavorites()throws Exception{
        String ownerEmail = createUser(Role.OWNER);
        Cookie owner = loginAs(ownerEmail);
        String businessId = createBusiness(owner);

        Cookie visitor = getVisitorCookie();

        mockMvc.perform(put("/api/businesses/"+businessId+"/favorite")
                .cookie(visitor))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/favorites/ids")
                .cookie(visitor))
                .andExpect(jsonPath("$.businessIds[0]").value(businessId));

        mockMvc.perform(delete("/api/businesses/"+businessId)
                .cookie(owner))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/favorites/ids")
                        .cookie(visitor))
                .andExpect(jsonPath("$.businessIds").isEmpty());
    }

    @Test
    void deleteAttraction_withFavorites_removeFavorites()throws Exception{
        String adminEmail = createUser(Role.ADMIN);
        Cookie admin = loginAs(adminEmail);
        String attractionId = createAttraction(admin);
        Cookie visitor = getVisitorCookie();
        mockMvc.perform(put("/api/attractions/"+attractionId+"/favorite")
                        .cookie(visitor))
                .andExpect(status().isNoContent());
        mockMvc.perform(get("/api/favorites/ids")
                        .cookie(visitor))
                .andExpect(jsonPath("$.attractionIds[0]").value(attractionId));
        mockMvc.perform(delete("/api/attractions/"+attractionId)
                        .cookie(admin))
                .andExpect(status().isNoContent());
        mockMvc.perform(get("/api/favorites/ids")
                        .cookie(visitor))
                .andExpect(jsonPath("$.attractionIds").isEmpty());
    }

    @Test
    void ownerCanAddFavorite()throws Exception{
        String businessId = getBusinessId();
        String ownerEmail = createUser(Role.OWNER);
        Cookie owner = loginAs(ownerEmail);

        mockMvc.perform(put("/api/businesses/"+businessId+"/favorite")
                .cookie(owner))
                .andExpect(status().isNoContent());
    }
}
