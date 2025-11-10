import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { ProductStatusService } from '../service/product-status.service';
import { IProductStatus } from '../product-status.model';
import { sampleWithNewData, sampleWithRequiredData } from '../product-status.test-samples';
import { ProductStatusFormService } from './product-status-form.service';

import { ProductStatusUpdateComponent } from './product-status-update.component';

describe('ProductStatus Management Update Component', () => {
  let comp: ProductStatusUpdateComponent;
  let fixture: ComponentFixture<ProductStatusUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productStatusFormService: ProductStatusFormService;
  let productStatusService: ProductStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ProductStatusUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ProductStatusUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductStatusUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productStatusFormService = TestBed.inject(ProductStatusFormService);
    productStatusService = TestBed.inject(ProductStatusService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const productStatus: IProductStatus = sampleWithRequiredData;

      activatedRoute.data = of({ productStatus });
      comp.ngOnInit();

      expect(comp.productStatus).toEqual(productStatus);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductStatus>>();
      const productStatus = sampleWithRequiredData;
      jest.spyOn(productStatusFormService, 'getProductStatus').mockReturnValue(productStatus);
      jest.spyOn(productStatusService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productStatus });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productStatus }));
      saveSubject.complete();

      // THEN
      expect(productStatusFormService.getProductStatus).toHaveBeenCalled();
      expect(productStatusService.update).toHaveBeenCalledWith(expect.objectContaining(productStatus));
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductStatus>>();
      const productStatus = sampleWithRequiredData;
      jest.spyOn(productStatusFormService, 'getProductStatus').mockReturnValue(sampleWithNewData);
      jest.spyOn(productStatusService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productStatus: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productStatus }));
      saveSubject.complete();

      // THEN
      expect(productStatusFormService.getProductStatus).toHaveBeenCalled();
      expect(productStatusService.create).toHaveBeenCalledWith(sampleWithNewData);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductStatus>>();
      const productStatus = sampleWithRequiredData;
      jest.spyOn(productStatusService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productStatus });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productStatusService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
