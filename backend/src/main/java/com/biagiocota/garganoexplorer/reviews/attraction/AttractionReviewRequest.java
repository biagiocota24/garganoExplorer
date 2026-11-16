package com.biagiocota.garganoexplorer.reviews.attraction;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AttractionReviewRequest(

        @NotBlank
        @Size(min = 10 , max = 2000)
        String text
) {
}
