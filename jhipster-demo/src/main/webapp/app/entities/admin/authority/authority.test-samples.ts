import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '2b16db06-b6e7-4f30-bd79-abdc1b91ed85',
};

export const sampleWithPartialData: IAuthority = {
  name: 'b0930308-7bf9-4594-8cd8-92fd5100c4ae',
};

export const sampleWithFullData: IAuthority = {
  name: 'fde6ab7b-4070-4370-b917-493fb9aa2b15',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
