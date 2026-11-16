package com.biagiocota.garganoexplorer.reviews;

public class ReviewAlreadyExistsException extends RuntimeException {
    public ReviewAlreadyExistsException(String message) {
        super(message);
    }
}
