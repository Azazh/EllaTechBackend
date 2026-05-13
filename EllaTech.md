## **Development Document: NestJS Users & Products Service with Transaction History**

### **1\. Overview**

This document defines the architecture, data model, API contracts, and implementation guidelines for a NestJS service managing users, products, and product adjustment transactions. The service uses PostgreSQL with TypeORM, runs via Docker Compose, and follows Clean Architecture principles.

Core Requirements

* `POST /users` – Create a user  
* `POST /products` – Create a product  
* `PUT /products/adjust` – Adjust stock and/or price of a product, record transaction  
* `GET /status/:productId` – Get current stock and price of a product  
* `GET /transactions` – List all transactions with filtering, sorting, pagination

Non‑functional

* Docker Compose for local development  
* TypeORM migrations  
* DTO validation (class-validator)  
* Proper HTTP status codes  
* Atomic operations (rollback on failure)  
* Clean Architecture separation of concerns

---

### **2\. Clean Architecture Layers**

`text`

`src/`  
`├── domain/               # Enterprise‑wide business rules`  
`│   ├── entities/         # TypeORM entities + domain models`  
`│   ├── repositories/     # Repository interfaces (abstract)`  
`│   └── value-objects/    # (optional)`  
`├── application/          # Use cases / application logic`  
`│   ├── use-cases/        # e.g., CreateUserUseCase, AdjustProductUseCase`  
`│   ├── dtos/             # Input DTOs (validation)`  
`│   └── ports/            # Interfaces for outgoing dependencies (e.g., ITransactionRepo)`  
`├── infrastructure/       # Frameworks, drivers, DB, ORM`  
`│   ├── orm/              # TypeORM entities implementation`  
`│   ├── repositories/     # Concrete repositories (TypeORM)`  
`│   ├── database/         # Migrations, data source config`  
`│   └── config/           # Env, TypeORM config`  
`├── presentation/         # HTTP layer (NestJS controllers)`  
`│   ├── controllers/      # Route handlers`  
`│   ├── dtos/             # Response DTOs / request DTOs (optional, can be shared)`  
`│   └── pipes/            # Validation pipes`

`└── shared/               # Common utilities, exceptions, helpers`

Dependency rule:

* Domain has no external dependencies.  
* Application depends on Domain (entities, repository interfaces).  
* Infrastructure implements Domain/Application interfaces.  
* Presentation depends on Application and DTOs.

---

### **3\. Domain Entities & Relationships**

#### 3.1 User

| Field | Type | Constraints | Description |
| :---- | :---- | :---- | :---- |
| `id` | UUID | Primary Key, `gen_random_uuid()` | Unique identifier |
| `name` | string | NOT NULL, max 100 chars | User’s full name |
| `email` | string | NOT NULL, UNIQUE, email format | User’s email address |
| `createdAt` | timestamptz | NOT NULL, default `now()` | Creation timestamp |
| `updatedAt` | timestamptz | NOT NULL, default `now()`, auto‑update | Last modification timestamp |

Relationships:

* One‑to‑many with `Transaction` (a user can perform many adjustments)

#### 3.2 Product

| Field | Type | Constraints | Description |
| :---- | :---- | :---- | :---- |
| `id` | UUID | Primary Key, `gen_random_uuid()` | Unique product identifier |
| `name` | string | NOT NULL, max 200 chars | Product name |
| `price` | decimal(10,2) | NOT NULL, default 0, min 0 | Current price per unit |
| `stock` | integer | NOT NULL, default 0, min 0 | Current quantity in stock |
| `createdAt` | timestamptz | NOT NULL, default `now()` | Creation timestamp |
| `updatedAt` | timestamptz | NOT NULL, default `now()`, auto‑update | Last modification timestamp |

Relationships:

* One‑to‑many with `Transaction` (a product can be involved in many adjustments)

#### 3.3 Transaction

Records each adjustment (stock and/or price change) with before/after values.

