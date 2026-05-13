import { Injectable, NotFoundException } from '@nestjs/common';

import { ProductEntity } from '../../domain/entities/product.entity';
import { ProductRepositoryPort } from '../ports/product.repository.port';

/**
 * GetProductStatusUseCase returns current stock and price for a product.
 */
@Injectable()
export class GetProductStatusUseCase {
	constructor(private readonly productRepository: ProductRepositoryPort) {}

	/**
	 * execute fetches the current product state by id.
	 */
	async execute(productId: string): Promise<ProductEntity> {
		const product = await this.productRepository.findById(productId);

		if (!product) {
			throw new NotFoundException('Product not found');
		}

		return product;
	}
}
