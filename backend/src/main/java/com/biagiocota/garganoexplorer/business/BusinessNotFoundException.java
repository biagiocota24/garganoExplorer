package com.biagiocota.garganoexplorer.business;

import java.util.UUID;

public class BusinessNotFoundException extends RuntimeException {
    public BusinessNotFoundException() {
        super("Attività non trovata");
    }
}