| Field | Type | Constraints | Description |
| :---- | :---- | :---- | :---- |
| `id` | UUID | Primary Key, `gen_random_uuid()` | Unique transaction identifier |
| `userId` | UUID | NOT NULL, FK → `User.id` ON DELETE RESTRICT | User who performed the adjustment |
| `productId` | UUID | NOT NULL, FK → `Product.id` ON DELETE RESTRICT | Product that was adjusted |
| `oldStock` | integer | NULLABLE | Stock before adjustment |
| `newStock` | integer | NULLABLE | Stock after adjustment |
| `oldPrice` | decimal(10,2) | NULLABLE | Price before adjustment |
| `newPrice` | decimal(10,2) | NULLABLE | Price after adjustment |
| `createdAt` | timestamptz | NOT NULL, default `now()` | Timestamp of adjustment |

Constraints:

* At least one of (`oldStock`/`newStock`) or (`oldPrice`/`newPrice`) must be non‑NULL.  
* If only stock changes → price fields are NULL.  
* If only price changes → stock fields are NULL.  
* If both change → all four fields are populated.

Foreign key actions: `ON DELETE RESTRICT` – prevent deletion of a user or product that has transactions (preserve history integrity).

Indexes:

* `userId` (for filtering by user)  
* `productId` (for product transaction history)  
* `createdAt` (for chronological order)  
* Composite index `(productId, createdAt)` for product‑specific timeline queries.

#### 3.4 Entity Relationship Diagram

`text`

`┌─────────────┐          ┌───────────────────┐          ┌─────────────┐`  
`│    User     │          │   Transaction     │          │  Product    │`  
`├─────────────┤          ├───────────────────┤          ├─────────────┤`  
`│ id (PK)     │─┐        │ id (PK)           │        ┌─│ id (PK)     │`  
`│ name        │ │        │ userId (FK)───────┘        │ │ name        │`  
`│ email       │ └───────>│ productId (FK)────────────┘ │ price       │`  
`│ createdAt   │          │ oldStock          │          │ stock       │`  
`│ updatedAt   │          │ newStock          │          │ createdAt   │`  
`└─────────────┘          │ oldPrice          │          │ updatedAt   │`  
                         `│ newPrice          │          └─────────────┘`  
                         `│ createdAt         │`

                         `└───────────────────┘`

---

### **4\. API Endpoints Specification**

All endpoints return `application/json`. Use DTO validation with `class-validator` (e.g., `IsUUID`, `IsEmail`, `Min`, `Max`, `IsOptional`).

#### 4.1 POST /users

Request Body

`json`

`{`  
  `"name": "John Doe",`  
  `"email": "john@example.com"`

`}`

Validation:

* `name`: string, required, max 100 chars  
* `email`: string, required, valid email format, unique

Responses

* `201 Created` – User created  
* `json`  
* `{ "id": "uuid", "name": "John Doe", "email": "john@example.com", "createdAt": "iso", "updatedAt": "iso" }`  
* `400 Bad Request` – Validation error (e.g., missing fields, invalid email)  
* `409 Conflict` – Email already exists

#### 4.2 POST /products

Request Body

`json`

`{`  
  `"name": "Laptop",`  
  `"price": 999.99,`  
  `"stock": 10`

`}`

Validation:

* `name`: string, required, max 200 chars  
* `price`: number, required, min 0, decimal up to 2 places  
* `stock`: integer, required, min 0

Responses

* `201 Created` – Product created (returns full product object)  
* `400 Bad Request` – Validation error

#### 4.3 PUT /products/adjust

Request Body

`json`

`{`  
  `"productId": "uuid",`  
  `"userId": "uuid",`  
  `"newStock": 15,        // optional but at least one of newStock/newPrice`  
  `"newPrice": 899.99     // optional`

`}`

Validation:

