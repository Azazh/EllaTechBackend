import { Check, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { decimalTransformer } from '../../shared/utils/decimal.transformer';
import { ProductEntity } from './product.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'transactions' })
@Check(
	'CHK_transactions_change_values',
	'("oldStock" IS NOT NULL AND "newStock" IS NOT NULL) OR ("oldPrice" IS NOT NULL AND "newPrice" IS NOT NULL)',
)
@Index('IDX_transactions_user_id', ['userId'])
@Index('IDX_transactions_product_id', ['productId'])
@Index('IDX_transactions_created_at', ['createdAt'])
@Index('IDX_transactions_product_created_at', ['productId', 'createdAt'])
export class TransactionEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'uuid' })
	userId!: string;

	@Column({ type: 'uuid' })
	productId!: string;

	@Column({ type: 'int', nullable: true })
	oldStock!: number | null;

	@Column({ type: 'int', nullable: true })
	newStock!: number | null;

	@Column({
		type: 'numeric',
		precision: 10,
		scale: 2,
		nullable: true,
		transformer: decimalTransformer,
	})
	oldPrice!: number | null;

	@Column({
		type: 'numeric',
		precision: 10,
		scale: 2,
		nullable: true,
		transformer: decimalTransformer,
	})
	newPrice!: number | null;

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt!: Date;

	@ManyToOne(() => UserEntity, (user: UserEntity) => user.transactions, { onDelete: 'RESTRICT' })
	@JoinColumn({ name: 'userId' })
	user!: UserEntity;

	@ManyToOne(() => ProductEntity, (product: ProductEntity) => product.transactions, { onDelete: 'RESTRICT' })
	@JoinColumn({ name: 'productId' })
	product!: ProductEntity;
}
