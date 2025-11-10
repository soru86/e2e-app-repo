import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { PortfolioPosition } from '../../models/portfolio-position';
import { UserProfile } from '../../models/user-profile';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent implements OnChanges {
  @Input({ required: true }) user!: UserProfile;

  positions: PortfolioPosition[] = [];
  loading = false;

  constructor(private readonly portfolioService: PortfolioService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']?.currentValue) {
      this.loadPortfolio();
    }
  }

  loadPortfolio(): void {
    this.loading = true;
    this.portfolioService.byUser(this.user.userId).subscribe({
      next: positions => {
        this.positions = positions;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}

