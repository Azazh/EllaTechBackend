/**
 * DomainException standardizes domain-level error shape.
 */
export class DomainException extends Error {
	constructor(
		public readonly message: string,
		public readonly statusCode: number = 400,
		public readonly details?: unknown,
	) {
		super(message);
		this.name = 'DomainException';
	}
}
