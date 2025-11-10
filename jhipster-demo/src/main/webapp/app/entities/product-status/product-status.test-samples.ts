import { IProductStatus, NewProductStatus } from './product-status.model';

export const sampleWithRequiredData: IProductStatus = {
  id: 26170,
  code: 'AVAILABLE',
  label: 'Available',
  isDefault: true,
  isActive: true,
};

export const sampleWithPartialData: IProductStatus = {
  id: 6024,
  code: 'OUT_OF_STOCK',
  label: 'Out of Stock',
  description: 'Temporarily unavailable',
  isDefault: false,
  isActive: true,
};

export const sampleWithFullData: IProductStatus = {
  id: 13597,
  code: 'AWAITING_QA',
  label: 'Awaiting QA',
  description: 'Waiting for quality inspection',
  isDefault: false,
  isActive: false,
};

export const sampleWithNewData: NewProductStatus = {
  id: null,
  code: 'NEW_STATUS',
  label: 'New status',
  description: 'Newly defined status',
  isDefault: false,
  isActive: true,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
