package com.biagiocota.garganoexplorer.reviews.attraction;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AttractionReviewRequest(

        @NotBlank(message = "Il testo della recensione è obbligatorio")
        @Size(min = 10, max = 2000, message = "Il testo della recensione deve contenere tra {min} e {max} caratteri")
        String text
) {
}
