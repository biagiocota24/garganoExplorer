package com.biagiocota.garganoexplorer.business;

import com.biagiocota.garganoexplorer.common.Town;
import com.biagiocota.garganoexplorer.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "businesses")
@NoArgsConstructor
@Getter
@Setter
public class Business {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false , columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BusinessCategory category;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Town town;

    @Column(nullable = false)
    private String address;

    private Double latitude;
    private Double longitude;
    private String phone;
    private String email;
    private String website;

    @Enumerated(EnumType.STRING)
    private PriceRange priceRange;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id" , nullable = false)
    private User owner;

    @Column(nullable = false , updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;
}
