package com.biagiocota.garganoexplorer.favorite.attraction;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FavoriteAttractionRepository extends JpaRepository<FavoriteAttraction, UUID> {
    boolean existsByUserIdAndAttractionId(UUID userId, UUID attractionId);
    void deleteByUserIdAndAttractionId(UUID userId, UUID attractionId);
    @EntityGraph(attributePaths = "attraction")
    List<FavoriteAttraction> findByUserIdOrderByCreatedAtDesc(UUID userId);
    void deleteAllByAttractionId(UUID attractionId);
    void deleteAllByUserId(UUID userId);

    @Query("SELECT f.attraction.id FROM FavoriteAttraction f WHERE f.user.id = :userId")
    List<UUID> findAttractionIdsByUserId(@Param("userId")UUID userId);
}
