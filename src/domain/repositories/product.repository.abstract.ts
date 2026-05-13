import { EntityManager } from 'typeorm';

import { ProductEntity } from '../entities/product.entity';

/**
 * ProductRepositoryAbstract defines product data access operations.
 */
export abstract class ProductRepositoryAbstract {
	abstract create(data: Pick<ProductEntity, 'name' | 'price' | 'stock'>, manager?: EntityManager): Promise<ProductEntity>;

	abstract findById(id: string, manager?: EntityManager): Promise<ProductEntity | null>;

	abstract findByIdForUpdate(id: string, manager: EntityManager): Promise<ProductEntity | null>;

	abstract save(product: ProductEntity, manager?: EntityManager): Promise<ProductEntity>;
}
