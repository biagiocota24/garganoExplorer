package com.biagiocota.garganoexplorer.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;


    @GetMapping
    public List<NotificationResponse> getMine(@AuthenticationPrincipal UUID userId){
        return notificationService.findMine(userId);
    }

    @GetMapping("/unread-count")
    public UnreadCountResponse getUnreadCount(@AuthenticationPrincipal UUID userId){
        return new UnreadCountResponse(notificationService.countUnread(userId));
    }

    @PatchMapping("/{id}/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markAsRead(@PathVariable UUID id , @AuthenticationPrincipal UUID userId){
        notificationService.markAsRead(id , userId);
    }

    @PatchMapping("/read-all")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markAllAsRead(@AuthenticationPrincipal UUID userId){
        notificationService.markAllAsRead(userId);
    }

}
