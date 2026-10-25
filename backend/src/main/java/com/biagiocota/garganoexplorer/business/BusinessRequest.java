package com.biagiocota.garganoexplorer.business;

import com.biagiocota.garganoexplorer.common.Town;
import jakarta.validation.constraints.*;

public record BusinessRequest(
        @NotBlank
        @Size(min = 2, max = 150)
        String name,

        @NotBlank
        @Size(min = 200, max = 5000)
        String description,

        @NotNull
        BusinessCategory category,

        @NotNull
        Town town,

        @NotBlank
        @Size(max = 255)
        String address,

        @DecimalMin("-90.00")
        @DecimalMax("90.00")
        Double latitude,

        @DecimalMin("-180.00")
        @DecimalMax("180.00")
        Double longitude,

        @Size(max = 20)
        String phone,

        @Size(max = 255)
        @Email
        String email,

        @Size(max = 255)
        @Pattern(regexp = "^https?://.+$" , flags = Pattern.Flag.CASE_INSENSITIVE)
        String website,

        PriceRange priceRange
) {
}
