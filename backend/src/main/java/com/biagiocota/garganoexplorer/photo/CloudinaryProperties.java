package com.biagiocota.garganoexplorer.photo;

import org.springframework.boot.context.properties.ConfigurationProperties;

// DICE A SPRING DI CERCARE NEL FILE DI CONFIGURAZIONE TUTTE LE CHIAVI CHE INIZIANO CON "cloudinary"
@ConfigurationProperties(prefix = "cloudinary")

public record CloudinaryProperties(String cloudName, String apiKey, String apiSecret, String folder) {
}


// DICE A SPRING DOVE LEGGERE LE VARIABILI NEL FILE DI CONFIGURAZIONE