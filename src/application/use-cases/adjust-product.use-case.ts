import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { ProductEntity } from '../../domain/entities/product.entity';
import { AdjustProductDto } from '../dtos/adjust-product.dto';
import { ProductRepositoryPort } from '../ports/product.repository.port';
import { TransactionRepositoryPort } from '../ports/transaction.repository.port';
import { UserRepositoryPort } from '../ports/user.repository.port';

/**
 * AdjustProductUseCase applies stock and or price updates atomically.
 */
@Injectable()
export class AdjustProductUseCase {
	constructor(
		private readonly dataSource: DataSource,
		private readonly productRepository: ProductRepositoryPort,
		private readonly userRepository: UserRepositoryPort,
		private readonly transactionRepository: TransactionRepositoryPort,
	) {}

	/**
	 * execute applies adjustment and writes transaction history in one transaction.
	 */
	async execute(input: AdjustProductDto): Promise<ProductEntity> {
		if (input.newStock === undefined && input.newPrice === undefined) {
			throw new BadRequestException('At least one of newStock or newPrice must be provided');
		}

		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const user = await this.userRepository.findById(input.userId, queryRunner.manager);
			if (!user) {
				throw new NotFoundException('User not found');
			}

			const product = await this.productRepository.findByIdForUpdate(input.productId, queryRunner.manager);
			if (!product) {
				throw new NotFoundException('Product not found');
			}

			const hasStockChange = input.newStock !== undefined && input.newStock !== product.stock;
			const hasPriceChange = input.newPrice !== undefined && input.newPrice !== product.price;

			if (!hasStockChange && !hasPriceChange) {
				throw new BadRequestException('No effective change detected');
			}

			const oldStock = hasStockChange ? product.stock : null;
			const oldPrice = hasPriceChange ? product.price : null;

			if (hasStockChange) {
				product.stock = input.newStock as number;
			}

			if (hasPriceChange) {
				product.price = input.newPrice as number;
			}

			const updatedProduct = await this.productRepository.save(product, queryRunner.manager);

			await this.transactionRepository.create(
				{
					userId: user.id,
					productId: product.id,
					oldStock,
					newStock: hasStockChange ? updatedProduct.stock : null,
					oldPrice,
					newPrice: hasPriceChange ? updatedProduct.price : null,
				},
				queryRunner.manager,
			);

			await queryRunner.commitTransaction();
			return updatedProduct;
		} catch (error) {
			if (queryRunner.isTransactionActive) {
				await queryRunner.rollbackTransaction();
			}

			throw error;
		} finally {
			await queryRunner.release();
		}
	}
}
