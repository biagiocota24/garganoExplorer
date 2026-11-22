package com.biagiocota.garganoexplorer.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "L'email è obbligatoria")
        @Email(message = "Inserisci un indirizzo email valido")
        String email,
        @NotBlank(message = "La password è obbligatoria")
        String password
) {
}
