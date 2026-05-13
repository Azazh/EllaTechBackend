import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { DomainException } from './domain.exception';

/**
 * HttpExceptionFilter formats all thrown exceptions into consistent responses.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	/**
	 * catch transforms thrown exceptions to API-friendly error payloads.
	 */
	catch(exception: unknown, host: ArgumentsHost): void {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		if (exception instanceof DomainException) {
			response.status(exception.statusCode).json({
				statusCode: exception.statusCode,
				message: exception.message,
				details: exception.details,
			});
			return;
		}

		if (exception instanceof HttpException) {
			const statusCode = exception.getStatus();
			response.status(statusCode).json({
				statusCode,
				message: exception.message,
			});
			return;
		}

		response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: 'Internal server error',
		});
	}
}
