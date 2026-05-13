import { ApiProperty } from '@nestjs/swagger';
import { HealthStatusResult } from '../../application/use-cases/get-health-status.use-case';

/**
 * HealthResponseDto defines the API response shape for health checks.
 */
export class HealthResponseDto {
  @ApiProperty({ example: 'ok', enum: ['ok'] })
  status!: 'ok';

  @ApiProperty({ example: 42.5, description: 'Process uptime in seconds' })
  uptime!: number;

  @ApiProperty({ example: 'connected', enum: ['connected'] })
  db!: 'connected';

  @ApiProperty({ example: 'up_to_date', enum: ['up_to_date', 'pending'] })
  migrations!: 'up_to_date' | 'pending';

  /**
   * fromResult maps a health use-case result into response dto.
   */
  static fromResult(result: HealthStatusResult): HealthResponseDto {
    return {
      status: result.status,
      uptime: result.uptime,
      db: result.db,
      migrations: result.migrations,
    };
  }
}