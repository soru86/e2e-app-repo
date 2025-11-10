import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderSummary } from '../models/order';

export interface PlaceOrderPayload {
  userId: string;
  symbol: string;
  assetType: string;
  side: string;
  orderType: string;
  quantity: number;
  limitPrice?: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly commandBaseUrl = 'http://localhost:8082/api/commands/orders';
  private readonly queryBaseUrl = 'http://localhost:8083/api/query/orders';

  constructor(private readonly http: HttpClient) {}

  placeOrder(payload: PlaceOrderPayload): Observable<{ orderId: string }> {
    return this.http.post<{ orderId: string }>(this.commandBaseUrl, payload);
  }

  cancelOrder(orderId: string): Observable<unknown> {
    return this.http.post(`${this.commandBaseUrl}/${orderId}/cancel`, {});
  }

  listOrders(userId: string): Observable<OrderSummary[]> {
    return this.http.get<OrderSummary[]>(`${this.queryBaseUrl}?userId=${userId}`);
  }
}

