package com.biagiocota.garganoexplorer.photo;

public class PhotoNotFoundException extends RuntimeException {
    public PhotoNotFoundException(String publicId) {
        super("Foto non trovata: " + publicId);
    }
}
