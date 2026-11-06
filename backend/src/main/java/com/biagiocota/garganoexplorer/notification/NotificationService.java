package com.biagiocota.garganoexplorer.notification;

import com.biagiocota.garganoexplorer.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    @Transactional
    public void create(User recipient , NotificationType type , String message , UUID businessId , String businessName){
        Notification newNotification = new Notification();
        newNotification.setRecipient(recipient);
        newNotification.setType(type);
        newNotification.setMessage(message);
        newNotification.setBusinessId(businessId);
        newNotification.setBusinessName(businessName);
        notificationRepository.save(newNotification);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> findMine(UUID userId){
        List<Notification> mines = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
        return mines.stream().map(NotificationResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public long countUnread(UUID userId){
        return notificationRepository.countByRecipientIdAndReadFalse(userId);
    }

    @Transactional
    public void markAsRead(UUID notificationId , UUID userId){
        Notification notification = notificationRepository.findById(notificationId).orElseThrow(NotificationNotFoundException::new);
        if(!notification.getRecipient().getId().equals(userId)){
            throw new NotificationNotFoundException();
        }
        notification.setRead(true);
    }

    @Transactional
    public void markAllAsRead(UUID userId){
        notificationRepository.findByRecipientIdAndReadFalse(userId)
                .forEach(notification -> notification.setRead(true));
    }
}
