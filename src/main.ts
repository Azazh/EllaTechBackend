import { RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AppValidationPipe } from './presentation/pipes/validation.pipe';
import { HttpExceptionFilter } from './shared/exceptions/http-exception.filter';

/**
 * bootstrap starts the NestJS HTTP application and mounts Swagger UI at /docs.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });
  app.useGlobalPipes(new AppValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  /* ── Swagger / OpenAPI ─────────────────────────────────────────────── */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('EllaTech API')
    .setDescription('Users, Products & Transaction History service')
    .setVersion('1.0')
    .addTag('health', 'Service health checks')
    .addTag('users', 'User management')
    .addTag('products', 'Product management and stock adjustment')
    .addTag('transactions', 'Transaction history')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
  /* ─────────────────────────────────────────────────────────────────── */

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`Application running on http://localhost:${port}/api`);
  console.log(`Swagger UI available at http://localhost:${port}/docs`);
}

void bootstrap();