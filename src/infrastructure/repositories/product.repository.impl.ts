import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { ProductEntity } from '../../domain/entities/product.entity';
import { ProductRepositoryAbstract } from '../../domain/repositories/product.repository.abstract';

/**
 * ProductRepositoryImpl provides TypeORM-backed product operations.
 */
@Injectable()
export class ProductRepositoryImpl extends ProductRepositoryAbstract {
	constructor(@InjectRepository(ProductEntity) private readonly defaultRepository: Repository<ProductEntity>) {
		super();
	}

	/**
	 * repository resolves the active repository for optional transactions.
	 */
	private repository(manager?: EntityManager): Repository<ProductEntity> {
		return manager ? manager.getRepository(ProductEntity) : this.defaultRepository;
	}

	/**
	 * create inserts a new product record.
	 */
	async create(data: Pick<ProductEntity, 'name' | 'price' | 'stock'>, manager?: EntityManager): Promise<ProductEntity> {
		const repository = this.repository(manager);
		const entity = repository.create(data);
		return repository.save(entity);
	}

	/**
	 * findById returns a single product by id.
	 */
	findById(id: string, manager?: EntityManager): Promise<ProductEntity | null> {
		return this.repository(manager).findOne({ where: { id } });
	}

	/**
	 * findByIdForUpdate returns a locked product row for atomic updates.
	 */
	findByIdForUpdate(id: string, manager: EntityManager): Promise<ProductEntity | null> {
		return manager.getRepository(ProductEntity).findOne({
			where: { id },
			lock: { mode: 'pessimistic_write' },
		});
	}

	/**
	 * save persists product updates.
	 */
	save(product: ProductEntity, manager?: EntityManager): Promise<ProductEntity> {
		return this.repository(manager).save(product);
	}
}
