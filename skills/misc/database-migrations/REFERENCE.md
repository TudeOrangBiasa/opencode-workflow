# Database Migrations — Reference

## PostgreSQL Patterns

### Safe Column Addition
```sql
ALTER TABLE users ADD COLUMN avatar_url TEXT;                    -- nullable, no lock
ALTER TABLE users ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true; -- with default (no rewrite)
-- BAD: NOT NULL without default on existing table → full table rewrite + lock
```

### Zero-Downtime Index
```sql
CREATE INDEX CONCURRENTLY idx_users_email ON users (email);  -- non-blocking (not in transaction)
```

### Expand-Contract Column Rename
```sql
-- Migration 001: ADD new column
ALTER TABLE users ADD COLUMN display_name TEXT;
-- Migration 002: backfill
UPDATE users SET display_name = username WHERE display_name IS NULL;
-- Deploy app (read/write both)
-- Migration 003: DROP old column
ALTER TABLE users DROP COLUMN username;
```

### Batch Data Migration
```sql
DO $$ DECLARE batch_size INT := 10000; rows_updated INT; BEGIN
  LOOP
    UPDATE users SET normalized_email = LOWER(email)
    WHERE id IN (SELECT id FROM users WHERE normalized_email IS NULL LIMIT batch_size FOR UPDATE SKIP LOCKED);
    GET DIAGNOSTICS rows_updated = ROW_COUNT; EXIT WHEN rows_updated = 0; COMMIT;
  END LOOP;
END $$;
```

## Prisma
```bash
npx prisma migrate dev --name add_user_avatar   # create migration
npx prisma migrate deploy                        # apply to production
npx prisma migrate dev --create-only --name add_email_index  # for custom SQL
```

## Drizzle
```bash
npx drizzle-kit generate   # generate from schema
npx drizzle-kit migrate    # apply
npx drizzle-kit push       # dev only, no migration file
```

## Kysely
```bash
kysely migrate make add_user_avatar   # create migration file
kysely migrate latest                 # apply all
kysely migrate down                   # rollback last
```

## Django
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py makemigrations --empty app_name -n description  # custom SQL
```

## golang-migrate
```bash
migrate create -ext sql -dir migrations -seq add_user_avatar
migrate -path migrations -database "$DATABASE_URL" up
```

## Anti-Patterns
| Anti-Pattern | Fix |
|---|---|
| Manual SQL in production | Always use migration files |
| Editing deployed migrations | Create new migration |
| NOT NULL without default | Add nullable, backfill, add constraint |
| Inline index on large table | CREATE INDEX CONCURRENTLY |
| Schema + data in one migration | Separate migrations |
| Dropping column before removing code | Remove code first, drop later |
