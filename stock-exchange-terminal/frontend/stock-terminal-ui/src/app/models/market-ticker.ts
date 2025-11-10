export interface MarketTicker {
  symbol: string;
  assetType: string;
  lastPrice: number;
  changeAbsolute?: number;
  changePercent?: number;
  updatedAt: string;
}

