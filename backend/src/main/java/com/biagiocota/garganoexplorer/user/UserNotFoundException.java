package com.biagiocota.garganoexplorer.user;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException() {
        super("L'utente non è stato trovato");
    }
}
