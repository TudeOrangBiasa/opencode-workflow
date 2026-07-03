# PyTorch Development Patterns — Reference

> Full patterns and examples. See SKILL.md for when-to-use.

## Core Principles

- Device-agnostic code
- Reproducibility with seed setting
- Explicit shape management

## Model Architecture Patterns

Clean nn.Module structure, proper weight initialization.

## Training Loop Patterns

Standard training loop with mixed precision, validation loop with `@torch.no_grad()`.

## Data Pipeline Patterns

Custom Dataset, efficient DataLoader configuration (num_workers, pin_memory, persistent_workers), custom collate_fn for variable-length data.

## Checkpointing Patterns

Save and load complete checkpoints (model, optimizer, epoch, loss), not just state_dict.

## Performance Optimization

- Mixed precision training with GradScaler
- Gradient checkpointing for large models
- `torch.compile` for speed (PyTorch 2.0+)

## Quick Reference: PyTorch Idioms

| Idiom | Description |
|-------|-------------|
| `model.train()` / `model.eval()` | Always set mode before train/eval |
| `torch.no_grad()` | Disable gradients for inference |
| `.to(device)` | Device-agnostic tensor/model placement |
| `torch.amp.autocast` | Mixed precision for 2x speed |
| `pin_memory=True` | Faster CPU→GPU data transfer |
| `torch.compile` | JIT compilation for speed (2.0+) |
| `weights_only=True` | Secure model loading |

## Anti-Patterns to Avoid

- Forgetting `model.eval()` during validation
- In-place operations breaking autograd
- Moving data to GPU inside the training loop (move once)
- Using `.item()` before backward
- Saving entire model with `torch.save(model, ...)` instead of state_dict
