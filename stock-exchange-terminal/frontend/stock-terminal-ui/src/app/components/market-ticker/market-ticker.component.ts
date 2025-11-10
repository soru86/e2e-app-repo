import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketDataService } from '../../services/market-data.service';
import { Observable } from 'rxjs';
import { MarketTicker } from '../../models/market-ticker';

@Component({
  selector: 'app-market-ticker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './market-ticker.component.html',
  styleUrl: './market-ticker.component.scss'
})
export class MarketTickerComponent {
  readonly tickers$: Observable<MarketTicker[]> = this.marketDataService.tickers$;

  constructor(private readonly marketDataService: MarketDataService) {}
}