* `productId`: UUID, required, must exist  
* `userId`: UUID, required, must exist  
* At least one of `newStock` or `newPrice` must be provided and different from current value  
* `newStock`: integer ≥ 0 (if provided)  
* `newPrice`: number ≥ 0, decimal (if provided)

Atomicity: The update and transaction creation must be wrapped in a single database transaction (rollback if any step fails).

Responses

* `200 OK` – Adjustment applied  
* `json`

`{`  
  `"id": "uuid",`  
  `"name": "Laptop",`  
  `"price": 899.99,`  
  `"stock": 15,`  
  `"updatedAt": "iso"`

* `}`  
* `400 Bad Request` – Validation fails or no effective change  
* `404 Not Found` – Product or user not found  
* `409 Conflict` – Concurrent modification (optional with optimistic locking)

#### 4.4 GET /status/:productId

Path Parameter

* `productId`: UUID

Responses

* `200 OK`  
* `json`

`{`  
  `"id": "uuid",`  
  `"name": "Laptop",`  
  `"price": 899.99,`  
  `"stock": 15,`  
  `"updatedAt": "iso"`

* `}`  
* `404 Not Found` – Product does not exist

#### 4.5 GET /transactions

Query Parameters (all optional)

| Parameter | Type | Description | Example |
| :---- | :---- | :---- | :---- |
| `page` | integer | Page number (1‑based), default 1 | `?page=2` |
| `limit` | integer | Items per page (1–100), default 20 | `?limit=50` |
| `sortBy` | string | Field to sort: `createdAt` (default), `userId`, `productId` | `?sortBy=productId` |
| `sortOrder` | string | `ASC` or `DESC` (default DESC) | `?sortOrder=ASC` |
| `userId` | UUID | Filter by user | `?userId=...` |
| `productId` | UUID | Filter by product | `?productId=...` |
| `fromDate` | ISO date | Filter transactions created on or after this date | `?fromDate=2026-01-01` |
| `toDate` | ISO date | Filter transactions created on or before this date | `?toDate=2026-05-14` |
| `stockOnly` | boolean | If `true`, return only transactions that changed stock | `?stockOnly=true` |
| `priceOnly` | boolean | If `true`, return only transactions that changed price | `?priceOnly=true` |

Response `200 OK`

`json`

`{`  
  `"data": [`  
    `{`  
      `"id": "uuid",`  
      `"user": { "id": "uuid", "name": "John Doe" },`  
      `"product": { "id": "uuid", "name": "Laptop" },`  
      `"oldStock": 10,`  
      `"newStock": 15,`  
      `"oldPrice": 999.99,`  
      `"newPrice": 899.99,`  
      `"createdAt": "iso"`  
    `}`  
  `],`  
  `"meta": {`  
    `"total": 42,`  
    `"page": 2,`  
    `"limit": 20,`  
    `"totalPages": 3`  
  `}`

`}`

Error Responses

* `400 Bad Request` – Invalid query parameter (e.g., negative page, unknown sortBy)  
* `404 Not Found` – Not applicable (return empty data array)

---

### **5\. Filtering, Searching, Sorting & Pagination (Detailed)**

For `/transactions`, the following logic must be implemented in the application layer (use case):

* Filtering – Apply `WHERE` clauses using TypeORM’s `FindOptionsWhere`.  
  * `userId`, `productId`: exact match.  
  * `fromDate` / `toDate`: range on `createdAt`.  
  * `stockOnly`: `oldStock IS NOT NULL OR newStock IS NOT NULL`.  
  * `priceOnly`: `oldPrice IS NOT NULL OR newPrice IS NOT NULL`.  
* Searching – Not explicitly required, but can be added as `query` parameter to search product name or user name (would require joins). *Out of scope for the minimal exercise, but documented as potential extension.*  
* Sorting – Allowed fields: `createdAt`, `userId`, `productId`. Use `ORDER BY ${sortBy} ${sortOrder}`.  
  * Validate `sortBy` against a whitelist to prevent SQL injection (TypeORM parameterised, but still whitelist).  
  * Default `sortBy = 'createdAt'`, `sortOrder = 'DESC'`.  
