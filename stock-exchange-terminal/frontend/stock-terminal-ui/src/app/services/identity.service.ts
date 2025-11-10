import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserProfile } from '../models/user-profile';

interface AuthResponse {
  userId: string;
  email: string;
  displayName: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  private readonly baseUrl = 'http://localhost:8081/api/users';
  private readonly userSubject = new BehaviorSubject<UserProfile | null>(null);

  readonly user$: Observable<UserProfile | null> = this.userSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  register(email: string, displayName: string, password: string): Observable<UserProfile> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, { email, displayName, password })
      .pipe(tap(response => this.userSubject.next(response)));
  }

  login(email: string, password: string): Observable<UserProfile> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { email, password })
      .pipe(tap(response => this.userSubject.next(response)));
  }

  logout(): void {
    this.userSubject.next(null);
  }

  get token(): string | null {
    return this.userSubject.value?.token ?? null;
  }
}

