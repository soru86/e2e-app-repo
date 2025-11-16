export type Role = "CUSTOMER" | "ADMIN";

export type InventoryItem = {
  id: string;
  sku: string;
  name: string;
  stock: number;
  reorderThreshold: number;
};

export type Order = {
  id: string;
  customerId: string;
  status: "PENDING" | "PAID" | "FULFILLED";
  total: number;
  createdAt: string;
};

export type DiscountRule = {
  id: string;
  label: string;
  type: "PERCENTAGE" | "FLAT";
  value: number;
  active: boolean;
};

export type Issue = {
  id: string;
  customerId: string;
  category: string;
  status: "OPEN" | "ACKNOWLEDGED" | "RESOLVED";
  description: string;
  createdAt: string;
};