* Pagination – Use `skip = (page-1) * limit`, `take = limit`.  
  * Return total count via separate query (`getManyAndCount()`).

Performance considerations:

* Ensure indexes on `userId`, `productId`, `createdAt`.  
* For large datasets, consider cursor‑based pagination, but offset+limit is acceptable for this scope.

---

### **6\. Rollback / Transaction Safety**

The `PUT /products/adjust` operation requires atomicity:

1. Fetch current product (with `FOR UPDATE` lock to prevent concurrent modifications).  
2. Validate that at least one of `newStock` / `newPrice` differs from current.  
3. Update product entity.  
4. Create transaction record with old/new values.  
5. Commit.

If any step fails (e.g., validation, database constraint, optimistic lock failure), the entire operation must roll back.

Implementation approach in NestJS \+ TypeORM:  
Use `QueryRunner` to start a transaction, then pass the `manager` to repositories.

`typescript`

`const queryRunner = dataSource.createQueryRunner();`  
`await queryRunner.connect();`  
`await queryRunner.startTransaction();`  
`try {`  
  `const product = await productRepo.findOne({ where: { id }, lock: { mode: 'pessimistic_write' } });`  
  `// ... perform update`  
  `await queryRunner.manager.save(product);`  
  `await queryRunner.manager.save(transaction);`  
  `await queryRunner.commitTransaction();`  
`} catch (error) {`  
  `await queryRunner.rollbackTransaction();`  
  `throw error;`  
`} finally {`  
  `await queryRunner.release();`

`}`

Rollback note for other endpoints:

* `POST /users` and `POST /products` are single‑record inserts – no cascading rollback needed.  
* `GET` endpoints are read‑only, no rollback.

---

### **7\. Performance Optimizations**

| Area | Measure |
| :---- | :---- |
| Database indexing | Create indexes on foreign keys (`userId`, `productId`) and `createdAt` in `Transaction` table. For `Product` and `User`, index on `email` (unique). |
| Query optimisation | Use `select` only needed columns on `/transactions` list (avoid select all). Use `leftJoinAndSelect` only for included relations. |
| Pagination | Enforce max `limit` (e.g., 100\) to prevent large result sets. |
| Connection pooling | TypeORM default (10 connections) is sufficient. Set `POOL_SIZE` env. |
| Caching (optional) | For `GET /status/:productId`, short‑lived in‑memory cache (e.g., 5s) can reduce DB load if many reads. |
| Logging | Use NestJS logger at `debug` level for slow queries (\>100ms). |

---

### **8\. Security Considerations**

| Concern | Measure |
| :---- | :---- |
| Input validation | `class-validator` \+ `ValidationPipe` (whitelist, forbidNonWhitelisted). |
| SQL injection | TypeORM parameterised queries; never concatenate user input into raw SQL. |
| XSS | Not applicable for JSON APIs, but escape if any HTML rendering. |
| Rate limiting | Use `@nestjs/throttler` – apply to write endpoints (e.g., 10 requests per minute per IP). |
| Data exposure | DTOs for responses exclude internal fields; transactions return only allowed fields. |
| Authentication (assumption) | Not required in spec, but would add JWT middleware. In this exercise, `userId` is trusted. |
| Environment variables | DB credentials, ports, etc., are read from `.env` (not committed). Docker Compose uses env\_file. |
| Helmet | Enable `Helmet` middleware for HTTP headers (Express). |

---

### **9\. Project Structure (Clean Architecture Example)**

`text`

