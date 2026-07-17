---
name: defi-amm-security
description: Use when security checklist for Solidity AMM contracts — reentrancy, CEI ordering, donation/inflation attacks, oracle manipulation, slippage, admin controls, and safe reserve math. Use only when writing or auditing AMM, LP vault, or swap contracts.
---

# DeFi AMM Security

Adapted from ECC's `defi-amm-security` skill (MIT).

Critical vulnerability patterns and hardened implementations for Solidity AMM contracts, LP vaults, and swap functions.

## When to Use

- Writing or auditing a Solidity AMM or liquidity-pool contract
- Implementing swap, deposit, withdraw, mint, or burn flows that hold token balances
- Reviewing any contract that uses `token.balanceOf(address(this))` in share or reserve math
- Adding fee setters, pausers, oracle updates, or other admin functions to a DeFi protocol

## How It Works

Use this as a checklist-plus-pattern library. Review every user entrypoint against the categories below and prefer the hardened examples over hand-rolled variants.

See [REFERENCE.md](REFERENCE.md) for full code examples (reentrancy, donation attacks, oracle manipulation, slippage, safe math, admin controls), security checklist, and audit tools.
