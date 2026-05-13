import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';

/**
 * CreateProductDto validates payload for creating a product.
 */
export class CreateProductDto {
	@ApiProperty({ example: 'Widget Pro', maxLength: 200 })
	@IsString()
	@IsNotEmpty()
	@MaxLength(200)
	name!: string;

	@ApiProperty({ example: 9.99, description: 'Unit price (up to 2 decimal places)', minimum: 0 })
	@Type(() => Number)
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	price!: number;

	@ApiProperty({ example: 100, description: 'Initial stock quantity', minimum: 0 })
	@Type(() => Number)
	@IsInt()
	@Min(0)
	stock!: number;
}
