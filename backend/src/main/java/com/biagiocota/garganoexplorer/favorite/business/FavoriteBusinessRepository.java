package com.biagiocota.garganoexplorer.favorite.business;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FavoriteBusinessRepository extends JpaRepository<FavoriteBusiness, UUID> {
     boolean existsByUserIdAndBusinessId(UUID userId, UUID businessId);
     void deleteByUserIdAndBusinessId(UUID userId, UUID businessId);
     @EntityGraph(attributePaths = "business")
     List<FavoriteBusiness> findByUserIdOrderByCreatedAtDesc(UUID userId);
     void deleteAllByBusinessId(UUID businessId);
     void deleteAllByUserId(UUID userId);

     @Query("SELECT f.business.id FROM FavoriteBusiness f WHERE f.user.id = :userId")
    List<UUID> findBusinessIdsByUserId(@Param("userId")UUID userId);
}
