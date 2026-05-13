import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsIn, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

/**
 * TransactionQueryDto validates filters and pagination for transaction listing.
 */
export class TransactionQueryDto {
	@ApiPropertyOptional({ example: 1, minimum: 1, default: 1 })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page: number = 1;

	@ApiPropertyOptional({ example: 20, minimum: 1, maximum: 100, default: 20 })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	limit: number = 20;

	@ApiPropertyOptional({ enum: ['createdAt', 'userId', 'productId'], default: 'createdAt' })
	@IsOptional()
	@IsIn(['createdAt', 'userId', 'productId'])
	sortBy: 'createdAt' | 'userId' | 'productId' = 'createdAt';

	@ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' })
	@IsOptional()
	@IsIn(['ASC', 'DESC'])
	sortOrder: 'ASC' | 'DESC' = 'DESC';

	@ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440001', format: 'uuid' })
	@IsOptional()
	@IsUUID()
	userId?: string;

	@ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000', format: 'uuid' })
	@IsOptional()
	@IsUUID()
	productId?: string;

	@ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z', format: 'date-time' })
	@IsOptional()
	@Type(() => Date)
	@IsDate()
	fromDate?: Date;

	@ApiPropertyOptional({ example: '2024-12-31T23:59:59.999Z', format: 'date-time' })
	@IsOptional()
	@Type(() => Date)
	@IsDate()
	toDate?: Date;

	@ApiPropertyOptional({ example: true, description: 'Filter to stock-change transactions only' })
	@IsOptional()
	@Transform(({ value }: TransformFnParams) => value === true || value === 'true')
	@IsBoolean()
	stockOnly?: boolean;

	@ApiPropertyOptional({ example: false, description: 'Filter to price-change transactions only' })
	@IsOptional()
	@Transform(({ value }: TransformFnParams) => value === true || value === 'true')
	@IsBoolean()
	priceOnly?: boolean;
}
