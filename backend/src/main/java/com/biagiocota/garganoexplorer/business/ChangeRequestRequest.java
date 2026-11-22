package com.biagiocota.garganoexplorer.business;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangeRequestRequest(
        @NotBlank(message = "Il messaggio è obbligatorio")
        @Size(max = 1000, message = "Il messaggio non può superare {max} caratteri")
        String message
) {
}
