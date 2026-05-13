import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

/**
 * AdjustProductDto validates payload for stock and price adjustment.
 */
export class AdjustProductDto {
	@IsUUID()
	productId!: string;

	@IsUUID()
	userId!: string;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	newStock?: number;

	@IsOptional()
	@Type(() => Number)
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	newPrice?: number;
}
