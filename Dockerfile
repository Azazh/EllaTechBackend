# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY tsconfig*.json nest-cli.json ./
COPY src ./src

RUN npm run build

# ── Production stage ─────────────────────────────────────────────────────────
FROM node:22-alpine AS production

WORKDIR /app

# Copy only production deps
COPY package*.json ./
RUN npm ci --only=production --no-audit --no-fund && npm cache clean --force

# Copy compiled output
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Run migrations then start the server
CMD ["sh", "-c", "node -e \"require('./dist/src/infrastructure/orm/typeorm.config').AppDataSource.initialize().then(ds => ds.runMigrations()).then(() => process.exit(0))\" && node dist/src/main.js"]
