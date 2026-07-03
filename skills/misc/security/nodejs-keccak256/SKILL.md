---
name: nodejs-keccak256
description: Use only when computing Ethereum hashes in JavaScript/TypeScript — Node's sha3-256 is NIST SHA3, not Ethereum Keccak-256, and silently breaks selectors, signatures, and storage slots.
---

# Node.js Keccak-256

Adapted from ECC's `nodejs-keccak256` skill (MIT).

Ethereum uses Keccak-256, not the NIST-standardized SHA3 variant exposed by Node's `crypto.createHash('sha3-256')`.

## When to Use

- Computing Ethereum function selectors or event topics
- Building EIP-712, signature, Merkle, or storage-slot helpers in JS/TS
- Reviewing any code that hashes Ethereum data with Node crypto directly

See [REFERENCE.md](REFERENCE.md) for full examples (ethers v6, viem, web3.js, common patterns, address derivation) and codebase audit commands.

## Rule

For Ethereum contexts, never use `crypto.createHash('sha3-256')`. Use Keccak-aware helpers from `ethers`, `viem`, `web3`, or another explicit Keccak implementation.
