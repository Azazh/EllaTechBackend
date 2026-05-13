import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';

export interface HealthStatusResult {
  status: 'ok';
  uptime: number;
  db: 'connected';
  migrations: 'up_to_date' | 'pending';
}

/**
 * GetHealthStatusUseCase checks service and dependency readiness.
 */
@Injectable()
export class GetHealthStatusUseCase {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * execute validates DB connectivity and migration state.
   */
  async execute(): Promise<HealthStatusResult> {
    try {
      await this.dataSource.query('SELECT 1');

      const [result] = await this.dataSource.query(
        `SELECT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'migrations'
        ) AS "exists"`,
      );

      if (!result?.exists) {
        throw new Error('migrations table does not exist');
      }

      const hasPendingMigrations = await this.dataSource.showMigrations();

      return {
        status: 'ok',
        uptime: process.uptime(),
        db: 'connected',
        migrations: hasPendingMigrations ? 'pending' : 'up_to_date',
      };
    } catch (error) {
      throw new ServiceUnavailableException({
        status: 'error',
        db: 'disconnected',
        message: error instanceof Error ? error.message : 'Health check failed',
      });
    }
  }
}