import { ValidationPipe } from '@nestjs/common';

/**
 * AppValidationPipe centralizes API payload validation rules.
 */
export class AppValidationPipe extends ValidationPipe {
	constructor() {
		super({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		});
	}
}
