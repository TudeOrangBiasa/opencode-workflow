---
name: evm-token-decimals
description: Use when prevent silent decimal mismatch bugs across EVM chains — runtime decimal lookup, chain-aware caching, bridged-token precision drift, and safe normalization. Use only when reading ERC-20 balances, calculating fiat values, or comparing amounts across chains.
---

# EVM Token Decimals

Adapted from ECC's `evm-token-decimals` skill (MIT).

Silent decimal mismatches are one of the easiest ways to ship balances or USD values that are off by orders of magnitude without throwing an error.

## When to Use

- Reading ERC-20 balances in Python, TypeScript, or Solidity
- Calculating fiat values from on-chain balances
- Comparing token amounts across multiple EVM chains
- Handling bridged assets
- Building portfolio trackers, bots, or aggregators

## How It Works

Never assume stablecoins use the same decimals everywhere. Query `decimals()` at runtime, cache by `(chain_id, token_address)`, and use decimal-safe math for value calculations.


See [REFERENCE.md](REFERENCE.md) for detailed content: examples, patterns, anti-patterns, and reference tables.
