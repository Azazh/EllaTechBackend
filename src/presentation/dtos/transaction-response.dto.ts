import { ApiProperty } from '@nestjs/swagger';
import { TransactionEntity } from '../../domain/entities/transaction.entity';

export class TransactionUserRefDto {
	@ApiProperty({ format: 'uuid' })
	id!: string;

	@ApiProperty({ example: 'Jane Doe' })
	name!: string;
}

export class TransactionProductRefDto {
	@ApiProperty({ format: 'uuid' })
	id!: string;

	@ApiProperty({ example: 'Widget Pro' })
	name!: string;
}

/**
 * TransactionResponseDto defines the API response shape for transactions.
 */
export class TransactionResponseDto {
	@ApiProperty({ format: 'uuid' })
	id!: string;

	@ApiProperty({ type: () => TransactionUserRefDto })
	user!: TransactionUserRefDto;

	@ApiProperty({ type: () => TransactionProductRefDto })
	product!: TransactionProductRefDto;

	@ApiProperty({ example: 100, nullable: true })
	oldStock!: number | null;

	@ApiProperty({ example: 50, nullable: true })
	newStock!: number | null;

	@ApiProperty({ example: 9.99, nullable: true })
	oldPrice!: number | null;

	@ApiProperty({ example: 12.99, nullable: true })
	newPrice!: number | null;

	@ApiProperty({ format: 'date-time' })
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
