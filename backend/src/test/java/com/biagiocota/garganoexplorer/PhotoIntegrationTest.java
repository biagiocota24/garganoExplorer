package com.biagiocota.garganoexplorer;

import com.biagiocota.garganoexplorer.user.Role;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class PhotoIntegrationTest extends IntegrationTestSupport {

    private static final String PUBLIC_ID = "garganoyes/foto-1";
    private static final String PHOTO_URL =
            "https://res.cloudinary.com/test-cloud/image/upload/v1700000000/garganoyes/foto-1.jpg";

    private static String photoBody(String url, String publicId) {
        return """
                {"url": "%s", "publicId": "%s"}
                """.formatted(url, publicId);
    }

    private void addPhoto(String path, Cookie cookie, String url, String publicId, int expectedStatus) throws Exception {
        mockMvc.perform(post(path)
                        .cookie(cookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(photoBody(url, publicId)))
                .andExpect(status().is(expectedStatus));
    }

    @Test
    void signatureAsOwnerReturnsSignedParams() throws Exception {
        Cookie owner = loginAs(createUser(Role.OWNER));          // adatta

        mockMvc.perform(post("/api/photos/signature").cookie(owner))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cloudName").value("test-cloud"))
                .andExpect(jsonPath("$.folder").value("garganoyes"))
                .andExpect(jsonPath("$.allowedFormats").value("jpg,png,webp"))
                .andExpect(jsonPath("$.signature").isNotEmpty())
                .andExpect(jsonPath("$.apiSecret").doesNotExist());
    }

    @Test
    void signatureAsVisitorReturns403() throws Exception {
        Cookie visitor = loginAs(createUser(Role.VISITOR));

        mockMvc.perform(post("/api/photos/signature").cookie(visitor))
                .andExpect(status().isForbidden());
    }

    @Test
    void signatureWithoutLoginReturns401() throws Exception {
        mockMvc.perform(post("/api/photos/signature"))
                .andExpect(status().isUnauthorized());
    }


    @Test
    void ownerCanAddPhoto() throws Exception {
        Cookie owner = loginAs(createUser(Role.OWNER));
        String businessId = createBusiness(owner);

        mockMvc.perform(post("/api/businesses/" + businessId + "/photos")
                        .cookie(owner)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(photoBody(PHOTO_URL, PUBLIC_ID)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$[0].publicId").value(PUBLIC_ID));

        mockMvc.perform(get("/api/businesses/" + businessId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.photos[0].url").value(PHOTO_URL));
    }

    @Test
    void photoFromAnotherCloudReturns400() throws Exception {
        Cookie owner = loginAs(createUser(Role.OWNER));
        String businessId = createBusiness(owner);
        String foreignUrl = "https://res.cloudinary.com/altro-cloud/image/upload/v1/garganoyes/foto-1.jpg";

        addPhoto("/api/businesses/" + businessId + "/photos", owner, foreignUrl, PUBLIC_ID, 400);
    }

    @Test
    void photoOutsideAppFolderReturns400() throws Exception {
        Cookie owner = loginAs(createUser(Role.OWNER));
        String businessId = createBusiness(owner);
        String otherFolderUrl = "https://res.cloudinary.com/test-cloud/image/upload/v1/altra-cartella/foto-1.jpg";

        addPhoto("/api/businesses/" + businessId + "/photos", owner, otherFolderUrl, "altra-cartella/foto-1", 400);
    }

    @Test
    void duplicatePhotoReturns400() throws Exception {
        Cookie owner = loginAs(createUser(Role.OWNER));
        String path = "/api/businesses/" + createBusiness(owner) + "/photos";

        addPhoto(path, owner, PHOTO_URL, PUBLIC_ID, 201);
        addPhoto(path, owner, PHOTO_URL, PUBLIC_ID, 400);
    }

    @Test
    void otherOwnerCannotAddPhoto() throws Exception {
        Cookie owner = loginAs(createUser(Role.OWNER));
        Cookie otherOwner = loginAs(createUser(Role.OWNER));
        String businessId = createBusiness(owner);

        addPhoto("/api/businesses/" + businessId + "/photos", otherOwner, PHOTO_URL, PUBLIC_ID, 403);
    }

    @Test
    void eleventhPhotoReturns400() throws Exception {
        Cookie owner = loginAs(createUser(Role.OWNER));
        String path = "/api/businesses/" + createBusiness(owner) + "/photos";

        for (int i = 1; i <= 11; i++) {
            String publicId = "garganoyes/foto-" + i;
            String url = "https://res.cloudinary.com/test-cloud/image/upload/v1/" + publicId + ".jpg";
            addPhoto(path, owner, url, publicId, i <= 10 ? 201 : 400);
        }
    }

    @Test
    void removingPhotoDeletesItFromCloudinary() throws Exception {
        Cookie owner = loginAs(createUser(Role.OWNER));
        String businessId = createBusiness(owner);
        addPhoto("/api/businesses/" + businessId + "/photos", owner, PHOTO_URL, PUBLIC_ID, 201);

        mockMvc.perform(delete("/api/businesses/" + businessId + "/photos")
                        .param("publicId", PUBLIC_ID)
                        .cookie(owner))
                .andExpect(status().isNoContent());

        verify(cloudinaryClient).destroy(PUBLIC_ID);

        mockMvc.perform(get("/api/businesses/" + businessId))
                .andExpect(jsonPath("$.photos").isEmpty());
    }

    @Test
    void adminCanRemovePhotoFromAnyBusiness() throws Exception {
        Cookie owner = loginAs(createUser(Role.OWNER));
        Cookie admin = loginAs(createUser(Role.ADMIN));
        String businessId = createBusiness(owner);
        addPhoto("/api/businesses/" + businessId + "/photos", owner, PHOTO_URL, PUBLIC_ID, 201);

        mockMvc.perform(delete("/api/businesses/" + businessId + "/photos")
                        .param("publicId", PUBLIC_ID)
                        .cookie(admin))
                .andExpect(status().isNoContent());
    }

    @Test
    void removingUnknownPhotoReturns404() throws Exception {
        Cookie owner = loginAs(createUser(Role.OWNER));
        String businessId = createBusiness(owner);

        mockMvc.perform(delete("/api/businesses/" + businessId + "/photos")
                        .param("publicId", "garganoyes/inesistente")
                        .cookie(owner))
                .andExpect(status().isNotFound());
    }

    @Test
    void deletingBusinessDeletesItsPhotos() throws Exception {
        Cookie owner = loginAs(createUser(Role.OWNER));
        String businessId = createBusiness(owner);
        addPhoto("/api/businesses/" + businessId + "/photos", owner, PHOTO_URL, PUBLIC_ID, 201);

        mockMvc.perform(delete("/api/businesses/" + businessId).cookie(owner))
                .andExpect(status().isNoContent());

        verify(cloudinaryClient).destroy(PUBLIC_ID);
    }
    

    @Test
    void adminCanAddPhotoToAttraction() throws Exception {
        Cookie admin = loginAs(createUser(Role.ADMIN));
        String attractionId = createAttraction(admin);

        addPhoto("/api/attractions/" + attractionId + "/photos", admin, PHOTO_URL, PUBLIC_ID, 201);

        mockMvc.perform(get("/api/attractions/" + attractionId))
                .andExpect(jsonPath("$.photos[0].publicId").value(PUBLIC_ID));
    }

    @Test
    void ownerCannotAddPhotoToAttraction() throws Exception {
        Cookie admin = loginAs(createUser(Role.ADMIN));
        Cookie owner = loginAs(createUser(Role.OWNER));
        String attractionId = createAttraction(admin);

        addPhoto("/api/attractions/" + attractionId + "/photos", owner, PHOTO_URL, PUBLIC_ID, 403);
    }
}