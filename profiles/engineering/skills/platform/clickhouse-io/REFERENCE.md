# ClickHouse — Reference

## Table Engines

### MergeTree
```sql
CREATE TABLE markets_analytics (
    date Date, market_id String, market_name String, volume UInt64,
    trades UInt32, unique_traders UInt32, avg_trade_size Float64, created_at DateTime
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (date, market_id)
SETTINGS index_granularity = 8192;
```

### ReplacingMergeTree (deduplication)
```sql
CREATE TABLE user_events (
    event_id String, user_id String, event_type String, timestamp DateTime, properties String
) ENGINE = ReplacingMergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (user_id, event_id, timestamp);
```

### AggregatingMergeTree (pre-aggregation)
```sql
CREATE TABLE market_stats_hourly (
    hour DateTime, market_id String,
    total_volume AggregateFunction(sum, UInt64),
    total_trades AggregateFunction(count, UInt32),
    unique_users AggregateFunction(uniq, String)
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(hour)
ORDER BY (hour, market_id);
```

## Query Optimization

### Efficient Filtering (indexed columns first)
```sql
SELECT * FROM markets_analytics WHERE date >= '2025-01-01' AND market_id = 'market-123' AND volume > 1000 ORDER BY date DESC LIMIT 100;
```

### Aggregations
```sql
SELECT toStartOfDay(created_at) AS day, market_id, sum(volume) AS total_volume, count() AS total_trades, uniq(trader_id) AS unique_traders FROM trades GROUP BY day, market_id ORDER BY day DESC;
-- Percentiles: quantile(0.50), quantile(0.95), quantile(0.99)
```

### Window Functions
```sql
SELECT date, market_id, volume, sum(volume) OVER (PARTITION BY market_id ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_volume FROM markets_analytics;
```

## Data Insertion

### Bulk Insert (recommended)
```typescript
const clickhouse = new ClickHouse({ url: process.env.CLICKHOUSE_URL, port: 8123, basicAuth: { ... } });
const values = trades.map(t => `('${t.id}','${t.market_id}','${t.user_id}',${t.amount},'${t.timestamp}')`).join(',');
await clickhouse.query(`INSERT INTO trades (id, market_id, user_id, amount, timestamp) VALUES ${values}`).toPromise();
```

### Streaming Insert
```typescript
const stream = clickhouse.insert('trades').stream();
for await (const batch of dataSource) stream.write(batch);
await stream.end();
```

## Materialized Views

```sql
CREATE MATERIALIZED VIEW market_stats_hourly_mv TO market_stats_hourly AS
SELECT toStartOfHour(timestamp) AS hour, market_id, sumState(amount) AS total_volume, countState() AS total_trades, uniqState(user_id) AS unique_users FROM trades GROUP BY hour, market_id;
```

## Performance Monitoring

```sql
-- Slow queries
SELECT query_id, user, query, query_duration_ms, read_rows, read_bytes, memory_usage FROM system.query_log WHERE type = 'QueryFinish' AND query_duration_ms > 1000 ORDER BY query_duration_ms DESC LIMIT 10;
-- Table sizes
SELECT database, table, formatReadableSize(sum(bytes)) AS size, sum(rows) AS rows FROM system.parts WHERE active GROUP BY database, table ORDER BY sum(bytes) DESC;
```

## Common Analytics Queries

### Time Series / Retention
```sql
SELECT toDate(timestamp) AS date, uniq(user_id) AS daily_active_users FROM events WHERE timestamp >= today() - INTERVAL 30 DAY GROUP BY date ORDER BY date;
```

### Funnel
```sql
SELECT countIf(step='viewed_market') AS viewed, countIf(step='completed_trade') AS completed, round(completed/viewed*100,2) AS rate FROM (SELECT user_id, session_id, event_type AS step FROM events WHERE event_date = today()) GROUP BY session_id;
```

## Best Practices
1. **Partitioning**: by time (month or day), avoid too many partitions
2. **Ordering key**: most-filtered columns first, high cardinality first
3. **Data types**: smallest appropriate type, LowCardinality for repeated strings, Enum for categorical
4. **Avoid**: SELECT *, FINAL, too many JOINs, small frequent inserts
5. **Monitor**: query performance, disk usage, merge operations
