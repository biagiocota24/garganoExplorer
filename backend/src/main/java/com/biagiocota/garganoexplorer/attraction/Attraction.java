package com.biagiocota.garganoexplorer.attraction;

import com.biagiocota.garganoexplorer.common.Town;
import com.biagiocota.garganoexplorer.photo.Photo;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "attractions")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Setter
public class Attraction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Town town;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttractionCategory category;

    private Double latitude;

    private Double longitude;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    @ElementCollection
    @CollectionTable(name = "attractions_photos", joinColumns = @JoinColumn(name = "attractions_id"))
    @OrderColumn(name = "position")
    @BatchSize(size = 20)
    private List<Photo> photos = new ArrayList<>();

}
