import { ConflictException, Injectable } from '@nestjs/common';

import { CreateUserDto } from '../dtos/create-user.dto';
import { UserRepositoryPort } from '../ports/user.repository.port';
import { UserEntity } from '../../domain/entities/user.entity';

/**
 * CreateUserUseCase creates a new user after uniqueness checks.
 */
@Injectable()
export class CreateUserUseCase {
	constructor(private readonly userRepository: UserRepositoryPort) {}

	/**
	 * execute creates a user if email does not already exist.
	 */
	async execute(input: CreateUserDto): Promise<UserEntity> {
		const normalizedEmail = input.email.trim().toLowerCase();
		const existing = await this.userRepository.findByEmail(normalizedEmail);

		if (existing) {
			throw new ConflictException('Email already exists');
		}

		return this.userRepository.create({
			name: input.name.trim(),
			email: normalizedEmail,
		});
	}
}
