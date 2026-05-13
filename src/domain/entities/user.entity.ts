import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { TransactionEntity } from './transaction.entity';

@Entity({ name: 'users' })
@Index('IDX_users_email', ['email'], { unique: true })
export class UserEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'varchar', length: 100 })
	name!: string;

	@Column({ type: 'varchar', length: 255, unique: true })
	email!: string;

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt!: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt!: Date;

	@OneToMany(() => TransactionEntity, (transaction: TransactionEntity) => transaction.user)
	transactions!: TransactionEntity[];
}
