import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';

/**
 * CreateProductDto validates payload for creating a product.
 */
export class CreateProductDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(200)
	name!: string;

	@Type(() => Number)
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	price!: number;

	@Type(() => Number)
	@IsInt()
	@Min(0)
	stock!: number;
}
