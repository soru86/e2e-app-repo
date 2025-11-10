export interface IProductStatus {
  id: number;
  code?: string | null;
  label?: string | null;
  description?: string | null;
  isDefault?: boolean | null;
  isActive?: boolean | null;
}

export type NewProductStatus = Omit<IProductStatus, 'id'> & { id: null; code: string; label: string; isDefault: boolean; isActive: boolean };
