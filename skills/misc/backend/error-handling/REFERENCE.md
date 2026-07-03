# Error Handling — Reference

## Core Principles
1. Fail fast and loudly
2. Typed errors over string messages
3. User messages ≠ developer messages
4. Never swallow errors silently
5. Errors are part of your API contract

## TypeScript Typed Error Classes
```typescript
export class AppError extends Error {
  constructor(message: string, public readonly code: string, public readonly statusCode: number = 500, public readonly details?: unknown) {
    super(message); this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class NotFoundError extends AppError { constructor(resource: string, id: string) { super(`${resource} not found: ${id}`, 'NOT_FOUND', 404); } }
export class ValidationError extends AppError { constructor(message: string, details: { field: string; message: string }[]) { super(message, 'VALIDATION_ERROR', 422, details); } }
export class UnauthorizedError extends AppError { constructor(reason = 'Authentication required') { super(reason, 'UNAUTHORIZED', 401); } }
export class RateLimitError extends AppError { constructor(public readonly retryAfterMs: number) { super('Rate limit exceeded', 'RATE_LIMITED', 429); } }
```

## Result Pattern
```typescript
type Result<T, E = AppError> = { ok: true; value: T } | { ok: false; error: E };
function ok<T>(value: T): Result<T> { return { ok: true, value }; }
function err<E>(error: E): Result<never, E> { return { ok: false, error }; }

async function fetchUser(id: string): Promise<Result<User>> {
  try { const user = await db.users.findUnique({ where: { id } }); if (!user) return err(new NotFoundError('User', id)); return ok(user); }
  catch (e) { return err(new AppError('Database error', 'DB_ERROR')); }
}
```

## API Error Handler
```typescript
function handleApiError(error: unknown): NextResponse {
  if (error instanceof AppError) return NextResponse.json({ error: { code: error.code, message: error.message } }, { status: error.statusCode });
  if (error instanceof z.ZodError) return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: error.issues } }, { status: 422 });
  console.error('Unexpected error:', error);
  return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
}
```

## React Error Boundary
```typescript
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { this.props.onError?.(error, info); console.error('Unhandled React error:', error, info); }
  render() { if (this.state.hasError) return this.props.fallback; return this.props.children; }
}
```

## Python (FastAPI)
```python
@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"error": {"code": exc.code, "message": str(exc)}})
```

## Go
```go
var ErrNotFound = errors.New("not found")
// Wrap: fmt.Errorf("user %s: %w", id, ErrNotFound)
// Check: errors.Is(err, domain.ErrNotFound)
```

## Retry with Exponential Backoff
```typescript
async function withRetry<T>(fn: () => Promise<T>, options: { maxAttempts?: number; baseDelayMs?: number; maxDelayMs?: number; retryIf?: (error: unknown) => boolean } = {}): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try { return await fn(); }
    catch (error) { if (attempt === maxAttempts || !retryIf(error)) throw error; await new Promise(r => setTimeout(r, Math.min(baseDelayMs * 2 ** (attempt - 1) + Math.random() * baseDelayMs, maxDelayMs))); }
  }
}
```

## User-Facing Messages
```typescript
const USER_ERROR_MESSAGES: Record<string, string> = {
  NOT_FOUND: 'The requested item could not be found.',
  UNAUTHORIZED: 'Please sign in to continue.',
  INTERNAL_ERROR: 'Something went wrong. Please try again later.',
};
```

## Checklist
- [ ] Every `catch` handles, re-throws, or logs
- [ ] API errors follow `{ error: { code, message } }` envelope
- [ ] No stack traces in user-facing messages
- [ ] Full error context logged server-side
- [ ] Custom error classes extend base `AppError` with `code`
- [ ] Retry only retriable errors (not 4xx)
- [ ] React components in ErrorBoundary
