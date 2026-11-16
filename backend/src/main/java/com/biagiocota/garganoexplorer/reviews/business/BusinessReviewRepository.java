package com.biagiocota.garganoexplorer.reviews.business;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface BusinessReviewRepository extends JpaRepository<BusinessReview , UUID>{
    @EntityGraph(attributePaths = "author")
    Page<BusinessReview> findByBusinessIdOrderByCreatedAtDesc(UUID businessId , Pageable pageable);
    boolean existsByAuthorIdAndBusinessId(UUID authorId , UUID businessId);
    void deleteAllByBusinessId(UUID businessId);
    long countByBusinessId(UUID businessId);

    @Query("SELECT AVG(r.rating) FROM BusinessReview r WHERE r.business.id = :businessId")
    Double findAverageRatingByBusinessId(@Param("businessId") UUID businessId);
}
