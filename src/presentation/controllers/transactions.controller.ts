import { Controller, Get, Query } from '@nestjs/common';

import { TransactionQueryDto } from '../../application/dtos/transaction-query.dto';
import { ListTransactionsUseCase } from '../../application/use-cases/list-transactions.use-case';
import { PaginationMeta } from '../../shared/utils/pagination.helper';
import { TransactionResponseDto } from '../dtos/transaction-response.dto';

interface TransactionsListResponse {
	data: TransactionResponseDto[];
	meta: PaginationMeta;
}

/**
 * TransactionsController exposes transaction listing endpoints.
 */
@Controller()
export class TransactionsController {
	constructor(private readonly listTransactionsUseCase: ListTransactionsUseCase) {}

	/**
	 * listTransactions handles GET /transactions.
	 */
	@Get('transactions')
	async listTransactions(@Query() query: TransactionQueryDto): Promise<TransactionsListResponse> {
		const result = await this.listTransactionsUseCase.execute(query);

		return {
			data: result.data.map((transaction) => TransactionResponseDto.fromEntity(transaction)),
			meta: result.meta,
		};
	}
}
