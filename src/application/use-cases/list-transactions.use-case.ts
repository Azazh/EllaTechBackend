import { BadRequestException, Injectable } from '@nestjs/common';

import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { buildPaginationMeta, PaginationMeta } from '../../shared/utils/pagination.helper';
import { TransactionQueryDto } from '../dtos/transaction-query.dto';
import { TransactionRepositoryPort } from '../ports/transaction.repository.port';

export interface ListTransactionsResult {
	data: TransactionEntity[];
	meta: PaginationMeta;
}

/**
 * ListTransactionsUseCase returns filtered and paginated transactions.
 */
@Injectable()
export class ListTransactionsUseCase {
	constructor(private readonly transactionRepository: TransactionRepositoryPort) {}

	/**
	 * execute fetches transaction records based on query options.
	 */
	async execute(query: TransactionQueryDto): Promise<ListTransactionsResult> {
		if (query.fromDate && query.toDate && query.fromDate > query.toDate) {
			throw new BadRequestException('fromDate must be earlier than or equal to toDate');
		}

		const [data, total] = await this.transactionRepository.findManyAndCount({
			page: query.page,
			limit: query.limit,
			sortBy: query.sortBy,
			sortOrder: query.sortOrder,
			userId: query.userId,
			productId: query.productId,
			fromDate: query.fromDate,
			toDate: query.toDate,
			stockOnly: query.stockOnly,
			priceOnly: query.priceOnly,
		});

		return {
			data,
			meta: buildPaginationMeta(total, query.page, query.limit),
		};
	}
}
