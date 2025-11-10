package com.example.inventory.repository;

import com.example.inventory.domain.ProductStatus;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ProductStatus entity.
 */
@Repository
public interface ProductStatusRepository extends JpaRepository<ProductStatus, Long> {
    boolean existsByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);
}
