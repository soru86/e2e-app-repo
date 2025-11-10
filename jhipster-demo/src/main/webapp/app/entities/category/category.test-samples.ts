import { ICategory, NewCategory } from './category.model';

export const sampleWithRequiredData: ICategory = {
  id: 27234,
  name: 'lest than',
};

export const sampleWithPartialData: ICategory = {
  id: 20188,
  name: 'fumble lest',
  description: 'subpoena why',
};

export const sampleWithFullData: ICategory = {
  id: 30290,
  name: 'qua exist',
  description: 'quaintly past',
};

export const sampleWithNewData: NewCategory = {
  name: 'tempo kindly',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
