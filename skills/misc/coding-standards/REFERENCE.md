# Coding Standards — Reference

## Code Quality Principles

### 1. Readability First
Code is read more than written. Self-documenting code > comments.

### 2. KISS
Simplest solution that works. No over-engineering. No premature optimization.

### 3. DRY
Extract common logic. Create reusable components. No copy-paste.

### 4. YAGNI
Don't build features before needed. Avoid speculative generality.

## TypeScript/JavaScript Standards

### Naming
```typescript
// GOOD: descriptive
const marketSearchQuery = 'election';
const isUserAuthenticated = true;
async function fetchMarketData(marketId: string) {}
function isValidEmail(email: string): boolean {}
```

### Immutability (CRITICAL)
```typescript
// ALWAYS use spread
const updatedUser = { ...user, name: 'New Name' };
const updatedArray = [...items, newItem];
// NEVER mutate directly
// user.name = 'New Name'  // BAD
// items.push(newItem)     // BAD
```

### Error Handling
```typescript
async function fetchData(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    throw new Error('Failed to fetch data');
  }
}
```

### Async/Await: Parallel when possible
```typescript
const [users, markets] = await Promise.all([fetchUsers(), fetchMarkets()]);
```

### Type Safety: Never use `any`
```typescript
function getMarket(id: string): Promise<Market> { ... }
```

## React Best Practices

### Component Structure: typed props, functional components
```typescript
interface ButtonProps { children: React.ReactNode; onClick: () => void; disabled?: boolean; variant?: 'primary' | 'secondary'; }
export function Button({ children, onClick, disabled = false, variant = 'primary' }: ButtonProps) { ... }
```

### Custom Hooks: `useDebounce`, etc.
### State: functional updates `setCount(prev => prev + 1)`
### Conditional rendering: clear patterns, no ternary hell

## API Design Standards

**REST**: `GET /api/markets`, `POST /api/markets`, etc.
**Response format**: consistent `{ success, data, error, meta }`
**Input validation**: Zod schemas

## File Organization

```
src/app/              # Next.js App Router
src/components/       # React components (ui/, forms/, layouts/)
src/hooks/            # Custom hooks
src/lib/              # Utilities (api/, utils/, constants/)
src/types/            # TypeScript types
```

## Comments: explain WHY, not WHAT. JSDoc for public APIs.

## Performance: `useMemo`/`useCallback` for expensive ops, lazy loading

## Testing Standards: AAA pattern (Arrange/Act/Assert), descriptive names

## Code Smell Detection
- Long functions (>50 lines) → split
- Deep nesting (5+ levels) → early returns
- Magic numbers → named constants
