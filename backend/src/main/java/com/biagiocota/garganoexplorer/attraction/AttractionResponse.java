package com.biagiocota.garganoexplorer.attraction;

import com.biagiocota.garganoexplorer.common.Town;
import com.biagiocota.garganoexplorer.photo.PhotoResponse;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record AttractionResponse(
        UUID id,
        String name,
        String description,
        Town town,
        AttractionCategory category,
        Double latitude,
        Double longitude,
        Instant createdAt,
        Instant updatedAt,
        List<PhotoResponse> photos
) {

    public static AttractionResponse from(Attraction attraction) {
        return new AttractionResponse(
                attraction.getId(),
                attraction.getName(),
                attraction.getDescription(),
                attraction.getTown(),
                attraction.getCategory(),
                attraction.getLatitude(),
                attraction.getLongitude(),
                attraction.getCreatedAt(),
                attraction.getUpdatedAt(),
                PhotoResponse.fromAll(attraction.getPhotos())
        );
    }
}
