import { ICategory } from 'app/entities/category/category.model';
import { ProductStatus } from 'app/entities/enumerations/product-status.model';

export interface IProduct {
  id: number;
  name?: string | null;
  sku?: string | null;
  price?: number | null;
  quantity?: number | null;
  status?: keyof typeof ProductStatus | null;
  category?: ICategory | null;
}

export type NewProduct = Omit<IProduct, 'id'> & { id: null };
