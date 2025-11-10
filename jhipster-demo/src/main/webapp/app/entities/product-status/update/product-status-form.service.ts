import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IProductStatus, NewProductStatus } from '../product-status.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProductStatus for edit and NewProductStatusFormGroupInput for create.
 */
type ProductStatusFormGroupInput = IProductStatus | PartialWithRequiredKeyOf<NewProductStatus>;

type ProductStatusFormDefaults = Pick<NewProductStatus, 'id' | 'code' | 'label' | 'isDefault' | 'isActive'> & {
  description: string | null;
};

type ProductStatusFormGroupContent = {
  id: FormControl<IProductStatus['id'] | NewProductStatus['id']>;
  code: FormControl<IProductStatus['code']>;
  label: FormControl<IProductStatus['label']>;
  description: FormControl<IProductStatus['description']>;
  isDefault: FormControl<IProductStatus['isDefault']>;
  isActive: FormControl<IProductStatus['isActive']>;
};

export type ProductStatusFormGroup = FormGroup<ProductStatusFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProductStatusFormService {
  createProductStatusFormGroup(productStatus: ProductStatusFormGroupInput = { id: null }): ProductStatusFormGroup {
    const productStatusRawValue = {
      ...this.getFormDefaults(),
      ...productStatus,
    };
    return new FormGroup<ProductStatusFormGroupContent>({
      id: new FormControl(
        { value: productStatusRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      code: new FormControl(productStatusRawValue.code, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
        nonNullable: true,
      }),
      label: new FormControl(productStatusRawValue.label, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(80)],
        nonNullable: true,
      }),
      description: new FormControl(productStatusRawValue.description, {
        validators: [Validators.maxLength(255)],
      }),
      isDefault: new FormControl(productStatusRawValue.isDefault, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      isActive: new FormControl(productStatusRawValue.isActive, {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  getProductStatus(form: ProductStatusFormGroup): IProductStatus | NewProductStatus {
    const rawValue = form.getRawValue();
    if (rawValue.id === null) {
      return rawValue as NewProductStatus;
    }
    return rawValue as IProductStatus;
  }

  resetForm(form: ProductStatusFormGroup, productStatus: ProductStatusFormGroupInput): void {
    const productStatusRawValue = { ...this.getFormDefaults(), ...productStatus };
    form.reset(
      {
        ...productStatusRawValue,
        id: { value: productStatusRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProductStatusFormDefaults {
    return {
      id: null,
      code: '',
      label: '',
      description: null,
      isDefault: false,
      isActive: true,
    };
  }
}
