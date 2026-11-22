package com.biagiocota.garganoexplorer.attraction;

import com.biagiocota.garganoexplorer.common.Town;
import jakarta.validation.constraints.*;

public record AttractionRequest(
        @NotBlank(message = "Il nome è obbligatorio")
        @Size(min = 2, max = 150, message = "Il nome deve contenere tra {min} e {max} caratteri")
        String name,

        @NotBlank(message = "La descrizione è obbligatoria")
        @Size(min = 200, max = 5000, message = "La descrizione deve contenere tra {min} e {max} caratteri")
        String description,

        @NotNull(message = "La città è obbligatoria")
        Town town,

        @NotNull(message = "La categoria è obbligatoria")
        AttractionCategory category,

        @DecimalMin(value = "-90.00", message = "La latitudine deve essere compresa tra -90 e 90")
        @DecimalMax(value = "90.00", message = "La latitudine deve essere compresa tra -90 e 90")
        Double latitude,

        @DecimalMin(value = "-180.00", message = "La longitudine deve essere compresa tra -180 e 180")
        @DecimalMax(value = "180.00", message = "La longitudine deve essere compresa tra -180 e 180")
        Double longitude
) {
}
