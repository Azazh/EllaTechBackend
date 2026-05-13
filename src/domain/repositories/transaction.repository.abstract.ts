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

export abstract class TransactionRepositoryAbstract {
	abstract create(data: Omit<TransactionEntity, 'id' | 'createdAt' | 'user' | 'product'>): Promise<TransactionEntity>;

	abstract findById(id: string): Promise<TransactionEntity | null>;

	abstract findManyAndCount(options: TransactionListOptions): Promise<[TransactionEntity[], number]>;
}
