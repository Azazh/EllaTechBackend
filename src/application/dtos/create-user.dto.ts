import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * CreateUserDto validates payload for creating a user.
 */
export class CreateUserDto {
	@ApiProperty({ example: 'Jane Doe', maxLength: 100 })
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	name!: string;

	@ApiProperty({ example: 'jane@example.com', maxLength: 255 })
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	@MaxLength(255)
	email!: string;
}
