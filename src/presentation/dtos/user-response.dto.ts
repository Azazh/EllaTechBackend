import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../domain/entities/user.entity';

/**
 * UserResponseDto defines the API response shape for users.
 */
export class UserResponseDto {
	@ApiProperty({ format: 'uuid' })
	id!: string;

	@ApiProperty({ example: 'Jane Doe' })
	name!: string;

	@ApiProperty({ example: 'jane@example.com' })
	email!: string;

	@ApiProperty({ format: 'date-time' })
	createdAt!: Date;

	@ApiProperty({ format: 'date-time' })
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
