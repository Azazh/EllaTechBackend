import { Injectable } from '@nestjs/common';

import { ProductEntity } from '../../domain/entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductRepositoryPort } from '../ports/product.repository.port';

/**
 * CreateProductUseCase creates a new product with validated inputs.
 */
@Injectable()
export class CreateProductUseCase {
	constructor(private readonly productRepository: ProductRepositoryPort) {}

	/**
	 * execute persists a new product record.
	 */
	async execute(input: CreateProductDto): Promise<ProductEntity> {
		return this.productRepository.create({
			name: input.name.trim(),
			price: input.price,
			stock: input.stock,
		});
	}
}
