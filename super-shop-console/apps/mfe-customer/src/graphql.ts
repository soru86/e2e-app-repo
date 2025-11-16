import { gql } from "@apollo/client";

export const CUSTOMER_DASHBOARD = gql`
  query CustomerDashboard {
    customerDashboard {
      orderHistory {
        id
        status
        total
        createdAt
      }
      paymentHistory {
        id
        method
        amount
        status
        processedAt
      }
      totalSavings
      totalOrders
      totalPayments
      issuesOpen
      issues {
        id
        status
        category
        description
        createdAt
      }
    }
  }
`;

export const CREATE_ISSUE = gql`
  mutation CreateIssue($input: CreateIssueInput!) {
    createIssue(input: $input) {
      id
      status
      description
    }
  }
`;

