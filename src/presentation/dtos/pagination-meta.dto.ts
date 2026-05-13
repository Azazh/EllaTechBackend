import { ApiProperty } from '@nestjs/swagger';

/**
 * PaginationMetaDto describes pagination metadata in list responses.
 */
export class PaginationMetaDto {
	@ApiProperty({ example: 100, description: 'Total number of matching records' })
	total!: number;

	@ApiProperty({ example: 1 })
	page!: number;

	@ApiProperty({ example: 20 })
	limit!: number;

	@ApiProperty({ example: 5 })
	totalPages!: number;
}
