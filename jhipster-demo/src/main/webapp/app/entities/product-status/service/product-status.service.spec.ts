import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProductStatus } from '../product-status.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../product-status.test-samples';

import { ProductStatusService } from './product-status.service';

const requireRestSample: IProductStatus = {
  ...sampleWithRequiredData,
};

describe('ProductStatus Service', () => {
  let service: ProductStatusService;
  let httpMock: HttpTestingController;
  let expectedResult: IProductStatus | IProductStatus[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProductStatusService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a ProductStatus', () => {
      const productStatus = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(productStatus).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProductStatus', () => {
      const productStatus = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(productStatus).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProductStatus', () => {
      const patchObject = {
        id: sampleWithPartialData.id,
        label: sampleWithPartialData.label,
        description: sampleWithPartialData.description,
      };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProductStatus', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ProductStatus', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProductStatusToCollectionIfMissing', () => {
      it('should add a ProductStatus to an empty array', () => {
        const productStatus: IProductStatus = sampleWithRequiredData;
        expectedResult = service.addProductStatusToCollectionIfMissing([], productStatus);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productStatus);
      });

      it('should not add a ProductStatus to an array that contains it', () => {
        const productStatus: IProductStatus = sampleWithRequiredData;
        const productStatusCollection: IProductStatus[] = [
          {
            ...productStatus,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProductStatusToCollectionIfMissing(productStatusCollection, productStatus);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProductStatus to an array that doesn't contain it", () => {
        const productStatus: IProductStatus = sampleWithRequiredData;
        const productStatusCollection: IProductStatus[] = [sampleWithPartialData];
        expectedResult = service.addProductStatusToCollectionIfMissing(productStatusCollection, productStatus);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productStatus);
      });

      it('should add only unique ProductStatus to an array', () => {
        const productStatusArray: IProductStatus[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const productStatusCollection: IProductStatus[] = [sampleWithRequiredData];
        expectedResult = service.addProductStatusToCollectionIfMissing(productStatusCollection, ...productStatusArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const productStatus: IProductStatus = sampleWithRequiredData;
        const productStatus2: IProductStatus = sampleWithPartialData;
        expectedResult = service.addProductStatusToCollectionIfMissing([], productStatus, productStatus2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productStatus);
        expect(expectedResult).toContain(productStatus2);
      });

      it('should accept null and undefined values', () => {
        const productStatus: IProductStatus = sampleWithRequiredData;
        expectedResult = service.addProductStatusToCollectionIfMissing([], null, productStatus, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productStatus);
      });

      it('should return initial array if no ProductStatus is added', () => {
        const productStatusCollection: IProductStatus[] = [sampleWithRequiredData];
        expectedResult = service.addProductStatusToCollectionIfMissing(productStatusCollection, undefined, null);
        expect(expectedResult).toEqual(productStatusCollection);
      });
    });

    describe('compareProductStatus', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProductStatus(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProductStatus(entity1, entity2);
        const compareResult2 = service.compareProductStatus(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProductStatus(entity1, entity2);
        const compareResult2 = service.compareProductStatus(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProductStatus(entity1, entity2);
        const compareResult2 = service.compareProductStatus(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
