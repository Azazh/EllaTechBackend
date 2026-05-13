import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { UserResponseDto } from '../dtos/user-response.dto';

/**
 * UsersController exposes user related endpoints.
 */
@Controller()
export class UsersController {
	constructor(private readonly createUserUseCase: CreateUserUseCase) {}

	/**
	 * createUser handles POST /users.
	 */
	@Post('users')
	@HttpCode(HttpStatus.CREATED)
	async createUser(@Body() body: CreateUserDto): Promise<UserResponseDto> {
		const user = await this.createUserUseCase.execute(body);
		return UserResponseDto.fromEntity(user);
	}
}
