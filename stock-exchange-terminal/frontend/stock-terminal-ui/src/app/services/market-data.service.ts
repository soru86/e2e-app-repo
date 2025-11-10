import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { MarketTicker } from '../models/market-ticker';

@Injectable({
  providedIn: 'root'
})
export class MarketDataService implements OnDestroy {
  private readonly baseUrl = 'http://localhost:8084/api/market-data';
  private eventSource?: EventSource;
  private readonly tickersSubject = new BehaviorSubject<MarketTicker[]>([]);

  readonly tickers$: Observable<MarketTicker[]> = this.tickersSubject.asObservable();

  constructor(private readonly http: HttpClient, private readonly zone: NgZone) {
    this.loadSnapshot();
    this.startStream();
  }

  private loadSnapshot(): void {
    this.http.get<MarketTicker[]>(this.baseUrl).subscribe({
      next: tickers => this.tickersSubject.next(tickers),
      error: err => console.error('Failed to load market data snapshot', err)
    });
  }

  private startStream(): void {
    this.eventSource = new EventSource(`${this.baseUrl}/stream`);
    this.eventSource.onmessage = event => {
      this.zone.run(() => {
        const payload = JSON.parse(event.data) as MarketTicker;
        const current = this.tickersSubject.value.filter(ticker => ticker.symbol !== payload.symbol);
        this.tickersSubject.next([...current, payload]);
      });
    };
    this.eventSource.onerror = error => {
      console.error('Market data stream error', error);
      this.eventSource?.close();
      setTimeout(() => this.startStream(), 5000);
    };
  }

  ngOnDestroy(): void {
    this.eventSource?.close();
  }
}

