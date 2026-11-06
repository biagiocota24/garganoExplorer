package com.biagiocota.garganoexplorer.business;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangeRequestRequest(
        @NotBlank
        @Size(max = 1000)
        String message
) {
}
