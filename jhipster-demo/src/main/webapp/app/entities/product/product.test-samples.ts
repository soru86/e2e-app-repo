import { IProduct, NewProduct } from './product.model';

export const sampleWithRequiredData: IProduct = {
  id: 32040,
  name: 'energetically beloved',
  sku: '6R85ZI',
  price: 10071.38,
  quantity: 17236,
  status: 'DISCONTINUED',
};

export const sampleWithPartialData: IProduct = {
  id: 27010,
  name: 'blah stall',
  sku: 'JW_M',
  price: 121.3,
  quantity: 24053,
  status: 'AVAILABLE',
};

export const sampleWithFullData: IProduct = {
  id: 23436,
  name: 'discourage innocently yet',
  sku: 'UGZFIJHIVG7U7YJUQ3',
  price: 30215.19,
  quantity: 31959,
  status: 'AVAILABLE',
};

export const sampleWithNewData: NewProduct = {
  name: 'after supposing',
  sku: 'N0SKN7LLVHVH-5RLP',
  price: 23204.81,
  quantity: 21458,
  status: 'OUT_OF_STOCK',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
