import { Module } from '@nestjs/common';

import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { AdjustProductUseCase } from './use-cases/adjust-product.use-case';
import { CreateProductUseCase } from './use-cases/create-product.use-case';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { GetProductStatusUseCase } from './use-cases/get-product-status.use-case';
import { ListTransactionsUseCase } from './use-cases/list-transactions.use-case';

/**
 * ApplicationModule wires use-cases and their dependencies.
 */
@Module({
	imports: [InfrastructureModule],
	providers: [
		CreateUserUseCase,
		CreateProductUseCase,
		AdjustProductUseCase,
		GetProductStatusUseCase,
		ListTransactionsUseCase,
	],
	exports: [
		CreateUserUseCase,
		CreateProductUseCase,
		AdjustProductUseCase,
		GetProductStatusUseCase,
		ListTransactionsUseCase,
	],
})
export class ApplicationModule {}