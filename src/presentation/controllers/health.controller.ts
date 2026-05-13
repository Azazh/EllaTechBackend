import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetHealthStatusUseCase } from '../../application/use-cases/get-health-status.use-case';
import { HealthResponseDto } from '../dtos/health-response.dto';

/**
 * HealthController exposes service readiness endpoints.
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly getHealthStatusUseCase: GetHealthStatusUseCase) {}

  /**
   * getHealth returns current service and dependency status.
   */
  @Get()
  @ApiOperation({ summary: 'Service and dependency health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy', type: HealthResponseDto })
  @ApiResponse({ status: 503, description: 'Service or dependency unavailable' })
  async getHealth(): Promise<HealthResponseDto> {
    const result = await this.getHealthStatusUseCase.execute();
    return HealthResponseDto.fromResult(result);
  }
}