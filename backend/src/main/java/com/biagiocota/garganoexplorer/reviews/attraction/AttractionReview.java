package com.biagiocota.garganoexplorer.reviews.attraction;

import com.biagiocota.garganoexplorer.attraction.Attraction;
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
@NoArgsConstructor
@Getter
@Setter
@Table(name = "attraction_review" , uniqueConstraints = @UniqueConstraint(name = "uk_attraction_review_author" , columnNames = {"attraction_id" , "author_id"}))
public class AttractionReview {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attraction_id" , nullable = false)
    private Attraction attraction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id" , nullable = false)
    private User author;

    @Column(nullable = false)
    private String text;

    @CreationTimestamp
    @Column(nullable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
