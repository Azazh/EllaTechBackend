import { TransactionEntity } from '../../domain/entities/transaction.entity';

/**
 * TransactionResponseDto defines the API response shape for transactions.
 */
export class TransactionResponseDto {
	id!: string;
	user!: { id: string; name: string };
	product!: { id: string; name: string };
	oldStock!: number | null;
	newStock!: number | null;
	oldPrice!: number | null;
	newPrice!: number | null;
	createdAt!: Date;

	/**
	 * fromEntity maps a transaction entity to response dto.
	 */
	static fromEntity(entity: TransactionEntity): TransactionResponseDto {
		return {
			id: entity.id,
			user: {
				id: entity.user.id,
				name: entity.user.name,
			},
			product: {
				id: entity.product.id,
				name: entity.product.name,
			},
			oldStock: entity.oldStock,
			newStock: entity.newStock,
			oldPrice: entity.oldPrice,
			newPrice: entity.newPrice,
			createdAt: entity.createdAt,
		};
	}
}
