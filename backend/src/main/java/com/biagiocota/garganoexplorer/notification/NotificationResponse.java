package com.biagiocota.garganoexplorer.notification;

import java.time.Instant;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        NotificationType type,
        String message,
        UUID businessId,
        String businessName,
        boolean read,
        Instant createdAt
) {

    public static NotificationResponse from(Notification notification){
        return new NotificationResponse(
                notification.getId(),
                notification.getType(),
                notification.getMessage(),
                notification.getBusinessId(),
                notification.getBusinessName(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
