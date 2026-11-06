package com.biagiocota.garganoexplorer.photo;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.time.Instant;
import java.util.Map;

// DICE A SPRING DI CREARE IL COMPONENTE ALL'AVVIO E DI RENDERLO DISPONIBILE ALLE ALTRE CLASSI
@Component
//QUESTA SARA LA CLASSE CHE PARLA CON CLOUDINARY VIA RETE
public class CloudinaryClient {

    private final CloudinaryProperties properties;
    private final CloudinarySigner signer;
    //E UNO STRUMENTO DI SPRING CHE INVIA RICHIESTE HTTP, ESATTAMENTE COME IL BROWSER , MA LO FA DAL CODICE
    private final RestClient restClient;

    // COSTRUTTORE ESPLICITO NECESSARIO PERCHE DOBBIAMO COMPORRE IL RestClient CHE NON ARRIVA PRONTO E DOBBIAMO CREARE PUNTANTO AL LINK DI CLOUDINARY(in questo caso) + CLOUDNAME
    public CloudinaryClient(CloudinaryProperties properties, CloudinarySigner signer) {
        this.properties = properties;
        this.signer = signer;
        this.restClient = RestClient.create("https://api.cloudinary.com/v1_1/" + properties.cloudName());
    }


    public void destroy(String publicId) {
        // TIMESTAMP RESTITUISCE L'ORA ATTUALE IN SECONDI E VIENE UTILIZZATA PER RIFIUTARE RICHIESTE TROPPO VECCHIE
        String timestamp = String.valueOf(Instant.now().getEpochSecond());

        // QUESTO E IL MODULO DA SPEDIRE CON 4 CAMPI
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("public_id", publicId); // ID DELLA FOTO DA CANCELLARE
        form.add("timestamp", timestamp); //
        form.add("api_key", properties.apiKey()); // CHI STA FACENDO LA RICHIESTA , CIOE CLOUD API KEY, CHE E LA PARTE PUBBLICA DELLE CREDENZIALI
        form.add("signature", signer.sign(Map.of("public_id", publicId, "timestamp", timestamp))); // CREA LA FIRMA CALCOLATA CON publicId + timeStamp + il api_secret

        // RICHIETA "POST" INVIATA COME MODULO "APPLICATION_FORM_URLENCODED"
        restClient.post()
                .uri("/image/destroy")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                // QUESTO DICE INVIA LA RICHIESTA, SE VA MALE LANCIA UN ERRORE, LA RISPOSTA NON MI INTERESSA
                .retrieve()
                .toBodilessEntity();
    }
}