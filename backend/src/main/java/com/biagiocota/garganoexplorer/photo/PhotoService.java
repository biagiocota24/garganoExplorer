package com.biagiocota.garganoexplorer.photo;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PhotoService {

    public static final int MAX_PHOTOS = 10;
    private static final String ALLOWED_FORMATS = "jpg,png,webp";

    private final CloudinaryProperties properties;
    private final CloudinarySigner signer;
    private final ApplicationEventPublisher events;

    public UploadSignatureResponse createUploadSignature() {
        String timestamp = String.valueOf(Instant.now().getEpochSecond());
        String signature = signer.sign(Map.of(
                "allowed_formats", ALLOWED_FORMATS,
                "folder", properties.folder(),
                "timestamp", timestamp));

        return new UploadSignatureResponse(
                properties.cloudName(), properties.apiKey(), timestamp,
                properties.folder(), ALLOWED_FORMATS, signature);
    }

    public void addPhoto(List<Photo> photos, PhotoRequest request) {
        if (photos.size() >= MAX_PHOTOS) {
            throw new InvalidPhotoException("Puoi caricare al massimo " + MAX_PHOTOS + " foto");
        }

        String url = request.url().trim();
        String publicId = request.publicId().trim();
        String expectedPrefix = "https://res.cloudinary.com/" + properties.cloudName() + "/image/upload/";

        if (!publicId.startsWith(properties.folder() + "/")) {
            throw new InvalidPhotoException("La foto non appartiene alla cartella dell'applicazione");
        }
        if (!url.startsWith(expectedPrefix) || !url.contains("/" + publicId + ".")) {
            throw new InvalidPhotoException("L'URL non proviene dall'account Cloudinary dell'applicazione");
        }
        if (photos.stream().anyMatch(photo -> photo.getPublicId().equals(publicId))) {
            throw new InvalidPhotoException("Questa foto è già stata aggiunta");
        }

        photos.add(new Photo(url, publicId));
    }

    public void removePhoto(List<Photo> photos, String publicId) {
        boolean removed = photos.removeIf(photo -> photo.getPublicId().equals(publicId));
        if (!removed) {
            throw new PhotoNotFoundException(publicId);
        }
        events.publishEvent(new PhotosDeletedEvent(List.of(publicId)));
    }

    public void deleteAll(List<Photo> photos) {
        if (photos.isEmpty()) {
            return;
        }
        List<String> publicIds = photos.stream().map(Photo::getPublicId).toList();
        events.publishEvent(new PhotosDeletedEvent(publicIds));
    }
}
