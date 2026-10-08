package com.biagiocota.garganoexplorer.auth;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() {
        super("Credenziali non valide");
    }
}
