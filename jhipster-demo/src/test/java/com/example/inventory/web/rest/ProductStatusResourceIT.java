package com.example.inventory.web.rest;

import static com.example.inventory.domain.ProductStatusAsserts.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.inventory.IntegrationTest;
import com.example.inventory.domain.ProductStatus;
import com.example.inventory.repository.ProductStatusRepository;
import com.example.inventory.security.AuthoritiesConstants;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProductStatusResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser(authorities = AuthoritiesConstants.ADMIN)
class ProductStatusResourceIT {

    private static final String DEFAULT_CODE = "AVAILABLE";
    private static final String UPDATED_CODE = "BACK_ORDERED";

    private static final String DEFAULT_LABEL = "Available";
    private static final String UPDATED_LABEL = "Back Ordered";

    private static final String DEFAULT_DESCRIPTION = "Sellable inventory that can be promised to customers";
    private static final String UPDATED_DESCRIPTION = "Updated description for status";

    private static final Boolean DEFAULT_IS_DEFAULT = true;
    private static final Boolean UPDATED_IS_DEFAULT = false;

    private static final Boolean DEFAULT_IS_ACTIVE = true;
    private static final Boolean UPDATED_IS_ACTIVE = false;

    private static final String ENTITY_API_URL = "/api/product-statuses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ProductStatusRepository productStatusRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductStatusMockMvc;

    private ProductStatus productStatus;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductStatus createEntity(EntityManager em) {
        ProductStatus productStatus = new ProductStatus()
            .code(DEFAULT_CODE)
            .label(DEFAULT_LABEL)
            .description(DEFAULT_DESCRIPTION)
            .isDefault(DEFAULT_IS_DEFAULT)
            .isActive(DEFAULT_IS_ACTIVE);
        return productStatus;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductStatus createUpdatedEntity(EntityManager em) {
        ProductStatus productStatus = new ProductStatus()
            .code(UPDATED_CODE)
            .label(UPDATED_LABEL)
            .description(UPDATED_DESCRIPTION)
            .isDefault(UPDATED_IS_DEFAULT)
            .isActive(UPDATED_IS_ACTIVE);
        return productStatus;
    }

    @BeforeEach
    public void initTest() {
        productStatus = createEntity(em);
    }

    @Test
    @Transactional
    void createProductStatus() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ProductStatus
        var returnedProductStatus = om.readValue(
            restProductStatusMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productStatus)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ProductStatus.class
        );

