# Codebase Onboarding — Reference

## Phase 1: Reconnaissance

Run these checks in parallel:

1. **Package manifest**: package.json, go.mod, Cargo.toml, pyproject.toml, pom.xml, build.gradle, Gemfile, composer.json, mix.exs, pubspec.yaml
2. **Framework fingerprinting**: next.config.*, nuxt.config.*, angular.json, vite.config.*, django settings, flask app factory, fastapi main, rails config
3. **Entry points**: main.*, index.*, app.*, server.*, cmd/, src/main/
4. **Directory snapshot**: top 2 levels (exclude node_modules, vendor, .git, dist, build, __pycache__, .next)
5. **Config/tooling**: .eslintrc*, .prettierrc*, tsconfig.json, Makefile, Dockerfile, docker-compose*, .github/workflows/
6. **Test structure**: tests/, test/, __tests__/, *_test.go, *.spec.ts, pytest.ini, jest.config.*

## Phase 2: Architecture Mapping

**Tech Stack**: language(s), framework(s), databases, ORMs, build tools, CI/CD
**Architecture Pattern**: monolith, monorepo, microservices, serverless; API style
**Key Directories**: map top-level dirs to purpose
**Data Flow**: trace one request from entry → validation → business logic → database

## Phase 3: Convention Detection

**Naming**: file naming, component/class patterns, test file naming
**Code patterns**: error handling style, DI approach, state management, async patterns
**Git conventions**: branch naming, commit style, PR workflow

## Phase 4: Onboarding Artifacts

### Output 1: Onboarding Guide Template

```markdown
# Onboarding Guide: [Project Name]
## Overview
## Tech Stack
| Layer | Technology | Version |
## Architecture
## Key Entry Points
## Directory Map
## Request Lifecycle
## Conventions
## Common Tasks
| I want to... | Look at... |
```

### Output 2: Starter AGENTS.md Template

```markdown
# Project Instructions
## Tech Stack
## Code Style
## Testing
## Build & Run
## Project Structure
## Conventions
```

## Best Practices
1. Don't read everything — use Glob/Grep
2. Verify, don't guess
3. Respect existing AGENTS.md — enhance, don't replace
4. Stay concise — scannable in 2 minutes
5. Flag unknowns honestly

## Anti-Patterns
- AGENTS.md > 100 lines
- Listing every dependency
- Describing obvious directory names
- Copying the README

## Examples

**First time in repo**: Run full 4-phase → Onboarding Guide + AGENTS.md
**Generate AGENTS.md only**: Skip Phase 4 Output 1
**Enhance existing**: Read existing, run Phases 1-3, merge
