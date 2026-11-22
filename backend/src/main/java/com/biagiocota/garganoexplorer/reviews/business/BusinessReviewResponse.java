package com.biagiocota.garganoexplorer.reviews.business;

import java.time.Instant;
import java.util.UUID;

public record BusinessReviewResponse(
        UUID id,
        UUID authorId,
        String authorName,
        UUID businessId,
        Integer rating,
        String text,
        Instant createdAt,
        Instant updatedAt
) {
    public static  BusinessReviewResponse from(BusinessReview review){
        return  new BusinessReviewResponse(
                review.getId(),
                review.getAuthor().getId(),
               review.getAuthor().getDisplayName(),
                review.getBusiness().getId(),
                review.getRating(),
                review.getText(),
                review.getCreatedAt(),
                review.getUpdatedAt()
        );
    }
}
