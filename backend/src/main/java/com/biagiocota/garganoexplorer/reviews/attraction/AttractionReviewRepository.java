package com.biagiocota.garganoexplorer.reviews.attraction;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AttractionReviewRepository extends JpaRepository<AttractionReview , UUID> {
    @EntityGraph(attributePaths = "author")
    Page<AttractionReview> findByAttractionIdOrderByCreatedAtDesc(UUID attractionId , Pageable pageable);
    boolean existsByAuthorIdAndAttractionId(UUID authorId , UUID attractionId);
    void deleteAllByAttractionId(UUID attractionId);
    long countByAttractionId(UUID attractionId);
}
