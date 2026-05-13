# EllaTech Backend

A NestJS service for managing **users**, **products**, and **product adjustment transactions** with a PostgreSQL database. Built with clean architecture principles and Docker support.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Database Migrations](#database-migrations)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Security Features](#security-features)

---

## Features

- ✅ User management (create users with unique emails)
- ✅ Product management (create products with price and stock)
- ✅ Atomic product adjustments (stock and/or price changes with transaction history)
- ✅ Transaction history with filtering, sorting, and pagination
- ✅ Health check endpoint for service monitoring
- ✅ Clean architecture (domain/application/infrastructure/presentation/shared)
- ✅ TypeORM with PostgreSQL
- ✅ Swagger UI auto-documentation
- ✅ Rate limiting (Helmet + Throttler)
- ✅ Input validation (class-validator)
- ✅ Global exception handling

---

## Project Structure

```
src/
├── domain/                          # Enterprise business rules
│   ├── entities/
│   │   ├── user.entity.ts           # User with email index
│   │   ├── product.entity.ts        # Product with decimal price
│   │   └── transaction.entity.ts    # Product change history
│   ├── repositories/
│   │   ├── user.repository.abstract.ts
│   │   ├── product.repository.abstract.ts
│   │   └── transaction.repository.abstract.ts
│   └── domain.module.ts
│
├── application/                     # Use cases / business logic
│   ├── use-cases/
│   │   ├── create-user.use-case.ts
│   │   ├── create-product.use-case.ts
│   │   ├── adjust-product.use-case.ts     # Transactional
│   │   ├── get-product-status.use-case.ts
│   │   ├── list-transactions.use-case.ts
│   │   └── get-health-status.use-case.ts
│   ├── dtos/
│   │   ├── create-user.dto.ts
│   │   ├── create-product.dto.ts
│   │   ├── adjust-product.dto.ts
│   │   └── transaction-query.dto.ts
│   ├── ports/
│   │   ├── user.repository.port.ts
│   │   ├── product.repository.port.ts
│   │   └── transaction.repository.port.ts
│   └── application.module.ts
│
├── infrastructure/                  # Frameworks, DB, ORM
│   ├── orm/
│   │   ├── typeorm.config.ts
│   │   └── migrations/
│   │       └── 1778666901075-InitTables.ts
│   ├── repositories/
│   │   ├── user.repository.impl.ts
│   │   ├── product.repository.impl.ts
│   │   └── transaction.repository.impl.ts
│   ├── config/
│   │   └── app.config.ts
│   └── infrastructure.module.ts
│
├── presentation/                    # HTTP layer (controllers)
│   ├── controllers/
│   │   ├── users.controller.ts
│   │   ├── products.controller.ts
│   │   ├── transactions.controller.ts
│   │   └── health.controller.ts
│   ├── dtos/
│   │   ├── user-response.dto.ts
│   │   ├── product-response.dto.ts
│   │   ├── transaction-response.dto.ts
│   │   ├── transaction-list-response.dto.ts
│   │   ├── health-response.dto.ts
│   │   └── pagination-meta.dto.ts
│   ├── pipes/
│   │   └── validation.pipe.ts
│   └── presentation.module.ts
│
├── shared/                          # Common utilities
│   ├── exceptions/
│   │   ├── domain.exception.ts
│   │   └── http-exception.filter.ts
│   ├── utils/
│   │   ├── decimal.transformer.ts
│   │   └── pagination.helper.ts
│   └── shared.module.ts
│
├── app.module.ts                    # Root module
└── main.ts                          # Bootstrap
```

---

## Prerequisites

- **Node.js** 18+ (tested with Node 22)
- **npm** or **yarn**
- **PostgreSQL** 15+ (local or Docker)
- **Docker & Docker Compose** (optional, for containerized setup)

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone git@github.com:Azazh/EllaTechBackend.git
cd EllaTech
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=ellatech
NODE_ENV=development
```

### 4. Create PostgreSQL Database

```bash
psql -U postgres -h localhost
CREATE DATABASE ellatech;
\q
```

---

## Running the Application

### Development Mode

Watch TypeScript files and restart on changes:

```bash
npm run start:dev
```

Server runs at `http://localhost:3000/api`  
Swagger UI at `http://localhost:3000/docs`

### Production Build

```bash
npm run build
npm run start
```

### Using Docker Compose

```bash
docker-compose up -d
```

Starts both the API (port 3000) and PostgreSQL (port 5432).

---

## Database Migrations

### Run Migrations

```bash
npm run migration:run
```

Creates tables: `users`, `products`, `transactions`.

### Generate Migration (after entity changes)

```bash
npm run migration:generate -- -n YourMigrationName
```

---

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Swagger UI

```
http://localhost:3000/docs
```

Interactive API documentation with live testing.

---

### Endpoints Overview

#### **Health**

| Method | Endpoint     | Purpose                             |
| ------ | ------------ | ----------------------------------- |
| GET    | `/health`    | Service & dependency health check   |

**Response (200):**
```json
{
  "status": "ok",
  "uptime": 42.5,
  "db": "connected",
  "migrations": "up_to_date"
}
```

---

#### **Users**

| Method | Endpoint  | Purpose      |
| ------ | --------- | ------------ |
| POST   | `/users`  | Create user  |

**Request:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

#### **Products**

| Method | Endpoint           | Purpose                              |
| ------ | ------------------ | ------------------------------------ |
| POST   | `/products`        | Create product                       |
| GET    | `/status/{id}`     | Get product stock & price            |
| PUT    | `/products/adjust` | Adjust stock and/or price atomically |

**POST /products Request:**
```json
{
  "name": "Widget Pro",
  "price": 9.99,
  "stock": 100
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Widget Pro",
  "price": 9.99,
  "stock": 100,
  "createdAt": "2024-01-15T10:35:00Z",
  "updatedAt": "2024-01-15T10:35:00Z"
}
```

**PUT /products/adjust Request:**
```json
{
  "productId": "550e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "newStock": 50
}
```

**Response (200):** Updated product + transaction record created atomically.

---

#### **Transactions**

| Method | Endpoint        | Purpose                    |
| ------ | --------------- | -------------------------- |
| GET    | `/transactions` | List transactions paginated |

**Query Parameters:**
- `page` (default: 1) — page number
- `limit` (default: 20, max: 100) — items per page
- `sortBy` — `createdAt`, `userId`, `productId`
- `sortOrder` — `ASC`, `DESC`
- `userId` — filter by user UUID
- `productId` — filter by product UUID
- `fromDate`, `toDate` — date range filter (ISO 8601)
- `stockOnly` — filter to stock-change transactions only
- `priceOnly` — filter to price-change transactions only

**Example Request:**
```
GET /api/transactions?page=1&limit=10&sortOrder=DESC&stockOnly=true
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "user": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Jane Doe"
      },
      "product": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Widget Pro"
      },
      "oldStock": 100,
      "newStock": 50,
      "oldPrice": null,
      "newPrice": null,
      "createdAt": "2024-01-15T10:40:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

## Testing

### Manual Testing with cURL

**1. Create a user:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@test.com"}'
```

**2. Create a product:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Gadget","price":19.99,"stock":50}'
```

**3. Adjust product (creates transaction):**
```bash
curl -X PUT http://localhost:3000/api/products/adjust \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"<USER_UUID>",
    "productId":"<PRODUCT_UUID>",
    "newStock":30
  }'
