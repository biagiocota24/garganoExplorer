package com.biagiocota.garganoexplorer.photo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// QUELLO CHE IL FE MANDA AL BE PER FAR SALVARE LA FOTO NEL DATABASE
// SERVE A VALIDARE I DATI CHE IL FE PUO MANDARE
public record PhotoRequest(
        @NotBlank @Size(max = 500) String url,
        @NotBlank @Size(max = 255) @Pattern(regexp = "^[A-Za-z0-9_\\-/]+$") String publicId
) {
}