`src/`  
`├── domain/`  
`│   ├── entities/`  
`│   │   ├── user.entity.ts          # TypeORM entity`  
`│   │   ├── product.entity.ts`  
`│   │   └── transaction.entity.ts`  
`│   └── repositories/`  
`│       ├── user.repository.abstract.ts`  
`│       ├── product.repository.abstract.ts`  
`│       └── transaction.repository.abstract.ts`  
`├── application/`  
`│   ├── use-cases/`  
`│   │   ├── create-user.use-case.ts`  
`│   │   ├── create-product.use-case.ts`  
`│   │   ├── adjust-product.use-case.ts`  
`│   │   ├── get-product-status.use-case.ts`  
`│   │   └── list-transactions.use-case.ts`  
`│   ├── dtos/`  
`│   │   ├── create-user.dto.ts`  
`│   │   ├── create-product.dto.ts`  
`│   │   ├── adjust-product.dto.ts`  
`│   │   └── transaction-query.dto.ts    # pagination, filters`  
`│   └── ports/`  
`│       ├── user.repository.port.ts`  
`│       ├── product.repository.port.ts`  
`│       └── transaction.repository.port.ts`  
`├── infrastructure/`  
`│   ├── orm/`  
`│   │   ├── typeorm.config.ts         # DataSource config`  
`│   │   └── migrations/               # TypeORM migration files`  
`│   ├── repositories/`  
`│   │   ├── user.repository.impl.ts   # implements domain interface`  
`│   │   ├── product.repository.impl.ts`  
`│   │   └── transaction.repository.impl.ts`  
`│   └── config/`  
`│       └── app.config.ts             # env variables`  
`├── presentation/`  
`│   ├── controllers/`  
`│   │   ├── users.controller.ts`  
`│   │   ├── products.controller.ts`  
`│   │   └── transactions.controller.ts`  
`│   ├── dtos/`  
`│   │   ├── user-response.dto.ts`  
`│   │   ├── product-response.dto.ts`  
`│   │   └── transaction-response.dto.ts`  
`│   └── pipes/`  
`│       └── validation.pipe.ts        # global validation pipe`  
`└── shared/`  
    `├── exceptions/`  
    `│   ├── domain.exception.ts`  
    `│   └── http-exception.filter.ts`  
    `└── utils/`

        `└── pagination.helper.ts`

Dependency injection:

* Each use case receives abstract repository ports.  
* Infrastructure modules provide concrete implementations.  
* Controllers call use cases directly.

---


#### 9.1 OpenAPI (Swagger) Documentation

**Purpose:** Provide interactive, self‑documenting API explorer at `/docs`. Generated automatically from DTOs and controllers.

**Implementation:**
- Add `@nestjs/swagger` package.
- Decorate all DTOs with `@ApiProperty()` including examples, validation constraints (min, max, required).
- Decorate controllers with `@ApiTags()`, `@ApiResponse()`, `@ApiOperation()`.
- Serve Swagger UI via `SwaggerModule.setup('docs', app, document)`.

**Benefit:** The employer can test all endpoints immediately without reading separate docs. Shows attention to developer experience.

#### 9.2 Request Tracing (Correlation ID)

**Purpose:** Every request receives a unique `X-Request-Id` header; all logs include this ID to trace a single request across the entire stack.

**Implementation:**
- Create a NestJS interceptor that generates a UUID if the header is absent, then attaches it to the request context (using `AsyncLocalStorage` or `CLS`).
- Configure `nestjs-pino` or the built‑in logger to automatically include the trace ID in every log line.
- Add the ID to all HTTP responses via the same interceptor.

**Benefit:** Debugging production issues becomes straightforward – filter logs by `X-Request-Id` to see exactly what happened during a failing request.

#### 9.3 Health Check Endpoint (`GET /health`)

**Purpose:** Verify that the service and its dependencies are ready to serve traffic. Essential for container orchestration (Docker healthcheck, Kubernetes liveness/readiness probes).

**Implementation:**
- Create a controller route `GET /health`.
- Check:
  - Database connectivity – run a simple `SELECT 1` query via TypeORM.
  - Migration status – query the `migrations` table to ensure no pending migrations.
  - (Optional) Disk space, memory.
