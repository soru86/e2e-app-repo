import { gql } from "@apollo/client";

export const ADMIN_DASHBOARD = gql`
  query AdminDashboard {
    adminDashboard {
      inventory {
        id
        sku
        name
        stock
        reorderThreshold
      }
      orders {
        id
        status
        total
        createdAt
      }
      issues {
        id
        customerId
        status
        category
        createdAt
      }
      discounts {
        id
        label
        type
        value
        active
      }
    }
  }
`;

export const UPSERT_DISCOUNT = gql`
  mutation UpsertDiscount($input: DiscountInput!) {
    upsertDiscountRule(input: $input) {
      id
      label
      value
      active
    }
  }
`;


