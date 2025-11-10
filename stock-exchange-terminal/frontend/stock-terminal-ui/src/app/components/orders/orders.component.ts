import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { OrderSummary } from '../../models/order';
import { UserProfile } from '../../models/user-profile';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnChanges {
  @Input({ required: true }) user!: UserProfile;

  orders: OrderSummary[] = [];
  loading = false;
  errorMessage = '';

  readonly orderForm = this.fb.group({
    symbol: ['', Validators.required],
    assetType: ['STOCK', Validators.required],
    side: ['BUY', Validators.required],
    orderType: ['MARKET', Validators.required],
    quantity: [10, [Validators.required, Validators.min(1)]],
    limitPrice: [null]
  });

  constructor(private readonly fb: FormBuilder, private readonly orderService: OrderService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']?.currentValue) {
      this.loadOrders();
    }
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.listOrders(this.user.userId).subscribe({
      next: orders => {
        this.orders = orders;
        this.loading = false;
      },
      error: err => {
        this.errorMessage = err.error?.message ?? 'Unable to load orders';
        this.loading = false;
      }
    });
  }

  placeOrder(): void {
    if (this.orderForm.invalid) {
      return;
    }
    this.loading = true;
    const formValue = this.orderForm.value;
    const payload = {
      userId: this.user.userId,
      symbol: (formValue.symbol ?? '').toUpperCase(),
      assetType: formValue.assetType,
      side: formValue.side,
      orderType: formValue.orderType,
      quantity: Number(formValue.quantity),
      limitPrice: formValue.limitPrice !== null && formValue.limitPrice !== undefined
        ? Number(formValue.limitPrice)
        : undefined
    };

    this.orderService.placeOrder(payload).subscribe({
      next: () => {
        this.orderForm.reset({
          symbol: '',
          assetType: 'STOCK',
          side: 'BUY',
          orderType: 'MARKET',
          quantity: 10,
          limitPrice: null
        });
        this.loadOrders();
      },
      error: err => {
        this.errorMessage = err.error?.message ?? 'Unable to place order';
        this.loading = false;
      }
    });
  }

  cancel(orderId: string): void {
    this.orderService.cancelOrder(orderId).subscribe({
      next: () => this.loadOrders(),
      error: err => this.errorMessage = err.error?.message ?? 'Unable to cancel order'
    });
  }
}

