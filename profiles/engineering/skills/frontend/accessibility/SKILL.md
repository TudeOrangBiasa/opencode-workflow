---
name: accessibility
description: Use when frontend accessibility patterns — semantic HTML, ARIA, form labeling, keyboard navigation, focus management, and screen reader support. Use only when building or reviewing interactive UI components and forms.
---

# Accessibility (WCAG 2.2)

Adapted from ECC's `accessibility` skill (MIT).

This skill ensures that digital interfaces are Perceivable, Operable, Understandable, and Robust (POUR) for all users, including those using screen readers, switch controls, or keyboard navigation. It focuses on the technical implementation of WCAG 2.2 success criteria.

## When to Use

- Defining UI component specifications for Web, iOS, or Android.
- Auditing existing code for accessibility barriers or compliance gaps.
- Implementing new WCAG 2.2 standards like Target Size (Minimum) and Focus Appearance.
- Mapping high-level design requirements to technical attributes (ARIA roles, traits, hints).

## Core Concepts

- **POUR Principles**: The foundation of WCAG (Perceivable, Operable, Understandable, Robust).
- **Semantic Mapping**: Using native elements over generic containers to provide built-in accessibility.
- **Accessibility Tree**: The representation of the UI that assistive technologies actually "read."
- **Focus Management**: Controlling the order and visibility of the keyboard/screen reader cursor.
- **Labeling & Hints**: Providing context through `aria-label`, `accessibilityLabel`, and `contentDescription`.

See [REFERENCE.md](REFERENCE.md) for detailed steps, cross-platform mapping, code examples, anti-patterns, checklist, and references.
