package com.biagiocota.garganoexplorer.favorite.business;

import com.biagiocota.garganoexplorer.business.Business;
import com.biagiocota.garganoexplorer.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "favorite_businesses", uniqueConstraints = @UniqueConstraint(
        name = "uk_favorite_business_user",
        columnNames = {"user_id", "business_id"}
))
@NoArgsConstructor
@Getter
@Setter
public class FavoriteBusiness {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn( name = "user_id",nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false , name = "business_id")
    private Business business;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}
