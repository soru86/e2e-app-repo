import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 10307,
  login: 'mC.@cBUtuS\\+XZ\\(G4JYcL\\=jr\\,nTd07\\BLQfxCS',
};

export const sampleWithPartialData: IUser = {
  id: 989,
  login: 'EV-I1R',
};

export const sampleWithFullData: IUser = {
  id: 15823,
  login: 'Y@AvI\\pV',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
