import { EntityManager } from 'typeorm';

import { TransactionEntity } from '../entities/transaction.entity';

export interface TransactionListOptions {
	page: number;
	limit: number;
	sortBy: 'createdAt' | 'userId' | 'productId';
	sortOrder: 'ASC' | 'DESC';
	userId?: string;
	productId?: string;
	fromDate?: Date;
	toDate?: Date;
	stockOnly?: boolean;
	priceOnly?: boolean;
}

export interface CreateTransactionInput {
	userId: string;
	productId: string;
	oldStock: number | null;
	newStock: number | null;
	oldPrice: number | null;
	newPrice: number | null;
}

/**
 * TransactionRepositoryAbstract defines transaction history operations.
 */
export abstract class TransactionRepositoryAbstract {
	abstract create(data: CreateTransactionInput, manager?: EntityManager): Promise<TransactionEntity>;

	abstract findById(id: string, manager?: EntityManager): Promise<TransactionEntity | null>;

	abstract findManyAndCount(options: TransactionListOptions, manager?: EntityManager): Promise<[TransactionEntity[], number]>;
}