- Return `200 OK` with JSON body `{ status: 'ok', uptime: ..., db: 'connected', migrations: 'up_to_date' }` on success.
- Return `503 Service Unavailable` with failure details on any error.

**Usage in Docker Compose:**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 5s
  retries: 3

### **10\. Docker Compose & Environment**

`docker-compose.yml` (simplified)

`yaml`

`version: '3.8'`  
`services:`  
  `api:`  
    `build: .`  
    `ports:`  
      `- "3000:3000"`  
    `depends_on:`  
      `- postgres`  
    `environment:`  
      `- DB_HOST=postgres`  
      `- DB_PORT=5432`  
      `- DB_USER=postgres`  
      `- DB_PASSWORD=postgres`  
      `- DB_NAME=ellatech`  
    `volumes:`  
      `- ./src:/app/src`

  `postgres:`  
    `image: postgres:15-alpine`  
    `ports:`  
      `- "5432:5432"`  
    `environment:`  
      `- POSTGRES_USER=postgres`  
      `- POSTGRES_PASSWORD=postgres`  
      `- POSTGRES_DB=ellatech`  
    `volumes:`  
      `- postgres_data:/var/lib/postgresql/data`

`volumes:`

  `postgres_data:`

Migrations:

* Generate migration after entity changes: `npm run migration:generate -- src/infrastructure/orm/migrations/InitTables`  
* Run migrations on container start (e.g., using `npm run migration:run` in the API’s entrypoint).

Environment variables – use `.env` file (not committed) for local overrides.

---

### **11\. Assumptions & Trade‑offs**

| Assumption / Trade‑off | Rationale |
| :---- | :---- |
| No authentication / authorization | Assignment does not require it; `userId` is provided in request body. For production, add JWT. |
| `userId` and `productId` are validated as existing before adjustment | Extra database calls, but ensures referential integrity. Could be optimised with foreign keys only, but explicit check gives better error messages. |
| `ON DELETE RESTRICT` on transactions | Preserves history; prevents orphaned records. If history must be kept after user/product deletion, change to `SET NULL` or soft delete. |
| Offset‑based pagination | Simpler to implement; for very large tables, cursor‑based is more performant. Acceptable for 3‑5h exercise. |
| No soft deletes for users/products | Not requested; deletions are not part of endpoints. If needed later, add `deletedAt` column. |
| Only one transaction per adjustment | If both stock and price change, one transaction logs both. Alternative: two separate transactions – but that would not accurately reflect the single user action. |
| No explicit event sourcing / message queue | Out of scope; transaction history is stored relationally. |
| Validation on `newStock`/`newPrice` only | Does not prevent negative stock (already validated min 0). Also does not check price increase limits – out of scope. |
| TypeORM chosen as ORM | Matches assignment requirement; however, note that TypeORM’s transaction API is used. |

---

### **12\. Deliverables Checklist**

* GitHub repository with the above structure.  
* `README.md` containing:  
  * How to run with Docker Compose (`docker-compose up`)  
  * How to run migrations (automatic or manual command)  
  * API documentation (endpoints, request/response examples)  
  * Notes on assumptions/trade‑offs (summarised from Section 11\)  
* All endpoints implemented with DTO validation and correct status codes.  
* TypeORM migrations included (`src/infrastructure/orm/migrations`).

Testing (optional but recommended):

* Provide `docker-compose -f docker-compose.test.yml` or simple `npm run test:e2e` for basic endpoint tests.

---

### **13\. Extension Ideas (for discussion)**

If more time were available:

* Add JWT authentication and extract `userId` from token.  
* Implement optimistic locking on product (version column) to prevent lost updates.  
* Add WebSocket notifications when a product is adjusted.  
* Introduce CQRS – separate read and write models for transactions.  
* Use prometheus metrics and health checks.  
* Add OpenAPI (Swagger) documentation automatically from DTOs.

