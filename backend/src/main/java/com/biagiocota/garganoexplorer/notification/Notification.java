package com.biagiocota.garganoexplorer.notification;

import com.biagiocota.garganoexplorer.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(nullable = false)
    private User recipient;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @Column(nullable = false)
    private String message;

    private UUID businessId;
    private String businessName;

    @Column(nullable = false , name = "is_read")
    private boolean read = false;

    @Column(nullable = false)
    @CreationTimestamp
    private Instant createdAt;
}
