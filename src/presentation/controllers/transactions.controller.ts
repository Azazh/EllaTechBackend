import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { TransactionQueryDto } from '../../application/dtos/transaction-query.dto';
import { ListTransactionsUseCase } from '../../application/use-cases/list-transactions.use-case';
import { TransactionListResponseDto } from '../dtos/transaction-list-response.dto';
import { TransactionResponseDto } from '../dtos/transaction-response.dto';

/**
 * TransactionsController exposes transaction listing endpoints.
 */
@ApiTags('Transactions')
@Controller()
export class TransactionsController {
	constructor(private readonly listTransactionsUseCase: ListTransactionsUseCase) {}

	/**
	 * listTransactions handles GET /transactions.
	 */
	@Get('transactions')
	@ApiOperation({ summary: 'List transactions with optional filters and pagination' })
	@ApiResponse({ status: 200, description: 'Paginated list of transactions', type: TransactionListResponseDto })
	@ApiResponse({ status: 400, description: 'Validation error' })
	async listTransactions(@Query() query: TransactionQueryDto): Promise<TransactionListResponseDto> {
		const result = await this.listTransactionsUseCase.execute(query);

		return {
			data: result.data.map((transaction) => TransactionResponseDto.fromEntity(transaction)),
			meta: result.meta,
		};
	}
}
