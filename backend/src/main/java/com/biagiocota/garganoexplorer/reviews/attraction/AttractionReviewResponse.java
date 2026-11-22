package com.biagiocota.garganoexplorer.reviews.attraction;


import java.time.Instant;
import java.util.UUID;

public record AttractionReviewResponse(
        UUID id,
        UUID authorId,
        String authorName,
        UUID attractionId,
        String text,
        Instant createdAt,
        Instant updatedAt
) {

    public static AttractionReviewResponse from (AttractionReview review){
        return  new AttractionReviewResponse(
                review.getId(),
                review.getAuthor().getId(),
             review.getAuthor().getDisplayName(),
                review.getAttraction().getId(),
                review.getText(),
                review.getCreatedAt(),
                review.getUpdatedAt()
        );
    }
}
