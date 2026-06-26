---
name: clickhouse-io
description: Use only when working with ClickHouse — table engines, schema design, partitioning, indexing, query optimization, and data ingestion patterns.
---

# ClickHouse Analytics Patterns

Adapted from ECC's `clickhouse-io` skill (MIT).

ClickHouse-specific patterns for high-performance analytics and data engineering.

## When to Activate

- Designing ClickHouse table schemas (MergeTree engine selection)
- Writing analytical queries (aggregations, window functions, joins)
- Optimizing query performance (partition pruning, projections, materialized views)
- Ingesting large volumes of data (batch inserts, Kafka integration)
- Migrating from PostgreSQL/MySQL to ClickHouse for analytics
- Implementing real-time dashboards or time-series analytics

## Overview

ClickHouse is a column-oriented database management system (DBMS) for online analytical processing (OLAP). It's optimized for fast analytical queries on large datasets.

**Key Features:**
- Column-oriented storage
- Data compression
- Parallel query execution
- Distributed queries
- Real-time analytics

See [REFERENCE.md](REFERENCE.md) for table design patterns, query optimization, data insertion, materialized views, performance monitoring, analytics queries, data pipelines, and best practices.
