import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * CreateUserDto validates payload for creating a user.
 */
export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	name!: string;

	@IsString()
	@IsNotEmpty()
	@IsEmail()
	@MaxLength(255)
	email!: string;
}
