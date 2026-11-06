package com.biagiocota.garganoexplorer.photo;

// QUESTA E LA FIRMA CHE IL BE MANDA AL FE
// VIENE INVIATA PRIMA DEL CARICAMENTO E CONTIENE TUTTO CIO CHE SERVE PER CARICARE FOTO DIRETTAMENTE SU CLOUDINARY
// NON CONTIENE L'API SECRET MA SOLO LA FIRMA
// FOLDER E ALLOWEDFORMAS SONO FIRMATI , QUINDI IL FE NON PUO MODIFICARLI
public record UploadSignatureResponse(
        String cloudName,
        String apiKey,
        String timestamp,
        String folder,
        String allowedFormats,
        String signature
) {
}