# Security Review — Reference

See [SKILL.md](SKILL.md) for checklist summary, quick start, and pre-deployment checklist.

## Security Checklist Details

### 1. Secrets Management

**FAIL: NEVER Do This**
```typescript
const apiKey = "sk-proj-xxxxx"  // Hardcoded secret
const dbPassword = "password123" // In source code
```

**PASS: ALWAYS Do This**
```typescript
const apiKey = process.env.OPENAI_API_KEY
const dbUrl = process.env.DATABASE_URL

if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

**Verification Steps**
- [ ] No hardcoded API keys, tokens, or passwords
- [ ] All secrets in environment variables
- [ ] `.env.local` in .gitignore
- [ ] No secrets in git history
- [ ] Production secrets in hosting platform (Vercel, Railway)

### 2. Input Validation

```typescript
import { z } from 'zod'

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().int().min(0).max(150)
})

export async function createUser(input: unknown) {
  try {
    const validated = CreateUserSchema.parse(input)
    return await db.users.create(validated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors }
    }
    throw error
  }
}
```

**File Upload Validation**
```typescript
function validateFileUpload(file: File) {
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) throw new Error('File too large (max 5MB)')

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) throw new Error('Invalid file type')

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0]
  if (!extension || !allowedExtensions.includes(extension)) throw new Error('Invalid file extension')
  return true
}
```

### 3. SQL Injection Prevention

**FAIL:** `const query = \`SELECT * FROM users WHERE email = '${userEmail}'\``
**PASS:** Parameterized queries with ORM or `$1` placeholders.

### 4. Authentication & Authorization

**JWT:** Use httpOnly cookies, not localStorage.
**Authorization:** Always verify role/permissions before sensitive operations.
**Row Level Security (Supabase):**
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own data" ON users FOR SELECT USING (auth.uid() = id);
```

### 5. XSS Prevention

**Sanitize HTML** with DOMPurify. **Content Security Policy** — start strict, loosen only with documented removal plan.

```typescript
const securityHeaders = [
  { key: 'Content-Security-Policy', value: `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none';` }
]
```

### 6. CSRF Protection

CSRF tokens on state-changing operations. `SameSite=Strict` on all cookies.

### 7. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit'
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
```

### 8. Sensitive Data Exposure

**Logging:** Never log passwords, tokens, or secrets.
**Error Messages:** Generic for users, detailed in server logs.

### 9. Blockchain Security (Solana)

Wallet signature verification, transaction detail validation, balance checks before transactions, no blind signing.

### 10. Dependency Security

```bash
npm audit && npm audit fix
```

Lock files committed, Dependabot enabled.

## Security Testing

```typescript
test('requires authentication', async () => {
  const response = await fetch('/api/protected')
  expect(response.status).toBe(401)
})

test('requires admin role', async () => {
  const response = await fetch('/api/admin', {
    headers: { Authorization: `Bearer ${userToken}` }
  })
  expect(response.status).toBe(403)
})

test('rejects invalid input', async () => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ email: 'not-an-email' })
  })
  expect(response.status).toBe(400)
})
```
