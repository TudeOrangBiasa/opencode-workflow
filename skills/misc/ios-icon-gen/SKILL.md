---
name: ios-icon-gen
description: Use only when generating iOS app icons — creating all required sizes from a source image, Asset Catalog setup, and App Store compliance.
---

# iOS Icon Generator

Adapted from ECC's `ios-icon-gen` skill (MIT).

Generate PNG icon imagesets for Xcode asset catalogs from two sources.

## When to Activate

- Generating icon assets for an iOS/macOS Xcode project
- Searching for icons across open source collections
- Creating PNG imagesets (1x, 2x, 3x) for asset catalogs
- Replacing placeholder icons with production-quality assets
- Matching existing icon styles in an Xcode project

## Core Principles

### 1. Two Sources, One Output Format
Both sources produce identical Xcode-compatible imagesets. Choose based on need:

| Source | Icons | Requires | Best for |
|--------|-------|----------|----------|
| **Iconify API** | 275,000+ from 200+ collections | Internet | Wide selection, specific styles, open source icons |
| **SF Symbols** | 5,000+ Apple symbols | macOS only | Apple-native style, offline use |

### 2. Always Match Existing Style
Before generating, check the project's existing icons for size, color, and weight consistency.

### 3. Output Structure
Both methods produce a complete Xcode imageset:

```
<output-dir>/<asset-name>.imageset/
  Contents.json
  <asset-name>.png        # 1x (68px default)
  <asset-name>@2x.png     # 2x (136px default)
  <asset-name>@3x.png     # 3x (204px default)
```


See [REFERENCE.md](REFERENCE.md) for detailed content: examples, patterns, anti-patterns, and reference tables.
