package com.biagiocota.garganoexplorer.business;

public class BusinessNotFoundException extends RuntimeException {
    public BusinessNotFoundException() {
        super("Attività non trovata");
    }
}
