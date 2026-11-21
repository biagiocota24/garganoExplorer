package com.biagiocota.garganoexplorer.favorite.attraction;

import com.biagiocota.garganoexplorer.attraction.Attraction;
import com.biagiocota.garganoexplorer.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;
@Entity
@Table(name = "favorite_attractions", uniqueConstraints = @UniqueConstraint(
        name = "uk_favorite_attraction_user",
        columnNames = {"user_id", "attraction_id"}
))
@NoArgsConstructor
@Getter
@Setter
public class FavoriteAttraction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn( name = "user_id",nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false , name = "attraction_id")
    private Attraction attraction;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}