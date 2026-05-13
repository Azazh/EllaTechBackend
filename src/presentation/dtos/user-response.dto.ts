import { UserEntity } from '../../domain/entities/user.entity';

/**
 * UserResponseDto defines the API response shape for users.
 */
export class UserResponseDto {
	id!: string;
	name!: string;
	email!: string;
	createdAt!: Date;
	updatedAt!: Date;

	/**
	 * fromEntity maps a user entity to response dto.
	 */
	static fromEntity(entity: UserEntity): UserResponseDto {
		return {
			id: entity.id,
			name: entity.name,
			email: entity.email,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}
}
