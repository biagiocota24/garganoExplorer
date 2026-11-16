package com.biagiocota.garganoexplorer.reviews.business;

import com.biagiocota.garganoexplorer.business.Business;
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
@Table(name = "business_review" , uniqueConstraints = @UniqueConstraint(name = "uk_business_review_author" , columnNames = {"business_id" , "author_id"}))
@NoArgsConstructor
@Getter
@Setter
public class BusinessReview {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id" , nullable = false)
    private Business business;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id" , nullable = false)
    private User author;

    @Column(nullable = false)
    private int rating;

    @Column(nullable = false)
    private String text;

    @CreationTimestamp
    @Column(nullable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
