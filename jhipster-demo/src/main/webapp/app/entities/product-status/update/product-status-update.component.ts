import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IProductStatus } from '../product-status.model';
import { ProductStatusService } from '../service/product-status.service';
import { ProductStatusFormService, ProductStatusFormGroup } from './product-status-form.service';

@Component({
  standalone: true,
  selector: 'jhi-product-status-update',
  templateUrl: './product-status-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProductStatusUpdateComponent implements OnInit {
  isSaving = false;
  productStatus: IProductStatus | null = null;

  protected productStatusService = inject(ProductStatusService);
  protected productStatusFormService = inject(ProductStatusFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ProductStatusFormGroup = this.productStatusFormService.createProductStatusFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productStatus }) => {
      this.productStatus = productStatus;
      if (productStatus) {
        this.updateForm(productStatus);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productStatus = this.productStatusFormService.getProductStatus(this.editForm);
    if (productStatus.id !== null) {
      this.subscribeToSaveResponse(this.productStatusService.update(productStatus));
    } else {
      this.subscribeToSaveResponse(this.productStatusService.create(productStatus));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductStatus>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(productStatus: IProductStatus): void {
    this.productStatus = productStatus;
    this.productStatusFormService.resetForm(this.editForm, productStatus);
  }
}
