# Backend Patterns — Reference

## API Design Patterns

### Repository Pattern
```typescript
interface MarketRepository {
  findAll(filters?: MarketFilters): Promise<Market[]>
  findById(id: string): Promise<Market | null>
  create(data: CreateMarketDto): Promise<Market>
  update(id: string, data: UpdateMarketDto): Promise<Market>
  delete(id: string): Promise<void>
}
class SupabaseMarketRepository implements MarketRepository { /* ... */ }
```

### Service Layer Pattern
```typescript
class MarketService {
  constructor(private marketRepo: MarketRepository) {}
  async searchMarkets(query: string, limit: number = 10): Promise<Market[]> {
    const embedding = await generateEmbedding(query);
    const results = await this.vectorSearch(embedding, limit);
    return (await this.marketRepo.findByIds(results.map(r => r.id)))
      .sort((a, b) => results.find(r => r.id === a.id)?.score! - results.find(r => r.id === b.id)?.score!);
  }
}
```

### Middleware Pattern
```typescript
export function withAuth(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try { req.user = await verifyToken(token); return handler(req, res); }
    catch { return res.status(401).json({ error: 'Invalid token' }); }
  };
}
```

## Database Patterns

### Query Optimization & N+1 Prevention
```typescript
// GOOD: Select only needed columns, batch fetch
const { data } = await supabase.from('markets').select('id, name, status, volume').limit(10);
const creatorIds = markets.map(m => m.creator_id);
const creators = await getUsers(creatorIds);
```

### Transactions
```typescript
const { data, error } = await supabase.rpc('create_market_with_position', { market_data, position_data });
```

## Caching Strategies

### Cache-Aside Pattern
```typescript
async function getMarketWithCache(id: string): Promise<Market> {
  const cached = await redis.get(`market:${id}`);
  if (cached) return JSON.parse(cached);
  const market = await db.markets.findUnique({ where: { id } });
  if (market) await redis.setex(`market:${id}`, 300, JSON.stringify(market));
  return market;
}
```

## Error Handling

### Centralized Error Handler
```typescript
class ApiError extends Error {
  constructor(public statusCode: number, public message: string, public isOperational = true) { super(message); }
}
export function errorHandler(error: unknown): Response {
  if (error instanceof ApiError) return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
  if (error instanceof z.ZodError) return NextResponse.json({ success: false, error: 'Validation failed', details: error.errors }, { status: 400 });
  console.error('Unexpected error:', error);
  return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
}
```

### Retry with Exponential Backoff
```typescript
async function fetchWithRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try { return await fn(); } catch (error) {
      if (i < maxRetries - 1) await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
      else throw error;
    }
  }
}
```

## Authentication & Authorization

### JWT Token Validation
```typescript
export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
}
export async function requireAuth(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) throw new ApiError(401, 'Missing authorization token');
  return verifyToken(token);
}
```

### RBAC
```typescript
const rolePermissions = { admin: ['read', 'write', 'delete', 'admin'], moderator: ['read', 'write', 'delete'], user: ['read', 'write'] };
export function hasPermission(user: User, permission: Permission): boolean { return rolePermissions[user.role].includes(permission); }
```

## Rate Limiting

Must use shared store (Redis, gateway, platform limiter). Do not use per-process in-memory counters for production.

## Background Jobs

### Simple Queue
```typescript
class JobQueue<T> {
  private queue: T[] = [];
  async add(job: T) { this.queue.push(job); if (!this.processing) this.process(); }
  private async process() { /* sequential processing */ }
}
```

## Logging

### Structured Logging
```typescript
class Logger {
  log(level: 'info' | 'warn' | 'error', message: string, context?: LogContext) {
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), level, message, ...context }));
  }
}
```
