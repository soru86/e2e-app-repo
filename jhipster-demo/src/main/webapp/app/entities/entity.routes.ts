import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'inventoryApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'product-status',
    data: { pageTitle: 'inventoryApp.productStatus.home.title' },
    loadChildren: () => import('./product-status/product-status.routes'),
  },
  {
    path: 'category',
    data: { pageTitle: 'inventoryApp.category.home.title' },
    loadChildren: () => import('./category/category.routes'),
  },
  {
    path: 'product',
    data: { pageTitle: 'inventoryApp.product.home.title' },
    loadChildren: () => import('./product/product.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
