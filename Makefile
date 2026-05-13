# Project command runner for local development
# Usage examples:
#   make help
#   make up
#   make dev
#   make migration-run

SHELL := /bin/bash
.DEFAULT_GOAL := help

APP_NAME ?= ellatech
APP_SERVICE ?= api
DB_SERVICE ?= postgres
DC ?= docker compose
NPM ?= npm

.PHONY: help install dev start-prod build lint format test test-watch test-e2e \
	up down restart logs ps clean prune \
	db-shell db-logs \
	migration-generate migration-run migration-revert migration-show \
	status

help: ## Show all available commands
	@echo "$(APP_NAME) - available make targets"
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z0-9_.-]+:.*##/ {printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

status: ## Show Docker service status
	$(DC) ps

install: ## Install Node.js dependencies
	$(NPM) install

dev: ## Run NestJS in watch mode (local, non-container)
	$(NPM) run start:dev

start-prod: ## Run NestJS in production mode (local)
	$(NPM) run start:prod

build: ## Build TypeScript project
	$(NPM) run build

lint: ## Run ESLint
	$(NPM) run lint

format: ## Format codebase
	$(NPM) run format

test: ## Run unit tests
	$(NPM) run test

test-watch: ## Run unit tests in watch mode
	$(NPM) run test:watch

test-e2e: ## Run e2e tests
	$(NPM) run test:e2e

up: ## Start Docker services in detached mode
	$(DC) up -d --build

down: ## Stop Docker services
	$(DC) down

restart: ## Restart Docker services
	$(DC) restart

logs: ## Stream logs from all services
	$(DC) logs -f

ps: ## List running services
	$(DC) ps

clean: ## Remove local build and test artifacts
	rm -rf dist coverage .turbo

prune: ## Remove containers, networks, and dangling images (careful)
	$(DC) down --remove-orphans
	docker image prune -f

db-shell: ## Open psql shell inside the database container
	$(DC) exec $(DB_SERVICE) psql -U postgres -d ellatech

db-logs: ## Stream database logs
	$(DC) logs -f $(DB_SERVICE)

migration-generate: ## Generate a new TypeORM migration (use: make migration-generate NAME=InitTables)
	@if [[ -z "$(NAME)" ]]; then echo "Error: NAME is required. Example: make migration-generate NAME=InitTables"; exit 1; fi
	$(NPM) run migration:generate -- src/infrastructure/orm/migrations/$(NAME)  # -d already in npm script

migration-run: ## Run pending TypeORM migrations
	$(NPM) run migration:run

migration-revert: ## Revert last TypeORM migration
	$(NPM) run migration:revert

migration-show: ## Show TypeORM migration status
	$(NPM) run migration:show

open-docs: ## Open Swagger UI in the default browser (requires running API)
	xdg-open http://localhost:3000/docs 2>/dev/null || open http://localhost:3000/docs
