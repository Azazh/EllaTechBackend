import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { decimalTransformer } from '../../shared/utils/decimal.transformer';
import { TransactionEntity } from './transaction.entity';

@Entity({ name: 'products' })
export class ProductEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'varchar', length: 200 })
	name!: string;

	@Column({
		type: 'numeric',
		precision: 10,
		scale: 2,
		default: 0,
		transformer: decimalTransformer,
	})
	price!: number;

	@Column({ type: 'int', default: 0 })
	stock!: number;

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt!: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt!: Date;

	@OneToMany(() => TransactionEntity, (transaction: TransactionEntity) => transaction.product)
	transactions!: TransactionEntity[];
}
