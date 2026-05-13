import { UserEntity } from '../entities/user.entity';

export abstract class UserRepositoryAbstract {
	abstract create(data: Pick<UserEntity, 'name' | 'email'>): Promise<UserEntity>;

	abstract findById(id: string): Promise<UserEntity | null>;

	abstract findByEmail(email: string): Promise<UserEntity | null>;

	abstract save(user: UserEntity): Promise<UserEntity>;
}
