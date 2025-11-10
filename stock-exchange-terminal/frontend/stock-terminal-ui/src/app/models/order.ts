export interface OrderSummary {
  orderId: string;
  userId: string;
  assetType: string;
  symbol: string;
  side: string;
  orderType: string;
  quantity: number;
  limitPrice?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

