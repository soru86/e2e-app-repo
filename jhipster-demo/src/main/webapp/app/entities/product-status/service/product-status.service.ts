import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProductStatus, NewProductStatus } from '../product-status.model';

export type EntityResponseType = HttpResponse<IProductStatus>;
export type EntityArrayResponseType = HttpResponse<IProductStatus[]>;

@Injectable({ providedIn: 'root' })
export class ProductStatusService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/product-statuses');

  create(productStatus: NewProductStatus): Observable<EntityResponseType> {
    return this.http.post<IProductStatus>(this.resourceUrl, productStatus, { observe: 'response' });
  }

  update(productStatus: IProductStatus): Observable<EntityResponseType> {
    return this.http.put<IProductStatus>(`${this.resourceUrl}/${this.getProductStatusIdentifier(productStatus)}`, productStatus, {
      observe: 'response',
    });
  }

  partialUpdate(productStatus: Partial<IProductStatus> & Pick<IProductStatus, 'id'>): Observable<EntityResponseType> {
    return this.http.patch<IProductStatus>(
      `${this.resourceUrl}/${this.getProductStatusIdentifier(productStatus)}`,
      productStatus,
      {
        observe: 'response',
      },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProductStatus>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProductStatus[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProductStatusIdentifier(productStatus: Pick<IProductStatus, 'id'>): number {
    return productStatus.id;
  }

  compareProductStatus(o1: Pick<IProductStatus, 'id'> | null, o2: Pick<IProductStatus, 'id'> | null): boolean {
    return o1 && o2 ? this.getProductStatusIdentifier(o1) === this.getProductStatusIdentifier(o2) : o1 === o2;
  }

  addProductStatusToCollectionIfMissing<Type extends Pick<IProductStatus, 'id'>>(
    productStatusCollection: Type[],
    ...productStatusesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const productStatuses: Type[] = productStatusesToCheck.filter(isPresent);
    if (productStatuses.length > 0) {
      const productStatusCollectionIdentifiers = productStatusCollection.map(productStatusItem =>
        this.getProductStatusIdentifier(productStatusItem),
      );
      const productStatusesToAdd = productStatuses.filter(productStatusItem => {
        const productStatusIdentifier = this.getProductStatusIdentifier(productStatusItem);
        if (productStatusCollectionIdentifiers.includes(productStatusIdentifier)) {
          return false;
        }
        productStatusCollectionIdentifiers.push(productStatusIdentifier);
        return true;
      });
      return [...productStatusesToAdd, ...productStatusCollection];
    }
    return productStatusCollection;
  }
}
