import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IProductStatus } from '../product-status.model';

@Component({
  standalone: true,
  selector: 'jhi-product-status-detail',
  templateUrl: './product-status-detail.component.html',
  imports: [SharedModule, RouterModule, HasAnyAuthorityDirective, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ProductStatusDetailComponent {
  productStatus = input<IProductStatus | null>(null);

  previousState(): void {
    window.history.back();
  }
}
