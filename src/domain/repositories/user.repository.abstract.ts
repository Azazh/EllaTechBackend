import { EntityManager } from 'typeorm';

import { UserEntity } from '../entities/user.entity';

/**
 * UserRepositoryAbstract defines user data access operations.
 */
export abstract class UserRepositoryAbstract {
	abstract create(data: Pick<UserEntity, 'name' | 'email'>, manager?: EntityManager): Promise<UserEntity>;

	abstract findById(id: string, manager?: EntityManager): Promise<UserEntity | null>;

	abstract findByEmail(email: string, manager?: EntityManager): Promise<UserEntity | null>;

	abstract save(user: UserEntity, manager?: EntityManager): Promise<UserEntity>;
}
