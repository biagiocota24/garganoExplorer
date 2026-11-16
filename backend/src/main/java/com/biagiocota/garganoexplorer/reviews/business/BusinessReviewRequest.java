package com.biagiocota.garganoexplorer.reviews.business;

import jakarta.validation.constraints.*;

public record BusinessReviewRequest(
        @NotNull
        @Min(1)
        @Max(5)
        Integer rating,

        @NotBlank
        @Size(min = 10 , max = 2000)
        String text
) {
}
