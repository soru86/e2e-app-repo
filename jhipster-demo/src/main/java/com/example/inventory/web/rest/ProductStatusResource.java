package com.example.inventory.web.rest;

import com.example.inventory.domain.ProductStatus;
import com.example.inventory.repository.ProductStatusRepository;
import com.example.inventory.security.AuthoritiesConstants;
import com.example.inventory.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.example.inventory.domain.ProductStatus}.
 */
@RestController
@RequestMapping("/api/product-statuses")
@Transactional
public class ProductStatusResource {

    private final Logger log = LoggerFactory.getLogger(ProductStatusResource.class);

    private static final String ENTITY_NAME = "productStatus";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductStatusRepository productStatusRepository;

    public ProductStatusResource(ProductStatusRepository productStatusRepository) {
        this.productStatusRepository = productStatusRepository;
    }

    /**
     * {@code POST  /product-statuses} : Create a new productStatus.
     *
     * @param productStatus the productStatus to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productStatus, or with status {@code 400 (Bad Request)} if the productStatus has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    @PostMapping("")
    public ResponseEntity<ProductStatus> createProductStatus(@Valid @RequestBody ProductStatus productStatus) throws URISyntaxException {
        log.debug("REST request to save ProductStatus : {}", productStatus);
        if (productStatus.getId() != null) {
            throw new BadRequestAlertException("A new productStatus cannot already have an ID", ENTITY_NAME, "idexists");
        }
        String normalizedCode = normalizeCode(productStatus.getCode());
        if (productStatusRepository.existsByCodeIgnoreCase(normalizedCode)) {
            throw new BadRequestAlertException("A productStatus with this code already exists", ENTITY_NAME, "codeexists");
        }

        productStatus.setCode(normalizedCode);

        productStatus = productStatusRepository.save(productStatus);
        return ResponseEntity.created(new URI("/api/product-statuses/" + productStatus.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, productStatus.getId().toString()))
            .body(productStatus);
    }

    /**
     * {@code PUT  /product-statuses/:id} : Updates an existing productStatus.
     *
     * @param id the id of the productStatus to save.
     * @param productStatus the productStatus to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productStatus,
     * or with status {@code 400 (Bad Request)} if the productStatus is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productStatus couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    @PutMapping("/{id}")
    public ResponseEntity<ProductStatus> updateProductStatus(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProductStatus productStatus
    ) throws URISyntaxException {
        log.debug("REST request to update ProductStatus : {}, {}", id, productStatus);
        if (productStatus.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productStatus.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productStatusRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        String normalizedCode = normalizeCode(productStatus.getCode());
        if (productStatusRepository.existsByCodeIgnoreCaseAndIdNot(normalizedCode, id)) {
            throw new BadRequestAlertException("A productStatus with this code already exists", ENTITY_NAME, "codeexists");
        }

        productStatus.setCode(normalizedCode);

        productStatus = productStatusRepository.save(productStatus);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productStatus.getId().toString()))
            .body(productStatus);
    }

    /**
     * {@code PATCH  /product-statuses/:id} : Partial updates given fields of an existing productStatus, field will ignore if it is null
     *
     * @param id the id of the productStatus to save.
     * @param productStatus the productStatus to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productStatus,
     * or with status {@code 400 (Bad Request)} if the productStatus is not valid,
     * or with status {@code 404 (Not Found)} if the productStatus is not found,
     * or with status {@code 500 (Internal Server Error)} if the productStatus couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProductStatus> partialUpdateProductStatus(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProductStatus productStatus
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProductStatus partially : {}, {}", id, productStatus);
        if (productStatus.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productStatus.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productStatusRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProductStatus> result = productStatusRepository
            .findById(productStatus.getId())
            .map(existingProductStatus -> {
                if (productStatus.getCode() != null && !productStatus.getCode().equalsIgnoreCase(existingProductStatus.getCode())) {
                    String normalizedCode = normalizeCode(productStatus.getCode());
                    if (productStatusRepository.existsByCodeIgnoreCaseAndIdNot(normalizedCode, id)) {
                        throw new BadRequestAlertException("A productStatus with this code already exists", ENTITY_NAME, "codeexists");
                    }
                    existingProductStatus.setCode(normalizedCode);
                }
                if (productStatus.getLabel() != null) {
                    existingProductStatus.setLabel(productStatus.getLabel());
                }
                if (productStatus.getDescription() != null) {
                    existingProductStatus.setDescription(productStatus.getDescription());
                }
                if (productStatus.getIsDefault() != null) {
                    existingProductStatus.setIsDefault(productStatus.getIsDefault());
                }
                if (productStatus.getIsActive() != null) {
                    existingProductStatus.setIsActive(productStatus.getIsActive());
                }

                return existingProductStatus;
            })
            .map(productStatusRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productStatus.getId().toString())
        );
    }

    /**
     * {@code GET  /product-statuses} : get all the productStatuses.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productStatuses in body.
     */
    @GetMapping("")
    public List<ProductStatus> getAllProductStatuses() {
        log.debug("REST request to get all ProductStatuses");
        return productStatusRepository.findAll();
    }

    /**
     * {@code GET  /product-statuses/:id} : get the "id" productStatus.
     *
     * @param id the id of the productStatus to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productStatus, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductStatus> getProductStatus(@PathVariable("id") Long id) {
        log.debug("REST request to get ProductStatus : {}", id);
        Optional<ProductStatus> productStatus = productStatusRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(productStatus);
    }

    /**
     * {@code DELETE  /product-statuses/:id} : delete the "id" productStatus.
     *
     * @param id the id of the productStatus to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductStatus(@PathVariable("id") Long id) {
        log.debug("REST request to delete ProductStatus : {}", id);
        productStatusRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    private String normalizeCode(String code) {
        return code == null ? null : code.trim().toUpperCase(Locale.ROOT);
    }
}
