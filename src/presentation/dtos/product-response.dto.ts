import { ApiProperty } from '@nestjs/swagger';
import { ProductEntity } from '../../domain/entities/product.entity';

/**
 * ProductResponseDto defines the API response shape for products.
 */
export class ProductResponseDto {
	@ApiProperty({ format: 'uuid' })
	id!: string;

	@ApiProperty({ example: 'Widget Pro' })
	name!: string;

	@ApiProperty({ example: 9.99 })
	price!: number;

	@ApiProperty({ example: 100 })
	stock!: number;

	@ApiProperty({ format: 'date-time' })
	createdAt!: Date;

	@ApiProperty({ format: 'date-time' })
	updatedAt!: Date;

	/**
	 * fromEntity maps a product entity to response dto.
	 */
	static fromEntity(entity: ProductEntity): ProductResponseDto {
		return {
			id: entity.id,
			name: entity.name,
			price: entity.price,
			stock: entity.stock,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}
}
