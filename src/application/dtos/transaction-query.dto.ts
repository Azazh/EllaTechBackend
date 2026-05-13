import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsIn, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

/**
 * TransactionQueryDto validates filters and pagination for transaction listing.
 */
export class TransactionQueryDto {
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page: number = 1;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	limit: number = 20;

	@IsOptional()
	@IsIn(['createdAt', 'userId', 'productId'])
	sortBy: 'createdAt' | 'userId' | 'productId' = 'createdAt';

	@IsOptional()
	@IsIn(['ASC', 'DESC'])
	sortOrder: 'ASC' | 'DESC' = 'DESC';

	@IsOptional()
	@IsUUID()
	userId?: string;

	@IsOptional()
	@IsUUID()
	productId?: string;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	fromDate?: Date;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	toDate?: Date;

	@IsOptional()
	@Transform(({ value }: TransformFnParams) => value === true || value === 'true')
	@IsBoolean()
	stockOnly?: boolean;

	@IsOptional()
	@Transform(({ value }: TransformFnParams) => value === true || value === 'true')
	@IsBoolean()
	priceOnly?: boolean;
}
