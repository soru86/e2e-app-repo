import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { Authority } from 'app/config/authority.constants';
import { ProductStatusComponent } from './list/product-status.component';
import { ProductStatusDetailComponent } from './detail/product-status-detail.component';
import { ProductStatusUpdateComponent } from './update/product-status-update.component';
import ProductStatusResolve from './route/product-status-routing-resolve.service';

const productStatusRoute: Routes = [
  {
    path: '',
    component: ProductStatusComponent,
    data: {
      defaultSort: 'code,' + ASC,
      authorities: [Authority.USER, Authority.MANAGER, Authority.ADMIN],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductStatusDetailComponent,
    resolve: {
      productStatus: ProductStatusResolve,
    },
    data: {
      authorities: [Authority.USER, Authority.MANAGER, Authority.ADMIN],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductStatusUpdateComponent,
    resolve: {
      productStatus: ProductStatusResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductStatusUpdateComponent,
    resolve: {
      productStatus: ProductStatusResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
    },
    canActivate: [UserRouteAccessService],
  },
];

export default productStatusRoute;
