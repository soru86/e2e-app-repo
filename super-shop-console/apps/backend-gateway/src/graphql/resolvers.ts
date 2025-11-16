import { GraphQLScalarType, GraphQLError, Kind } from "graphql";
import { discounts, inventory, issues, orders } from "../data/mockData";
import { issueCreatedCounter } from "../metrics";
import { randomUUID } from "crypto";
import { GraphQLContext } from "./context";

const DateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
  serialize(value) {
    return new Date(value as string).toISOString();
  },
  parseValue(value) {
    return new Date(value as string).toISOString();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value).toISOString();
    }
    return null;
  },
});

const requireRole = (context: GraphQLContext, role: string) => {
  if (!context.user?.roles?.includes(role)) {
    throw new GraphQLError("Forbidden", { extensions: { code: "FORBIDDEN" } });
  }
};

export const resolvers = {
  DateTime: DateTimeScalar,
  Query: {
    customerDashboard: (_: unknown, __: unknown, context: GraphQLContext) => {
      requireRole(context, "CUSTOMER");
      return {
        totalSavings: 1845.45,
        totalOrders: orders.length,
        totalPayments: orders.length,
        issuesOpen: issues.filter((issue) => issue.status === "OPEN").length,
        orderHistory: orders,
        paymentHistory: orders.map((order, idx) => ({
          id: `pay-${idx}`,
          method: idx % 2 === 0 ? "VISA" : "UPI",
          amount: order.total,
          status: order.status === "PENDING" ? "FAILED" : "CAPTURED",
          processedAt: order.createdAt,
        })),
        issues,
      };
    },
    adminDashboard: (_: unknown, __: unknown, context: GraphQLContext) => {
      requireRole(context, "ADMIN");
      return {
        inventory,
        orders,
        issues,
        discounts,
      };
    },
  },
  Mutation: {
    createIssue: (_: unknown, { input }: { input: { category: string; description: string } }, context: GraphQLContext) => {
      requireRole(context, "CUSTOMER");
      const issue = {
        id: randomUUID(),
        customerId: context.user?.id ?? "cust-1",
        status: "OPEN",
        createdAt: new Date().toISOString(),
        ...input,
      };
      issues.push(issue);
      issueCreatedCounter.inc();
      return issue;
    },
    upsertDiscountRule: (_: unknown, { input }: { input: any }, context: GraphQLContext) => {
      requireRole(context, "ADMIN");
      if (input.id) {
        const idx = discounts.findIndex((discount) => discount.id === input.id);
        if (idx >= 0) {
          discounts[idx] = { ...discounts[idx], ...input };
          return discounts[idx];
        }
      }
      const rule = { ...input, id: randomUUID() };
      discounts.push(rule);
      return rule;
    },
  },
};