        // Validate the ProductStatus in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertProductStatusUpdatableFieldsEquals(returnedProductStatus, getPersistedProductStatus(returnedProductStatus));
    }

    @Test
    @Transactional
    void createProductStatusShouldNormalizeCode() throws Exception {
        productStatus.code(" temp_code ");

        var returnedProductStatus = om.readValue(
            restProductStatusMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productStatus)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ProductStatus.class
        );

        assertThat(returnedProductStatus.getCode()).isEqualTo("TEMP_CODE");
        assertThat(getPersistedProductStatus(returnedProductStatus).getCode()).isEqualTo("TEMP_CODE");
    }

    @Test
    @Transactional
    void createProductStatusWithExistingId() throws Exception {
        // Create the ProductStatus with an existing ID
        productStatus.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductStatusMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productStatus)))
            .andExpect(status().isBadRequest());

        // Validate the ProductStatus in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void createProductStatusWithExistingCodeShouldFail() throws Exception {
        productStatusRepository.saveAndFlush(productStatus);

        ProductStatus duplicate = createEntity(em).code(DEFAULT_CODE);

        restProductStatusMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(duplicate)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(1);
    }

    @Test
    @Transactional
    void checkCodeIsRequired() throws Exception {
        productStatus.setCode(null);

        restProductStatusMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productStatus)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    void checkLabelIsRequired() throws Exception {
        productStatus.setLabel(null);

        restProductStatusMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productStatus)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    void getAllProductStatuses() throws Exception {
        // Initialize the database
        productStatusRepository.saveAndFlush(productStatus);

        // Get all the productStatusList
        restProductStatusMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productStatus.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].isDefault").value(hasItem(DEFAULT_IS_DEFAULT.booleanValue())))
            .andExpect(jsonPath("$.[*].isActive").value(hasItem(DEFAULT_IS_ACTIVE.booleanValue())));
    }

    @Test
    @Transactional
    void getProductStatus() throws Exception {
        // Initialize the database
        productStatusRepository.saveAndFlush(productStatus);

        // Get the productStatus
        restProductStatusMockMvc
            .perform(get(ENTITY_API_URL_ID, productStatus.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productStatus.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.isDefault").value(DEFAULT_IS_DEFAULT.booleanValue()))
            .andExpect(jsonPath("$.isActive").value(DEFAULT_IS_ACTIVE.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingProductStatus() throws Exception {
        // Get the productStatus
        restProductStatusMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void deleteProductStatus() throws Exception {
        // Initialize the database
        productStatusRepository.saveAndFlush(productStatus);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the productStatus
        restProductStatusMockMvc
            .perform(delete(ENTITY_API_URL_ID, productStatus.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    @Test
    @Transactional
    void putExistingProductStatus() throws Exception {
        productStatusRepository.saveAndFlush(productStatus);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        ProductStatus updatedProductStatus = productStatusRepository.findById(productStatus.getId()).orElseThrow();
        em.detach(updatedProductStatus);
        updatedProductStatus
            .code(UPDATED_CODE)
            .label(UPDATED_LABEL)
            .description(UPDATED_DESCRIPTION)
            .isDefault(UPDATED_IS_DEFAULT)
            .isActive(UPDATED_IS_ACTIVE);

        restProductStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProductStatus.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedProductStatus))
            )
            .andExpect(status().isOk());

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedProductStatusToMatchAllProperties(updatedProductStatus);
    }

    @Test
    @Transactional
    void partialUpdateProductStatusWithPatch() throws Exception {
        productStatusRepository.saveAndFlush(productStatus);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        ProductStatus partialUpdatedProductStatus = new ProductStatus();
        partialUpdatedProductStatus.setId(productStatus.getId());
        partialUpdatedProductStatus
            .label(UPDATED_LABEL)
            .description(UPDATED_DESCRIPTION)
            .isActive(UPDATED_IS_ACTIVE);

        restProductStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductStatus.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProductStatus))
            )
            .andExpect(status().isOk());

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        ProductStatus expectedProductStatus = new ProductStatus()
            .id(productStatus.getId())
            .code(DEFAULT_CODE)
            .label(UPDATED_LABEL)
            .description(UPDATED_DESCRIPTION)
            .isDefault(DEFAULT_IS_DEFAULT)
            .isActive(UPDATED_IS_ACTIVE);
        assertProductStatusUpdatableFieldsEquals(expectedProductStatus, getPersistedProductStatus(productStatus));
    }

    @Test
    @Transactional
    void fullUpdateProductStatusWithPatch() throws Exception {
        productStatusRepository.saveAndFlush(productStatus);

        ProductStatus partialUpdatedProductStatus = new ProductStatus()
            .id(productStatus.getId())
            .code(UPDATED_CODE)
            .label(UPDATED_LABEL)
            .description(UPDATED_DESCRIPTION)
            .isDefault(UPDATED_IS_DEFAULT)
            .isActive(UPDATED_IS_ACTIVE);

        restProductStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductStatus.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProductStatus))
            )
            .andExpect(status().isOk());

        assertProductStatusUpdatableFieldsEquals(partialUpdatedProductStatus, getPersistedProductStatus(partialUpdatedProductStatus));
    }

    @Test
    @Transactional
    void putNonExistingProductStatus() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productStatus.setId(longCount.incrementAndGet());

        restProductStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productStatus.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(productStatus))
            )
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProductStatus() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productStatus.setId(longCount.incrementAndGet());

        restProductStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(productStatus))
            )
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProductStatus() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productStatus.setId(longCount.incrementAndGet());

        restProductStatusMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productStatus)))
            .andExpect(status().isMethodNotAllowed());

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProductStatusShouldFailOnDuplicateCode() throws Exception {
        productStatusRepository.saveAndFlush(productStatus);

        ProductStatus other = createUpdatedEntity(em);
        productStatusRepository.saveAndFlush(other);

        ProductStatus patchDto = new ProductStatus().id(productStatus.getId()).code(UPDATED_CODE);

        restProductStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, productStatus.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(patchDto))
            )
            .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    void patchNonExistingProductStatus() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productStatus.setId(longCount.incrementAndGet());

        restProductStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, productStatus.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(productStatus))
            )
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProductStatus() throws Exception {
        productStatus.setId(longCount.incrementAndGet());

        restProductStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(productStatus))
            )
            .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProductStatus() throws Exception {
        restProductStatusMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(productStatus)))
            .andExpect(status().isMethodNotAllowed());
    }

    protected long getRepositoryCount() {
        return productStatusRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected ProductStatus getPersistedProductStatus(ProductStatus productStatus) {
        return productStatusRepository.findById(productStatus.getId()).orElseThrow();
    }

    protected void assertPersistedProductStatusToMatchAllProperties(ProductStatus expectedProductStatus) {
        assertProductStatusAllPropertiesEquals(expectedProductStatus, getPersistedProductStatus(expectedProductStatus));
    }

    protected void assertPersistedProductStatusToMatchUpdatableProperties(ProductStatus expectedProductStatus) {
        assertProductStatusAllUpdatablePropertiesEquals(expectedProductStatus, getPersistedProductStatus(expectedProductStatus));
    }
}
