package com.biagiocota.garganoexplorer.business;

import com.biagiocota.garganoexplorer.common.Town;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BusinessRepository extends JpaRepository<Business , UUID> {
    Page<Business> findByTown(Town town , Pageable pageable);
    Page<Business> findByCategory(BusinessCategory category , Pageable pageable);
    Page<Business> findByTownAndCategory(Town town , BusinessCategory category , Pageable pageable);
    List<Business> findByOwnerIdOrderByCreatedAtDesc(UUID ownerId);
}
