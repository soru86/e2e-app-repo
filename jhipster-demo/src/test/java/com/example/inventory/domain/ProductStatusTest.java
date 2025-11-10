package com.example.inventory.domain;

import static com.example.inventory.domain.ProductStatusTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.example.inventory.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProductStatusTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductStatus.class);
        ProductStatus productStatus1 = getProductStatusSample1();
        ProductStatus productStatus2 = new ProductStatus();
        assertThat(productStatus1).isNotEqualTo(productStatus2);

        productStatus2.setId(productStatus1.getId());
        assertThat(productStatus1).isEqualTo(productStatus2);

        productStatus2 = getProductStatusSample2();
        assertThat(productStatus1).isNotEqualTo(productStatus2);
    }

    @Test
    void hashCodeVerifier() throws Exception {
        ProductStatus productStatus = new ProductStatus();
        assertThat(productStatus.hashCode()).isZero();

        ProductStatus productStatus1 = getProductStatusSample1();
        productStatus.setId(productStatus1.getId());
        assertThat(productStatus).hasSameHashCodeAs(productStatus1);
    }
}
