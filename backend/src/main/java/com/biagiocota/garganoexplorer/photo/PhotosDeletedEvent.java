package com.biagiocota.garganoexplorer.photo;

import java.util.List;

// Pubblicato quando delle foto vengono eliminate dal database (es. cancellando un luogo).
// Contiene i publicId (step 5) da rimuovere anche da Cloudinary.
// Un listener lo riceve e chiama CloudinaryClient.destroy() (step 4):
// così chi cancella i dati non deve conoscere Cloudinary.
public record PhotosDeletedEvent(List<String> publicIds) {
}