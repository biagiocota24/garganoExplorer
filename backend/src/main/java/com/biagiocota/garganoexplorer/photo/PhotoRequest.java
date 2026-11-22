package com.biagiocota.garganoexplorer.photo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// QUELLO CHE IL FE MANDA AL BE PER FAR SALVARE LA FOTO NEL DATABASE
// SERVE A VALIDARE I DATI CHE IL FE PUO MANDARE
public record PhotoRequest(
        @NotBlank(message = "L'URL della foto è obbligatorio") @Size(max = 500, message = "L'URL della foto non può superare {max} caratteri") String url,
        @NotBlank(message = "L'identificativo della foto è obbligatorio") @Size(max = 255, message = "L'identificativo della foto non può superare {max} caratteri") @Pattern(regexp = "^[A-Za-z0-9_\\-/]+$", message = "Identificativo della foto non valido") String publicId
) {
}