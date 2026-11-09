package com.biagiocota.garganoexplorer.business;

import com.biagiocota.garganoexplorer.common.Town;
import com.biagiocota.garganoexplorer.photo.PhotoResponse;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record BusinessResponse(
        UUID id,
        String name,
        String description,
        BusinessCategory category,
        Town town,
        String address,
        Double latitude,
        Double longitude,
        String phone,
        String email,
        String website,
        PriceRange priceRange,
        UUID ownerId,
        Instant createdAt,
        Instant updatedAt,
        List<PhotoResponse> photos


) {
    public static BusinessResponse from(Business business){
        return new BusinessResponse(
                business.getId(),
                business.getName(),
                business.getDescription(),
                business.getCategory(),
                business.getTown(),
                business.getAddress(),
                business.getLatitude(),
                business.getLongitude(),
                business.getPhone(),
                business.getEmail(),
                business.getWebsite(),
                business.getPriceRange(),
                business.getOwner().getId(),
                business.getCreatedAt(),
                business.getUpdatedAt(),
                PhotoResponse.fromAll(business.getPhotos())
        );
    }
}
