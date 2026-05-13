import { ProductEntity } from '../../domain/entities/product.entity';

/**
 * ProductResponseDto defines the API response shape for products.
 */
export class ProductResponseDto {
	id!: string;
	name!: string;
	price!: number;
	stock!: number;
	createdAt!: Date;
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
