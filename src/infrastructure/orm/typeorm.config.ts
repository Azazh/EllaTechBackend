import { DataSource, DataSourceOptions } from 'typeorm';

import { ProductEntity } from '../../domain/entities/product.entity';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { UserEntity } from '../../domain/entities/user.entity';
import { getAppConfig } from '../config/app.config';

/**
 * buildTypeOrmOptions builds database options for Nest and CLI usage.
 */
export function buildTypeOrmOptions(): DataSourceOptions {
	const config = getAppConfig();

	return {
		type: 'postgres',
		host: config.dbHost,
		port: config.dbPort,
		username: config.dbUser,
		password: config.dbPassword,
		database: config.dbName,
		entities: [UserEntity, ProductEntity, TransactionEntity],
		migrations: [],
		synchronize: false,
		logging: false,
	};
}

/**
 * AppDataSource is used by TypeORM migration commands.
 */
export const AppDataSource = new DataSource({
	...buildTypeOrmOptions(),
	migrations: ['src/infrastructure/orm/migrations/*.ts'],
});
