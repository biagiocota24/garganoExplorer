package com.biagiocota.garganoexplorer.notification;

public class NotificationNotFoundException extends RuntimeException {
    public NotificationNotFoundException() {
        super("Notifica non trovata");
    }
}
