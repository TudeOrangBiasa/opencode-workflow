# API Connector Builder — Reference

## Reference Shapes

### Provider-style

```text
providers/
  existing_provider/
    __init__.py
    provider.py
    config.py
```

### Connector-style

```text
integrations/
  existing/
    client.py
    models.py
    connector.py
```

### TypeScript plugin-style

```text
src/integrations/
  existing/
    index.ts
    client.ts
    types.ts
    test.ts
```

## Quality Checklist

- [ ] matches an existing in-repo integration pattern
- [ ] config validation exists
- [ ] auth and error handling are explicit
- [ ] pagination/retry behavior follows repo norms
- [ ] registry/discovery wiring is complete
- [ ] tests mirror the host repo's style
- [ ] docs/examples are updated if expected by the repo

## Related Skills

- `backend-patterns`
- `mcp-server-patterns`
- `github-ops`
# API Design — Reference

## Resource Design

### URL Structure
```
GET    /api/v1/users              GET    /api/v1/users/:id
POST   /api/v1/users              PUT    /api/v1/users/:id
PATCH  /api/v1/users/:id          DELETE /api/v1/users/:id
GET    /api/v1/users/:id/orders   POST   /api/v1/orders/:id/cancel
```

### Naming Rules
- **GOOD**: `/api/v1/team-members`, `/api/v1/orders?status=active`
- **BAD**: `/api/v1/getUsers` (verb), `/api/v1/user` (singular), `/api/v1/team_members` (snake_case)

## HTTP Methods & Status Codes

| Method | Idempotent | Safe | Use For |
|--------|-----------|------|---------|
| GET | Yes | Yes | Retrieve |
| POST | No | No | Create, trigger actions |
| PUT | Yes | No | Full replacement |
| PATCH | No* | No | Partial update |
| DELETE | Yes | No | Remove |

### Status Codes
- **200** OK (GET, PUT, PATCH), **201** Created (POST), **204** No Content (DELETE)
- **400** Bad Request, **401** Unauthorized, **403** Forbidden, **404** Not Found
- **409** Conflict, **422** Unprocessable Entity, **429** Too Many Requests
- **500** Internal Server Error, **502** Bad Gateway, **503** Service Unavailable

## Response Format

### Success
```json
{ "data": { "id": "abc-123", "email": "alice@example.com", "name": "Alice", "created_at": "2025-01-15T10:30:00Z" } }
```

### Collection with Pagination
```json
{ "data": [...], "meta": { "total": 142, "page": 1, "per_page": 20, "total_pages": 8 }, "links": { "self": "...", "next": "..." } }
```

### Error
```json
{ "error": { "code": "validation_error", "message": "Request validation failed", "details": [{"field": "email", "message": "Must be valid", "code": "invalid_format"}] } }
```

## Pagination

**Offset-based**: `?page=2&per_page=20` — simple, slow on large offsets.
**Cursor-based**: `?cursor=<opaque>&limit=20` — consistent performance, stable with inserts.

| Use Case | Type |
|----------|------|
| Admin dashboards, <10K rows | Offset |
| Infinite scroll, feeds | Cursor |
| Public APIs | Cursor (default) |
| Search results | Offset |

## Filtering, Sorting, Search
- Filter: `?status=active`, `?price[gte]=10&price[lte]=100`, `?category=electronics,clothing`
- Sort: `?sort=-created_at`, `?sort=-featured,price`
- Search: `?q=wireless+headphones`

## Auth
- Bearer token: `Authorization: Bearer <jwt>`
- API key: `X-API-Key: sk_live_abc123`
- Check ownership (resource-level) and roles (function-level)

## Rate Limiting
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Response on limit: `429 Too Many Requests` with `Retry-After`

## Versioning
- URL path: `/api/v1/` (recommended)
- Maintain ≤2 active versions
- Non-breaking additions don't need new version

## Implementation Patterns

### TypeScript (Next.js)
```typescript
const createUserSchema = z.object({ email: z.string().email(), name: z.string().min(1).max(100) });
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: { code: "validation_error", message: "Validation failed", details: parsed.error.issues } }, { status: 422 });
  const user = await createUser(parsed.data);
  return NextResponse.json({ data: user }, { status: 201, headers: { Location: `/api/v1/users/${user.id}` } });
}
```

## API Design Checklist
- [ ] Resource URL follows naming conventions
- [ ] Correct HTTP method used
- [ ] Appropriate status codes (not 200 for everything)
- [ ] Input validated with schema
- [ ] Error responses follow standard format
- [ ] Pagination for list endpoints
- [ ] Authentication required (or explicitly public)
- [ ] Authorization checked
- [ ] Rate limiting configured
- [ ] No internal details leaked
- [ ] Documented (OpenAPI/Swagger)
