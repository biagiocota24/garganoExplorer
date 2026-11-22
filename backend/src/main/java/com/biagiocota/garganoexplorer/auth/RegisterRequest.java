package com.biagiocota.garganoexplorer.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "L'email è obbligatoria")
        @Email(message = "Inserisci un indirizzo email valido")
        String email,

        @NotBlank(message = "La password è obbligatoria")
        @Size(min = 8, max = 72, message = "La password deve contenere tra {min} e {max} caratteri")
        String password,

        @NotBlank(message = "Il nome è obbligatorio")
        @Size(max = 50, message = "Il nome non può superare {max} caratteri")
        String firstName,

        @NotBlank(message = "Il cognome è obbligatorio")
        @Size(max = 50, message = "Il cognome non può superare {max} caratteri")
        String lastName,

        @NotNull(message = "Il tipo di account è obbligatorio")
        AccountType accountType
) {
}
