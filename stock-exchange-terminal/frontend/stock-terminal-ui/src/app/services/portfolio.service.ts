import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PortfolioPosition } from '../models/portfolio-position';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private readonly baseUrl = 'http://localhost:8083/api/query/portfolio';

  constructor(private readonly http: HttpClient) {}

  byUser(userId: string): Observable<PortfolioPosition[]> {
    return this.http.get<PortfolioPosition[]>(`${this.baseUrl}/${userId}`);
  }
}

