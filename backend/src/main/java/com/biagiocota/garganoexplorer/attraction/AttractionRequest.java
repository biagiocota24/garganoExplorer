package com.biagiocota.garganoexplorer.attraction;

import com.biagiocota.garganoexplorer.common.Town;
import jakarta.validation.constraints.*;

public record AttractionRequest(
        @NotBlank
        @Size(min = 2, max = 150)
        String name,

        @NotBlank
        @Size(min = 200, max = 5000)
        String description,

        @NotNull
        Town town,

        @NotNull
        AttractionCategory category,

        @DecimalMin("-90.00")
        @DecimalMax("90.00")
        Double latitude,

        @DecimalMin("-180.00")
        @DecimalMax("180.00")
        Double longitude
) {
}
