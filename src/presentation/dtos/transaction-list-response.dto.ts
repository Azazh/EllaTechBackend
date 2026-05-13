import { ApiProperty } from '@nestjs/swagger';

import { PaginationMetaDto } from './pagination-meta.dto';
import { TransactionResponseDto } from './transaction-response.dto';

/**
 * TransactionListResponseDto wraps paginated transaction data with metadata.
 */
export class TransactionListResponseDto {
	@ApiProperty({ type: () => [TransactionResponseDto] })
	data!: TransactionResponseDto[];

	@ApiProperty({ type: () => PaginationMetaDto })
	meta!: PaginationMetaDto;
}
