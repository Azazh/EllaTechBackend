/**
 * AppConfig contains environment driven runtime settings.
 */
export interface AppConfig {
	port: number;
	dbHost: string;
	dbPort: number;
	dbUser: string;
	dbPassword: string;
	dbName: string;
}

/**
 * getAppConfig resolves app configuration from process environment.
 */
export function getAppConfig(): AppConfig {
	return {
		port: Number(process.env.PORT ?? 3000),
		dbHost: process.env.DB_HOST ?? 'localhost',
		dbPort: Number(process.env.DB_PORT ?? 5432),
		dbUser: process.env.DB_USER ?? 'postgres',
		dbPassword: process.env.DB_PASSWORD ?? 'postgres',
		dbName: process.env.DB_NAME ?? 'ellatech',
	};
}
