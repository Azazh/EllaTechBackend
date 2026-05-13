import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepositoryAbstract } from '../../domain/repositories/user.repository.abstract';

/**
 * UserRepositoryImpl provides TypeORM-backed user operations.
 */
@Injectable()
export class UserRepositoryImpl extends UserRepositoryAbstract {
	constructor(@InjectRepository(UserEntity) private readonly defaultRepository: Repository<UserEntity>) {
		super();
	}

	/**
	 * repository resolves the active repository for optional transactions.
	 */
	private repository(manager?: EntityManager): Repository<UserEntity> {
		return manager ? manager.getRepository(UserEntity) : this.defaultRepository;
	}

	/**
	 * create inserts a new user record.
	 */
	async create(data: Pick<UserEntity, 'name' | 'email'>, manager?: EntityManager): Promise<UserEntity> {
		const repository = this.repository(manager);
		const entity = repository.create(data);
		return repository.save(entity);
	}

	/**
	 * findById returns a single user by id.
	 */
	findById(id: string, manager?: EntityManager): Promise<UserEntity | null> {
		return this.repository(manager).findOne({ where: { id } });
	}

	/**
	 * findByEmail returns a user by unique email.
	 */
	findByEmail(email: string, manager?: EntityManager): Promise<UserEntity | null> {
		return this.repository(manager).findOne({ where: { email } });
	}

	/**
	 * save persists user updates.
	 */
	save(user: UserEntity, manager?: EntityManager): Promise<UserEntity> {
		return this.repository(manager).save(user);
	}
}
