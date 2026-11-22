package com.biagiocota.garganoexplorer.reviews.business;

import jakarta.validation.constraints.*;

public record BusinessReviewRequest(
        @NotNull(message = "Il voto è obbligatorio")
        @Min(value = 1, message = "Il voto deve essere compreso tra 1 e 5")
        @Max(value = 5, message = "Il voto deve essere compreso tra 1 e 5")
        Integer rating,

        @NotBlank(message = "Il testo della recensione è obbligatorio")
        @Size(min = 10, max = 2000, message = "Il testo della recensione deve contenere tra {min} e {max} caratteri")
        String text
) {
}
