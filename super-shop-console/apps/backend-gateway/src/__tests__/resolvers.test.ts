import { resolvers } from "../graphql/resolvers";

describe("customerDashboard resolver", () => {
  it("returns summary stats", () => {
    const result = resolvers.Query.customerDashboard({}, {}, { user: { roles: ["CUSTOMER"], id: "cust-1" } } as any);
    expect(result.totalOrders).toBeGreaterThan(0);
    expect(result.orderHistory).toHaveLength(result.totalOrders);
  });
});

