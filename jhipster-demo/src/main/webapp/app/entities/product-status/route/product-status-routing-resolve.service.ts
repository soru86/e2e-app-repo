import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProductStatus } from '../product-status.model';
import { ProductStatusService } from '../service/product-status.service';

const productStatusResolve = (route: ActivatedRouteSnapshot): Observable<null | IProductStatus> => {
  const id = route.params['id'];
  if (id) {
    return inject(ProductStatusService)
      .find(id)
      .pipe(
        mergeMap((productStatus: HttpResponse<IProductStatus>) => {
          if (productStatus.body) {
            return of(productStatus.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default productStatusResolve;
