import { ProductEntity } from '../entities/product.entity';

export abstract class ProductRepositoryAbstract {
	abstract create(data: Pick<ProductEntity, 'name' | 'price' | 'stock'>): Promise<ProductEntity>;

	abstract findById(id: string): Promise<ProductEntity | null>;

	abstract findByIdForUpdate(id: string): Promise<ProductEntity | null>;

	abstract save(product: ProductEntity): Promise<ProductEntity>;
}
