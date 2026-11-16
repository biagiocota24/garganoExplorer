package com.biagiocota.garganoexplorer;

import com.biagiocota.garganoexplorer.user.Role;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class ReviewIntegrationTest extends IntegrationTestSupport{

    private static String businessReviewBody(int rating) {
        return """
                {"rating": %d, "text": "Ottima cucina di pesce, servizio gentile."}
                """.formatted(rating);
    }

    private ResultActions postBusinessReview(Cookie cookie, String businessId,int rating) throws Exception {
        return mockMvc.perform(post("/api/businesses/" + businessId + "/reviews")
                .cookie(cookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(businessReviewBody(rating)));
    }

    @Test
    void reviewFromVisitorReturns201WithCountAndAVGRating() throws Exception {
        Cookie owner = loginAs(createUser(Role.OWNER));
        Cookie visitor = loginAs(createUser(Role.VISITOR));
        String businessId = createBusiness(owner);

        postBusinessReview(visitor , businessId , 4)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rating").value(4));

        mockMvc.perform(get("/api/businesses/"+businessId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.averageRating").value(4.0))
                .andExpect(jsonPath("$.reviewCount").value(1));
    }

    @Test
    void reviewFromOwnerReturns403() throws Exception {
        Cookie owner = loginAs(createUser(Role.OWNER));
        String businessId = createBusiness(owner);
        postBusinessReview(owner , businessId ,4)
                .andExpect(status().isForbidden());
    }

    @Test
    void duplicatedReviewSameBusinessReturns409() throws Exception {
        Cookie owner = loginAs(createUser(Role.OWNER));
        Cookie visitor = loginAs(createUser(Role.VISITOR));
        String businessId = createBusiness(owner);

        postBusinessReview(visitor , businessId , 4)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rating").value(4));


        postBusinessReview(visitor , businessId , 4)
                .andExpect(status().isConflict());
    }

    @Test
    void invalidRatingsValueReturns400() throws Exception {
        Cookie owner = loginAs(createUser(Role.OWNER));
        Cookie visitor = loginAs(createUser(Role.VISITOR));
        String businessId = createBusiness(owner);

        postBusinessReview(visitor , businessId , 6)
                .andExpect(status().isBadRequest());
    }

    @Test
    void otherVisitorUpdateReviewReturns403() throws Exception {
        Cookie owner = loginAs(createUser(Role.OWNER));
        Cookie visitor = loginAs(createUser(Role.VISITOR));
        String businessId = createBusiness(owner);

        String result = postBusinessReview(visitor , businessId , 4)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rating").value(4))
                .andReturn().getResponse().getContentAsString();
        String reviewId = JsonPath.read(result , "$.id");

        Cookie otherVisitor = loginAs(createUser(Role.VISITOR));

        mockMvc.perform(put("/api/businesses/"+businessId+"/reviews/"+reviewId)
                .cookie(otherVisitor)
                .contentType(MediaType.APPLICATION_JSON)
                .content(businessReviewBody(1)))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminDeleteReturns204AndCountIsUpdated()throws Exception{
        Cookie owner = loginAs(createUser(Role.OWNER));
        Cookie visitor = loginAs(createUser(Role.VISITOR));
        Cookie admin = loginAs(createUser(Role.ADMIN));
        String businessId = createBusiness(owner);

        String result = postBusinessReview(visitor , businessId , 4)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rating").value(4))
                .andReturn().getResponse().getContentAsString();
        String reviewId = JsonPath.read(result , "$.id");

        mockMvc.perform(delete("/api/businesses/"+businessId+"/reviews/"+reviewId)
                .cookie(admin))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/businesses/"+businessId))
                .andExpect(jsonPath("$.reviewCount").value(0));
    }

    @Test
    void ownerGetNotificationAfterReviewCreation()throws Exception{
        Cookie owner = loginAs(createUser(Role.OWNER));
        Cookie visitor = loginAs(createUser(Role.VISITOR));
        String businessId = createBusiness(owner);

        postBusinessReview(visitor , businessId , 4)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rating").value(4));

        mockMvc.perform(get("/api/notifications/unread-count")
                        .cookie(owner))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").value(1));

        mockMvc.perform(get("/api/notifications")
                .cookie(owner))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].type").value("NEW_REVIEW"));
    }
}
