package com.biagiocota.garganoexplorer.attraction;

import com.biagiocota.garganoexplorer.common.Town;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AttractionRepository extends JpaRepository<Attraction, UUID> {
    Page<Attraction> findByTown(Town town, Pageable pageable);

    Page<Attraction> findByCategory(AttractionCategory category, Pageable pageable);

    Page<Attraction> findByTownAndCategory(Town town, AttractionCategory category, Pageable pageable);
}
