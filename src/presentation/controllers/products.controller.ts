import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';

import { AdjustProductDto } from '../../application/dtos/adjust-product.dto';
import { CreateProductDto } from '../../application/dtos/create-product.dto';
import { AdjustProductUseCase } from '../../application/use-cases/adjust-product.use-case';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { GetProductStatusUseCase } from '../../application/use-cases/get-product-status.use-case';
import { ProductResponseDto } from '../dtos/product-response.dto';

/**
 * ProductsController exposes product creation and status endpoints.
 */
@Controller()
export class ProductsController {
	constructor(
		private readonly createProductUseCase: CreateProductUseCase,
		private readonly adjustProductUseCase: AdjustProductUseCase,
		private readonly getProductStatusUseCase: GetProductStatusUseCase,
	) {}

	/**
	 * createProduct handles POST /products.
	 */
	@Post('products')
	@HttpCode(HttpStatus.CREATED)
	async createProduct(@Body() body: CreateProductDto): Promise<ProductResponseDto> {
		const product = await this.createProductUseCase.execute(body);
		return ProductResponseDto.fromEntity(product);
	}

	/**
	 * adjustProduct handles PUT /products/adjust.
	 */
	@Put('products/adjust')
	async adjustProduct(@Body() body: AdjustProductDto): Promise<ProductResponseDto> {
		const product = await this.adjustProductUseCase.execute(body);
		return ProductResponseDto.fromEntity(product);
	}

	/**
	 * getStatus handles GET /status/:productId.
	 */
	@Get('status/:productId')
	async getStatus(@Param('productId', new ParseUUIDPipe()) productId: string): Promise<ProductResponseDto> {
		const product = await this.getProductStatusUseCase.execute(productId);
		return ProductResponseDto.fromEntity(product);
	}
}
