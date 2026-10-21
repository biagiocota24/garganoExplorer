package com.biagiocota.garganoexplorer.attraction;

public class AttractionNotFoundException extends RuntimeException {
    public AttractionNotFoundException() {
        super("Attrazione non trovata");
    }
}
