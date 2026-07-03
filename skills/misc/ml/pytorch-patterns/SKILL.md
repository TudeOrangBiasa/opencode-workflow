---
name: pytorch-patterns
description: Use only when building PyTorch deep learning pipelines — model architecture, training loops, data loading, mixed precision, checkpointing, and GPU optimization.
---

# PyTorch Development Patterns

Adapted from ECC's `pytorch-patterns` skill (MIT).

Idiomatic PyTorch patterns and best practices for building robust, efficient, and reproducible deep learning applications.

## When to Activate

- Writing new PyTorch models or training scripts
- Reviewing deep learning code
- Debugging training loops or data pipelines
- Optimizing GPU memory usage or training speed
- Setting up reproducible experiments

For full patterns, examples, and anti-patterns, see [REFERENCE.md](REFERENCE.md).

## When to Activate

- Writing new PyTorch models or training scripts
- Reviewing deep learning code
- Debugging training loops or data pipelines
- Optimizing GPU memory usage or training speed
- Setting up reproducible experiments

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Core Principles](REFERENCE.md#core-principles) | Device-agnostic, reproducibility, shape management |
| [Model Architecture](REFERENCE.md#model-architecture-patterns) | nn.Module structure, weight initialization |
| [Training Loops](REFERENCE.md#training-loop-patterns) | Training and validation loop patterns |
| [Data Pipeline](REFERENCE.md#data-pipeline-patterns) | Dataset, DataLoader, collate_fn |
| [Checkpointing](REFERENCE.md#checkpointing-patterns) | Save/load with full training state |
| [Performance](REFERENCE.md#performance-optimization) | AMP, gradient checkpointing, torch.compile |
| [Idioms & Anti-Patterns](REFERENCE.md#quick-reference-pytorch-idioms) | Quick reference table, common mistakes |
