package com.biagiocota.garganoexplorer.photo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class PhotoCleanupListener {

    private final CloudinaryClient cloudinaryClient;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onPhotosDeleted(PhotosDeletedEvent event) {
        for (String publicId : event.publicIds()) {
            try {
                cloudinaryClient.destroy(publicId);
            } catch (RuntimeException e) {
                log.warn("Impossibile eliminare la foto {} da Cloudinary", publicId, e);
            }
        }
    }
}