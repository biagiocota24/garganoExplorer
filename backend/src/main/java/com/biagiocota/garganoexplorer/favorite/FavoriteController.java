package com.biagiocota.garganoexplorer.favorite;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FavoriteController {
    private final FavoriteService favoriteService;

    @PutMapping("/businesses/{businessId}/favorite")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void addBusinessToFavorites(@AuthenticationPrincipal UUID userId , @PathVariable UUID businessId){
        favoriteService.addBusiness(userId, businessId);
    }

    @DeleteMapping("/businesses/{businessId}/favorite")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBusinessFromFavorites(@AuthenticationPrincipal UUID userId , @PathVariable UUID businessId){
        favoriteService.removeBusiness(userId, businessId);
    }

    @PutMapping("/attractions/{attractionId}/favorite")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void addAttractionToFavorite(@AuthenticationPrincipal UUID userId  ,  @PathVariable UUID attractionId){
        favoriteService.addAttraction(userId, attractionId);
    }

    @DeleteMapping("/attractions/{attractionId}/favorite")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAttractionFromFavorite(@AuthenticationPrincipal UUID userId, @PathVariable UUID attractionId){
        favoriteService.removeAttraction(userId, attractionId);
    }

    @GetMapping("/favorites")
    public FavoritesResponse getMyFavorites (@AuthenticationPrincipal UUID userId){
        return favoriteService.getMyFavorites(userId);
    }

    @GetMapping("/favorites/ids")
    public FavoriteIdsResponse getMyFavoriteIds(@AuthenticationPrincipal UUID userId){
        return favoriteService.getMyFavoriteIds(userId);
    }

}
