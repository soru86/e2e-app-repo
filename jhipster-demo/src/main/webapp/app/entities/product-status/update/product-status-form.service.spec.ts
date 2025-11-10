import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../product-status.test-samples';

import { ProductStatusFormService } from './product-status-form.service';

describe('ProductStatus Form Service', () => {
  let service: ProductStatusFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductStatusFormService);
  });

  describe('Service methods', () => {
    describe('createProductStatusFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProductStatusFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            label: expect.any(Object),
            description: expect.any(Object),
            isDefault: expect.any(Object),
            isActive: expect.any(Object),
          }),
        );
      });

      it('passing IProductStatus should create a new form with FormGroup', () => {
        const formGroup = service.createProductStatusFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            label: expect.any(Object),
            description: expect.any(Object),
            isDefault: expect.any(Object),
            isActive: expect.any(Object),
          }),
        );
      });
    });

    describe('getProductStatus', () => {
      it('should return NewProductStatus for default ProductStatus initial value', () => {
        const formGroup = service.createProductStatusFormGroup(sampleWithNewData);

        const productStatus = service.getProductStatus(formGroup) as any;

        expect(productStatus).toMatchObject(sampleWithNewData);
      });

      it('should return NewProductStatus for empty ProductStatus initial value', () => {
        const formGroup = service.createProductStatusFormGroup();

        const productStatus = service.getProductStatus(formGroup) as any;

        expect(productStatus).toMatchObject({
          id: null,
          code: '',
          label: '',
          isDefault: false,
          isActive: true,
          description: null,
        });
      });

      it('should return IProductStatus', () => {
        const formGroup = service.createProductStatusFormGroup(sampleWithRequiredData);

        const productStatus = service.getProductStatus(formGroup) as any;

        expect(productStatus).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProductStatus should not enable id FormControl', () => {
        const formGroup = service.createProductStatusFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProductStatus should disable id FormControl', () => {
        const formGroup = service.createProductStatusFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithNewData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