```

**4. List transactions:**
```bash
curl http://localhost:3000/api/transactions?page=1&limit=5
```

**5. Check health:**
```bash
curl http://localhost:3000/health
```

---

### Using Swagger UI

Navigate to `http://localhost:3000/docs` in your browser. All endpoints are documented with examples and you can test them directly from the UI.

---

## Security Features

- **Helmet** — Sets secure HTTP headers (CSP, HSTS, X-Frame-Options, etc.)
- **Rate Limiting** — Default 60 req/min per IP; write endpoints limited to 10 req/min per IP
- **Input Validation** — class-validator with whitelist and forbidden properties rejection
- **Atomic Transactions** — Pessimistic locking on product adjustments prevents race conditions
- **SQL Injection Prevention** — TypeORM parameterized queries only
- **Global Exception Filter** — Standardized error responses with proper HTTP status codes

---

## Environment Variables Reference

| Variable   | Default    | Description                    |
| ---------- | ---------- | ------------------------------ |
| PORT       | 3000       | HTTP server port               |
| DB_HOST    | localhost  | PostgreSQL host                |
| DB_PORT    | 5432       | PostgreSQL port                |
| DB_USER    | postgres   | PostgreSQL user                |
| DB_PASSWORD| (required) | PostgreSQL password            |
| DB_NAME    | ellatech   | PostgreSQL database name       |
| NODE_ENV   | development| Environment (development/prod) |

---

## Troubleshooting

### Port 3000 already in use

```bash
lsof -i :3000
kill -9 <PID>
```

### Database connection refused

- Ensure PostgreSQL is running
- Check credentials in `.env`
- Verify DB exists: `psql -U postgres -l`

### Migrations failed

```bash
npm run migration:run
# Or reset DB entirely (caution: deletes all data)
dropdb ellatech && createdb ellatech && npm run migration:run
```

---

## Build & Deployment

### Build for Production

```bash
npm run build
```

Outputs compiled code to `dist/` folder.

### Run Production Build

```bash
NODE_ENV=production npm start
```

---

## License

MIT

---

For detailed architecture documentation, see [EllaTech.md](./EllaTech.md).
