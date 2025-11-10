import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { UserProfile } from '../../models/user-profile';
import { OrdersComponent } from '../orders/orders.component';
import { PortfolioComponent } from '../portfolio/portfolio.component';
import { MarketTickerComponent } from '../market-ticker/market-ticker.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, OrdersComponent, PortfolioComponent, MarketTickerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  @Input({ required: true }) user!: UserProfile;
}

