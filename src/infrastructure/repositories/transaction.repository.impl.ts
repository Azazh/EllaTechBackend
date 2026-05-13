import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import {
	CreateTransactionInput,
	TransactionListOptions,
	TransactionRepositoryAbstract,
} from '../../domain/repositories/transaction.repository.abstract';
import { TransactionEntity } from '../../domain/entities/transaction.entity';

/**
 * TransactionRepositoryImpl provides TypeORM-backed transaction history operations.
 */
@Injectable()
export class TransactionRepositoryImpl extends TransactionRepositoryAbstract {
	constructor(@InjectRepository(TransactionEntity) private readonly defaultRepository: Repository<TransactionEntity>) {
		super();
	}

	/**
	 * repository resolves the active repository for optional transactions.
	 */
	private repository(manager?: EntityManager): Repository<TransactionEntity> {
		return manager ? manager.getRepository(TransactionEntity) : this.defaultRepository;
	}

	/**
	 * create inserts a transaction history record.
	 */
	async create(data: CreateTransactionInput, manager?: EntityManager): Promise<TransactionEntity> {
		const repository = this.repository(manager);
		const entity = repository.create(data);
		return repository.save(entity);
	}

	/**
	 * findById returns a transaction by id.
	 */
	findById(id: string, manager?: EntityManager): Promise<TransactionEntity | null> {
		return this.repository(manager).findOne({
			where: { id },
			relations: {
				user: true,
				product: true,
			},
		});
	}

	/**
	 * findManyAndCount applies filtering, sorting, and pagination.
	 */
	async findManyAndCount(options: TransactionListOptions, manager?: EntityManager): Promise<[TransactionEntity[], number]> {
		const repository = this.repository(manager);
		const sortMap: Record<TransactionListOptions['sortBy'], string> = {
			createdAt: 'transaction.createdAt',
			userId: 'transaction.userId',
			productId: 'transaction.productId',
		};

		const query = repository
			.createQueryBuilder('transaction')
			.leftJoinAndSelect('transaction.user', 'user')
			.leftJoinAndSelect('transaction.product', 'product');

		if (options.userId) {
			query.andWhere('transaction.userId = :userId', { userId: options.userId });
		}

		if (options.productId) {
			query.andWhere('transaction.productId = :productId', { productId: options.productId });
		}

		if (options.fromDate) {
			query.andWhere('transaction.createdAt >= :fromDate', { fromDate: options.fromDate });
		}

		if (options.toDate) {
			query.andWhere('transaction.createdAt <= :toDate', { toDate: options.toDate });
		}

		if (options.stockOnly) {
			query.andWhere('(transaction.oldStock IS NOT NULL OR transaction.newStock IS NOT NULL)');
		}

		if (options.priceOnly) {
			query.andWhere('(transaction.oldPrice IS NOT NULL OR transaction.newPrice IS NOT NULL)');
		}

		query
			.orderBy(sortMap[options.sortBy], options.sortOrder)
			.skip((options.page - 1) * options.limit)
			.take(options.limit);

		return query.getManyAndCount();
	}
}
