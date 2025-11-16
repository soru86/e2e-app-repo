import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime

  enum OrderStatus {
    PENDING
    PAID
    FULFILLED
  }

  enum IssueStatus {
    OPEN
    ACKNOWLEDGED
    RESOLVED
  }

  type InventoryItem {
    id: ID!
    sku: String!
    name: String!
    stock: Int!
    reorderThreshold: Int!
  }

  type Order {
    id: ID!
    customerId: ID!
    status: OrderStatus!
    total: Float!
    createdAt: DateTime!
  }

  type Payment {
    id: ID!
    method: String!
    amount: Float!
    status: String!
    processedAt: DateTime!
  }

  type Issue {
    id: ID!
    customerId: ID!
    category: String!
    status: IssueStatus!
    description: String!
    createdAt: DateTime!
  }

  type DiscountRule {
    id: ID!
    label: String!
    type: String!
    value: Float!
    active: Boolean!
  }

  type CustomerDashboard {
    totalSavings: Float!
    totalOrders: Int!
    totalPayments: Int!
    issuesOpen: Int!
    orderHistory: [Order!]!
    paymentHistory: [Payment!]!
    issues: [Issue!]!
  }

  type AdminDashboard {
    inventory: [InventoryItem!]!
    orders: [Order!]!
    issues: [Issue!]!
    discounts: [DiscountRule!]!
  }

  input CreateIssueInput {
    category: String!
    description: String!
  }

  input DiscountInput {
    id: ID
    label: String!
    type: String!
    value: Float!
    active: Boolean!
  }

  type Query {
    customerDashboard: CustomerDashboard!
    adminDashboard: AdminDashboard!
  }

  type Mutation {
    createIssue(input: CreateIssueInput!): Issue!
    upsertDiscountRule(input: DiscountInput!): DiscountRule!
  }
`;

