package com.biagiocota.garganoexplorer.reviews.attraction;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AttractionReviewRepository extends JpaRepository<AttractionReview , UUID> {
    @EntityGraph(attributePaths = "author")
    Page<AttractionReview> findByAttractionId(UUID attractionId , Pageable pageable);
    boolean existsByAuthorIdAndAttractionId(UUID authorId , UUID attractionId);
    void deleteAllByAttractionId(UUID attractionId);
    long countByAttractionId(UUID attractionId);
    Optional<AttractionReview> findByAuthorIdAndAttractionId(UUID authorId , UUID attractionId);
}
