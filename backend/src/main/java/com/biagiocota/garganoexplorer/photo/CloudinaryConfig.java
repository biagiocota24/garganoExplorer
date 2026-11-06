package com.biagiocota.garganoexplorer.photo;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

// DICE A SPRING CHE QUESTA CLASSE CONTIENE INFORMAZIONI DI CONFIGURAZIONE, E QUINDI DA LEGGERE ALL'AVVIO
@Configuration
//DICE A SPRING DI CREARE UN OGGETTO CloudinaryProperties  E LO RIEMPIE CON I VALORI DEL FILE DI CONFIGURAZIONE
//ADESSO SPRING PERMETTE DI UTILIZZARLO IN QUALSIASI CLASSE GIA COMPILATO
@EnableConfigurationProperties(CloudinaryProperties.class)
public class CloudinaryConfig {
}