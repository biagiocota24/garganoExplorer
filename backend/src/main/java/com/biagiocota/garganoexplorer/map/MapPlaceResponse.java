package com.biagiocota.garganoexplorer.map;

import com.biagiocota.garganoexplorer.attraction.Attraction;
import com.biagiocota.garganoexplorer.business.Business;
import com.biagiocota.garganoexplorer.common.Town;
import com.biagiocota.garganoexplorer.photo.Photo;

import java.util.List;
import java.util.UUID;

public record MapPlaceResponse(
        UUID id ,
        MapPlaceType type,
        String name,
        String category,
        Town town,
        double latitude,
        double longitude,
        String coverPhotoUrl
) {
    public static MapPlaceResponse fromAttraction(Attraction attraction){
        return new MapPlaceResponse(
                attraction.getId(),
                MapPlaceType.ATTRACTION,
                attraction.getName(),
                attraction.getCategory().name(),
                attraction.getTown(),
                attraction.getLatitude(),
                attraction.getLongitude(),
                getCoverImageUrl(attraction.getPhotos())
        );
    }

    public static MapPlaceResponse fromBusiness(Business business){
        return new MapPlaceResponse(
                business.getId(),
                MapPlaceType.BUSINESS,
                business.getName(),
                business.getCategory().name(),
                business.getTown(),
                business.getLatitude(),
                business.getLongitude(),
                getCoverImageUrl(business.getPhotos())
        );
    }

    private static String getCoverImageUrl(List<Photo> photos) {
        if(photos.isEmpty()){
            return null;
        }
        return photos.getFirst().getUrl();
    }
}
