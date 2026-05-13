import { Module } from '@nestjs/common';

import { ApplicationModule } from '../application/application.module';
import { HealthController } from './controllers/health.controller';
import { ProductsController } from './controllers/products.controller';
import { TransactionsController } from './controllers/transactions.controller';
import { UsersController } from './controllers/users.controller';

/**
 * PresentationModule wires HTTP controllers.
 */
@Module({
	imports: [ApplicationModule],
	controllers: [HealthController, UsersController, ProductsController, TransactionsController],
})
export class PresentationModule {}