package com.biagiocota.garganoexplorer;

import com.biagiocota.garganoexplorer.user.Role;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


public class NotificationIntegrationTest extends IntegrationTestSupport{

    private static final String MESSAGE = "Questa è la richiesta di prova";
    private static final String BODY = """
        { "message": "%s" }
        """.formatted(MESSAGE);

    @Test
    void changeRequestByAdminCreatesNotificationForOwner() throws Exception {
        String email = createUser(Role.OWNER);
        Cookie cookie = loginAs(email);
        String businessId = createBusinessAs(cookie);

        String adminEmail = createUser(Role.ADMIN);
        Cookie adminCookie = loginAs(adminEmail);

        mockMvc.perform(post("/api/businesses/"+businessId+"/change-requests")
                .cookie(adminCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(BODY))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/notifications")
                .cookie(cookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].message").value(MESSAGE))
                .andExpect(jsonPath("$[0].read").value(false));
    }

    @Test
    void changeRequestByOwnerReturns403() throws Exception{
        String email = createUser(Role.OWNER);
        Cookie cookie = loginAs(email);
        String businessId = createBusinessAs(cookie);

        mockMvc.perform(post("/api/businesses/"+businessId+"/change-requests")
                .cookie(cookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(BODY))
                .andExpect(status().isForbidden());
    }

    @Test
    void unreadCountReflectsNewNotifications() throws Exception{
        String email = createUser(Role.OWNER);
        Cookie cookie = loginAs(email);
        String businessId = createBusinessAs(cookie);

        String adminEmail = createUser(Role.ADMIN);
        Cookie adminCookie = loginAs(adminEmail);

        mockMvc.perform(post("/api/businesses/"+businessId+"/change-requests")
                .cookie(adminCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(BODY))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/notifications/unread-count")
                .cookie(cookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").value(1));
    }

    @Test
    void ownerCanMarkAsRead() throws Exception{
        String email = createUser(Role.OWNER);
        Cookie cookie = loginAs(email);
        String businessId = createBusinessAs(cookie);

        String adminEmail = createUser(Role.ADMIN);
        Cookie adminCookie = loginAs(adminEmail);

        mockMvc.perform(post("/api/businesses/"+businessId+"/change-requests")
                        .cookie(adminCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(BODY))
                .andExpect(status().isCreated());

        MvcResult result =  mockMvc.perform(get("/api/notifications")
                .cookie(cookie))
                .andExpect(status().isOk())
                .andReturn();

       String notificationId = JsonPath.read(result.getResponse().getContentAsString(), "$[0].id");

       mockMvc.perform(patch("/api/notifications/"+notificationId+"/read")
               .cookie(cookie))
               .andExpect(status().isNoContent());

       mockMvc.perform(get("/api/notifications/unread-count")
               .cookie(cookie))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.count").value(0));
    }

    @Test
    void otherUserCannotMarkAsReadReturns404() throws Exception{
        String email = createUser(Role.OWNER);
        Cookie cookie = loginAs(email);
        String businessId = createBusinessAs(cookie);

        String adminEmail = createUser(Role.ADMIN);
        Cookie adminCookie = loginAs(adminEmail);

        mockMvc.perform(post("/api/businesses/"+businessId+"/change-requests")
                        .cookie(adminCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(BODY))
                .andExpect(status().isCreated());

        MvcResult result = mockMvc.perform(get("/api/notifications")
                .cookie(cookie))
                .andExpect(status().isOk())
                .andReturn();
        String notificationId  = JsonPath.read(result.getResponse().getContentAsString() , "$[0].id");

        String emailOtherUser = createUser(Role.OWNER);
        Cookie otherCookie = loginAs(emailOtherUser);

        mockMvc.perform(patch("/api/notifications/"+notificationId+"/read")
                .cookie(otherCookie))
                        .andExpect(status().isNotFound());

        mockMvc.perform(get("/api/notifications/unread-count").cookie(cookie))
                .andExpect(jsonPath("$.count").value(1));

    }
}
