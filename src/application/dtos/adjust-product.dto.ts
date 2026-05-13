import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

/**
 * AdjustProductDto validates payload for stock and price adjustment.
 */
export class AdjustProductDto {
	@ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', format: 'uuid' })
	@IsUUID()
	productId!: string;

	@ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001', format: 'uuid' })
	@IsUUID()
	userId!: string;

	@ApiPropertyOptional({ example: 50, description: 'New stock level (mutually exclusive with newPrice)', minimum: 0 })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	newStock?: number;

	@ApiPropertyOptional({ example: 12.99, description: 'New unit price (mutually exclusive with newStock)', minimum: 0 })
	@IsOptional()
	@Type(() => Number)
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	newPrice?: number;
}
