# Docker Patterns — Reference

## Docker Compose (Web App Stack)
```yaml
services:
  app:
    build: { context: ., target: dev }
    volumes: [.:/app, /app/node_modules]
    environment: [DATABASE_URL=postgres://postgres:postgres@db:5432/app_dev]
    depends_on: { db: { condition: service_healthy } }
  db:
    image: postgres:16-alpine
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck: { test: ["CMD-SHELL", "pg_isready -U postgres"] }
  redis:
    image: redis:7-alpine
    volumes: [redisdata:/data]
```

## Multi-Stage Dockerfile
```dockerfile
FROM node:22-alpine AS deps
COPY package.json package-lock.json ./; RUN npm ci
FROM node:22-alpine AS dev
COPY --from=deps /app/node_modules ./node_modules; COPY . .
FROM node:22-alpine AS build
RUN npm run build && npm prune --production
FROM node:22-alpine AS production
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001; USER appuser
COPY --from=build --chown=appuser:appgroup /app/dist ./dist; COPY --from=build --chown=appuser:appgroup /app/node_modules ./node_modules
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1
```

## Override Files
```yaml
# docker-compose.override.yml (auto-loaded, dev-only)
# docker-compose.prod.yml (explicit for prod: target=production, restart=always)
```

## Networking
- Services resolve by name: `db`, `redis`
- Custom networks for isolation (frontend-net, backend-net)
- Bind to `127.0.0.1` for local-only access

## Volume Strategies
- Named volumes: persistent data (pgdata, redisdata)
- Bind mounts: source code for hot reload
- Anonymous volumes: protect container-generated content from bind mount override

## Container Security
```dockerfile
FROM node:22.12-alpine3.20  # pinned version
RUN addgroup -g 1001 -S app && adduser -S app -u 1001; USER app
```
```yaml
services:
  app:
    security_opt: [no-new-privileges:true]
    read_only: true
    cap_drop: [ALL]
    env_file: [.env]  # never commit .env
```

## .dockerignore
```
node_modules .git .env .env.* dist coverage *.log .next .cache docker-compose*.yml README.md tests/
```

## Debugging Commands
```bash
docker compose logs -f app
docker compose exec app sh
docker compose exec db psql -U postgres
docker compose up --build
docker compose down -v  # DESTRUCTIVE
docker system prune
```

## Anti-Patterns
- Docker Compose in production without orchestration (use K8s/ECS/Swarm)
- Data in containers without volumes
- Running as root
- Using `:latest` tag
- One giant container with all services
- Secrets in docker-compose.yml
