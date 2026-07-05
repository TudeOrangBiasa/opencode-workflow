# AI Regression Testing — Reference

## Core Problem Detail

```
AI writes fix → AI reviews fix → AI says "looks correct" → Bug still exists
```

**Real-world example:** Fixing `notification_settings` took 4 AI attempts (added to response but not SELECT, then to SELECT but not generated types, then to production but not sandbox). A test caught it on first run.

The pattern: **sandbox/production path inconsistency** is the #1 AI-introduced regression.

## Sandbox-Mode API Testing Setup

### Vitest + Next.js App Router

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";
export default defineConfig({
  test: { environment: "node", globals: true, include: ["__tests__/**/*.test.ts"], setupFiles: ["__tests__/setup.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```

```typescript
// __tests__/setup.ts
process.env.SANDBOX_MODE = "true";
process.env.NEXT_PUBLIC_SUPABASE_URL = "";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "";
```

### Test Helper

```typescript
// __tests__/helpers.ts
import { NextRequest } from "next/server";

export function createTestRequest(url: string, options?: {
  method?: string; body?: Record<string, unknown>;
  headers?: Record<string, string>; sandboxUserId?: string;
}): NextRequest {
  const { method = "GET", body, headers = {}, sandboxUserId } = options || {};
  const fullUrl = url.startsWith("http") ? url : `http://localhost:3000${url}`;
  const reqHeaders: Record<string, string> = { ...headers };
  if (sandboxUserId) reqHeaders["x-sandbox-user-id"] = sandboxUserId;
  const init: { method: string; headers: Record<string, string>; body?: string } = { method, headers: reqHeaders };
  if (body) { init.body = JSON.stringify(body); reqHeaders["content-type"] = "application/json"; }
  return new NextRequest(fullUrl, init);
}

export async function parseResponse(response: Response) {
  const json = await response.json();
  return { status: response.status, json };
}
```

### Writing Regression Tests

Key principle: **write tests for bugs that were found, not for code that works**.

```typescript
const REQUIRED_FIELDS = ["id", "email", "full_name", "phone", "role", "created_at", "avatar_url", "notification_settings"];

describe("GET /api/user/profile", () => {
  it("returns all required fields", async () => {
    const req = createTestRequest("/api/user/profile");
    const res = await GET(req);
    const { status, json } = await parseResponse(res);
    expect(status).toBe(200);
    for (const field of REQUIRED_FIELDS) expect(json.data).toHaveProperty(field);
  });

  it("notification_settings is not undefined (BUG-R1 regression)", async () => {
    const req = createTestRequest("/api/user/profile");
    const res = await GET(req);
    const { json } = await parseResponse(res);
    expect("notification_settings" in json.data).toBe(true);
    const ns = json.data.notification_settings;
    expect(ns === null || typeof ns === "object").toBe(true);
  });
});
```

### Sandbox/Production Parity

```typescript
describe("GET /api/user/messages", () => {
  it("includes partner_name in sandbox mode", async () => {
    const req = createTestRequest("/api/user/messages", { sandboxUserId: "user-001" });
    const res = await GET(req);
    const { json } = await parseResponse(res);
    if (json.data.length > 0) {
      for (const conv of json.data) expect("partner_name" in conv).toBe(true);
    }
  });
});
```

## Bug-Check Workflow Integration

```markdown
## Step 1: Automated Tests (mandatory)
npm run test && npm run build
- If tests fail → highest priority bug
- Only proceed if both pass

## Step 2: Code Review
1. Sandbox / production path consistency
2. API response shape matches frontend expectations
3. SELECT clause completeness
4. Error handling with rollback
5. Optimistic update race conditions

## Step 3: For each bug fixed, propose a regression test
```

## Common AI Regression Patterns

### Pattern 1: Sandbox/Production Mismatch (most common)
```typescript
// FAIL: AI adds field to production path only
if (isSandboxMode()) return { data: { id, email, name } };
return { data: { id, email, name, notification_settings } };
```

### Pattern 2: SELECT Clause Omission
```typescript
// FAIL: New column not in SELECT
const { data } = await supabase.from("users").select("id, email, name").single();
return { data: { ...data, notification_settings: data.notification_settings } };
// → notification_settings is always undefined
```

### Pattern 3: Error State Leakage
```typescript
// FAIL: Error set but old data not cleared
catch (err) { setError("Failed to load"); } // reservations still shows old data

// PASS: Clear related state
catch (err) { setReservations([]); setError("Failed to load"); }
```

### Pattern 4: Optimistic Update Without Rollback
```typescript
// FAIL: No rollback on failure
const handleRemove = async (id: string) => {
  setItems(prev => prev.filter(i => i.id !== id));
  await fetch(`/api/items/${id}`, { method: "DELETE" }); // If fails, item gone from UI
};

// PASS: Capture previous state and rollback
const handleRemove = async (id: string) => {
  const prevItems = [...items];
  setItems(prev => prev.filter(i => i.id !== id));
  try { const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("API error");
  } catch { setItems(prevItems); }
};
```

## Test Strategy

Don't aim for 100% coverage. Target bugs where they cluster:

| AI Regression Pattern | Test Strategy | Priority |
|---|---|---|
| Sandbox/production mismatch | Assert same response shape in sandbox mode | High |
| SELECT clause omission | Assert all required fields in response | High |
| Error state leakage | Assert state cleanup on error | Medium |
| Missing rollback | Assert state restored on API failure | Medium |

## DO / DON'T

**DO:** Write tests immediately after finding a bug; test API response shape, not implementation; run tests first in bug-check; keep tests fast (<1s); name tests after the bug.

**DON'T:** Write tests for code that never had a bug; trust AI self-review as substitute; skip sandbox path testing; aim for coverage percentage.
