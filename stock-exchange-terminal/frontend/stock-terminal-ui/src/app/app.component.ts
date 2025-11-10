import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { IdentityService } from './services/identity.service';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AsyncPipe, LoginComponent, DashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly user$ = this.identityService.user$;

  constructor(private readonly identityService: IdentityService) {}

  logout(): void {
    this.identityService.logout();
  }
}
