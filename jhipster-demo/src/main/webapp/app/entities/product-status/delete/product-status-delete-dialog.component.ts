import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IProductStatus } from '../product-status.model';
import { ProductStatusService } from '../service/product-status.service';

@Component({
  standalone: true,
  templateUrl: './product-status-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ProductStatusDeleteDialogComponent {
  productStatus?: IProductStatus;

  protected productStatusService = inject(ProductStatusService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productStatusService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
