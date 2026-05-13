import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AdjustProductDto } from '../../application/dtos/adjust-product.dto';
import { CreateProductDto } from '../../application/dtos/create-product.dto';
import { AdjustProductUseCase } from '../../application/use-cases/adjust-product.use-case';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { GetProductStatusUseCase } from '../../application/use-cases/get-product-status.use-case';
import { ProductResponseDto } from '../dtos/product-response.dto';

/**
 * ProductsController exposes product creation and status endpoints.
 */
@ApiTags('Products')
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
	@Throttle({ write: { ttl: 60_000, limit: 10 } })
	@ApiOperation({ summary: 'Create a new product' })
	@ApiResponse({ status: 201, description: 'Product created successfully', type: ProductResponseDto })
	@ApiResponse({ status: 400, description: 'Validation error' })
	async createProduct(@Body() body: CreateProductDto): Promise<ProductResponseDto> {
		const product = await this.createProductUseCase.execute(body);
		return ProductResponseDto.fromEntity(product);
	}

	/**
	 * adjustProduct handles PUT /products/adjust.
	 */
	@Put('products/adjust')
	@Throttle({ write: { ttl: 60_000, limit: 10 } })
	@ApiOperation({ summary: 'Adjust product stock or price (exactly one field required)' })
	@ApiResponse({ status: 200, description: 'Product updated successfully', type: ProductResponseDto })
	@ApiResponse({ status: 400, description: 'Validation error or business rule violation' })
	@ApiResponse({ status: 404, description: 'Product not found' })
	async adjustProduct(@Body() body: AdjustProductDto): Promise<ProductResponseDto> {
		const product = await this.adjustProductUseCase.execute(body);
		return ProductResponseDto.fromEntity(product);
	}

	/**
	 * getStatus handles GET /status/:productId.
	 */
	@Get('status/:productId')
	@ApiOperation({ summary: 'Get current stock and price for a product' })
	@ApiParam({ name: 'productId', format: 'uuid' })
	@ApiResponse({ status: 200, description: 'Product status', type: ProductResponseDto })
	@ApiResponse({ status: 404, description: 'Product not found' })
	async getStatus(@Param('productId', new ParseUUIDPipe()) productId: string): Promise<ProductResponseDto> {
		const product = await this.getProductStatusUseCase.execute(productId);
		return ProductResponseDto.fromEntity(product);
	}
}
