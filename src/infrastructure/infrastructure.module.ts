import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductEntity } from '../domain/entities/product.entity';
import { TransactionEntity } from '../domain/entities/transaction.entity';
import { UserEntity } from '../domain/entities/user.entity';
import { ProductRepositoryAbstract } from '../domain/repositories/product.repository.abstract';
import { TransactionRepositoryAbstract } from '../domain/repositories/transaction.repository.abstract';
import { UserRepositoryAbstract } from '../domain/repositories/user.repository.abstract';
import { buildTypeOrmOptions } from './orm/typeorm.config';
import { ProductRepositoryImpl } from './repositories/product.repository.impl';
import { TransactionRepositoryImpl } from './repositories/transaction.repository.impl';
import { UserRepositoryImpl } from './repositories/user.repository.impl';

/**
 * InfrastructureModule binds ORM and repository implementations.
 */
@Module({
	imports: [
		TypeOrmModule.forRoot(buildTypeOrmOptions()),
		TypeOrmModule.forFeature([UserEntity, ProductEntity, TransactionEntity]),
	],
	providers: [
		UserRepositoryImpl,
		ProductRepositoryImpl,
		TransactionRepositoryImpl,
		{ provide: UserRepositoryAbstract, useExisting: UserRepositoryImpl },
		{ provide: ProductRepositoryAbstract, useExisting: ProductRepositoryImpl },
		{ provide: TransactionRepositoryAbstract, useExisting: TransactionRepositoryImpl },
	],
	exports: [
		TypeOrmModule,
		UserRepositoryAbstract,
		ProductRepositoryAbstract,
		TransactionRepositoryAbstract,
	],
})
export class InfrastructureModule {}