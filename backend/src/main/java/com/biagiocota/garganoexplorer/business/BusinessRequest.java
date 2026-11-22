package com.biagiocota.garganoexplorer.business;

import com.biagiocota.garganoexplorer.common.Town;
import jakarta.validation.constraints.*;

public record BusinessRequest(
        @NotBlank(message = "Il nome è obbligatorio")
        @Size(min = 2, max = 150, message = "Il nome deve contenere tra {min} e {max} caratteri")
        String name,

        @NotBlank(message = "La descrizione è obbligatoria")
        @Size(min = 200, max = 5000, message = "La descrizione deve contenere tra {min} e {max} caratteri")
        String description,

        @NotNull(message = "La categoria è obbligatoria")
        BusinessCategory category,

        @NotNull(message = "La città è obbligatoria")
        Town town,

        @NotBlank(message = "L'indirizzo è obbligatorio")
        @Size(max = 255, message = "L'indirizzo non può superare {max} caratteri")
        String address,

        @DecimalMin(value = "-90.00", message = "La latitudine deve essere compresa tra -90 e 90")
        @DecimalMax(value = "90.00", message = "La latitudine deve essere compresa tra -90 e 90")
        Double latitude,

        @DecimalMin(value = "-180.00", message = "La longitudine deve essere compresa tra -180 e 180")
        @DecimalMax(value = "180.00", message = "La longitudine deve essere compresa tra -180 e 180")
        Double longitude,

        @Size(max = 20, message = "Il numero di telefono non può superare {max} caratteri")
        String phone,

        @Size(max = 255, message = "L'email non può superare {max} caratteri")
        @Email(message = "Inserisci un indirizzo email valido")
        String email,

        @Size(max = 255, message = "Il sito web non può superare {max} caratteri")
        @Pattern(regexp = "^https?://.+$", flags = Pattern.Flag.CASE_INSENSITIVE, message = "Il sito web deve iniziare con http:// o https://")
        String website,

        PriceRange priceRange
) {
}
