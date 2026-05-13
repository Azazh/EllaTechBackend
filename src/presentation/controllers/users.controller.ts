import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { UserResponseDto } from '../dtos/user-response.dto';

/**
 * UsersController exposes user related endpoints.
 */
@ApiTags('Users')
@Controller()
export class UsersController {
	constructor(private readonly createUserUseCase: CreateUserUseCase) {}

	/**
	 * createUser handles POST /users.
	 */
	@Post('users')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Register a new user' })
	@ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
	@ApiResponse({ status: 400, description: 'Validation error' })
	@ApiResponse({ status: 409, description: 'Email already in use' })
	async createUser(@Body() body: CreateUserDto): Promise<UserResponseDto> {
		const user = await this.createUserUseCase.execute(body);
		return UserResponseDto.fromEntity(user);
	}
}
