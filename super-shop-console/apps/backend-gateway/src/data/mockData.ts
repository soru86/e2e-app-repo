import type { Issue, Order, InventoryItem, DiscountRule } from "@super-shop/shared-types";

export const inventory: InventoryItem[] = [
  { id: "inv-1", sku: "SKU-AC-22", name: "Air Conditioner", stock: 12, reorderThreshold: 3 },
  { id: "inv-2", sku: "SKU-TV-42", name: "4K OLED TV", stock: 8, reorderThreshold: 2 },
  { id: "inv-3", sku: "SKU-PH-11", name: "Smartphone XL", stock: 64, reorderThreshold: 10 },
];

export const orders: Order[] = [
  { id: "ord-1", customerId: "cust-1", status: "FULFILLED", total: 1299, createdAt: new Date().toISOString() },
  { id: "ord-2", customerId: "cust-1", status: "PENDING", total: 89, createdAt: new Date().toISOString() },
];

export const discounts: DiscountRule[] = [
  { id: "disc-1", label: "Loyalty 10%", type: "PERCENTAGE", value: 10, active: true },
  { id: "disc-2", label: "Clearance $25", type: "FLAT", value: 25, active: false },
];

export const issues: Issue[] = [
  {
    id: "issue-1",
    customerId: "cust-1",
    category: "PAYMENT",
    status: "OPEN",
    description: "Payment double charged",
    createdAt: new Date().toISOString(),
  },
];

