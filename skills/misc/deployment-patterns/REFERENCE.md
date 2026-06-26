# Deployment Patterns — Reference

## Deployment Strategies

**Rolling**: Replace instances gradually — zero downtime, backward-compatible required.
**Blue-Green**: Two identical environments, atomic switch — instant rollback, 2x infra.
**Canary**: Route small traffic % to new version — catch issues before full rollout, needs traffic splitting.

## Docker Multi-Stage

### Node.js
```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
# Stage 2: build
# Stage 3: production — non-root user, dist + node_modules only
```
### Go
```dockerfile
FROM golang:1.22-alpine AS builder
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /server ./cmd/server
FROM alpine:3.19 AS runner
COPY --from=builder /server /server
```

### Best Practices
- Specific version tags (never `:latest`)
- Multi-stage builds
- Non-root user
- Layer caching (deps first)
- HEALTHCHECK instruction
- .dockerignore

## CI/CD Pipeline

### GitHub Actions Standard
```
PR: lint → typecheck → unit tests → integration tests → preview deploy
Main: + build image → deploy staging → smoke tests → deploy production
```

## Health Checks
```typescript
app.get("/health", (req, res) => { res.status(200).json({ status: "ok" }); });
```
### Kubernetes Probes
```yaml
livenessProbe: httpGet: path: /health port: 3000 initialDelaySeconds: 10 periodSeconds: 30
readinessProbe: httpGet: path: /health port: 3000 initialDelaySeconds: 5 periodSeconds: 10
startupProbe: httpGet: path: /health port: 3000 failureThreshold: 30
```

## Environment Config
- Twelve-Factor App: all config via env vars
- Validate at startup with Zod/Pydantic
- Separate dev/staging/production settings

## Rollback
```bash
kubectl rollout undo deployment/app
vercel rollback
```

## Production Readiness Checklist
- [ ] All tests pass
- [ ] No hardcoded secrets
- [ ] Structured JSON logging, no PII
- [ ] Health check endpoint
- [ ] Docker image pinned versions
- [ ] Resource limits set
- [ ] SSL/TLS enabled
- [ ] Metrics exported, alerts configured
- [ ] Dependencies scanned for CVEs
- [ ] Rate limiting enabled
- [ ] Rollback plan documented and tested
