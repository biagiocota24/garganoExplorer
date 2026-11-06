package com.biagiocota.garganoexplorer.photo;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

// DICE A SPRING DI CREARE IL COMPONENTE ALL'AVVIO E DI RENDERLO DISPONIBILE ALLE ALTRE CLASSI
@Component
@RequiredArgsConstructor
public class CloudinarySigner {

    private final CloudinaryProperties properties;

    //QUESTO METODO RICEVE I PARAMETRI DA FIRMARE
    public String sign(Map<String, String> params) {
        // TreeMap ORDINA I PARAMETRI IN ORDINE ALFABETICO
        // POI CON IL MAP LI UNISCO NEL FORMATO "key=value&key=value"
        String toSign = new TreeMap<>(params).entrySet().stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .collect(Collectors.joining("&"));
        // UTIIZZO IL TRY-CATCH SOLO PERCHE JAVA OBBLIGA A GESTIRE IL CASO CHE SHA-1 NON ESISTA , IL CHE E INPROBABILE
        try {
            // E UNA CLASSE DI JAVA CHE SA CALCOLARE GLI HASH, CIOE RICEVE UN TESTO E LO CONVERTE IN UNA SEQUENZA DI LARGHEZZA FISSA
            // SHA-1 E 'ALGORITMO CHE VOGLIAMO UTILIZZARE
            MessageDigest digest = MessageDigest.getInstance("SHA-1");
            // CREA L'HASH DEI PARAMETRI CONCATENATI E DELL'API_SECRET
            byte[] hash = digest.digest((toSign + properties.apiSecret()).getBytes(StandardCharsets.UTF_8));
            // CONVERTE L'HASH GENERATO IN UNA STRINGA ESADECIMALE LEGGIBILE
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-1 non disponibile", e);
        }
    }
}