#!/usr/bin/env bash
set -euo pipefail

# Links only the active workflow skills to ~/.config/opencode/skills.

REPO="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$HOME/.config/opencode/skills"

ACTIVE_SKILLS=(
  skills/engineering/diagnose
  skills/engineering/grill-with-docs
  skills/engineering/triage
  skills/engineering/improve-codebase-architecture
  skills/engineering/setup-matt-pocock-skills
  skills/engineering/tdd
  skills/engineering/to-issues
  skills/engineering/to-prd
  skills/engineering/zoom-out
  skills/engineering/prototype
  skills/engineering/review
  skills/misc/accessibility
  skills/misc/ai-regression-testing
  skills/misc/android-clean-architecture
  skills/misc/angular-developer
  skills/misc/api-connector-builder
  skills/misc/api-design
  skills/misc/architecture-decision-records
  skills/misc/backend-patterns
  skills/misc/bun-runtime
  skills/misc/canary-watch
  skills/misc/click-path-audit
  skills/misc/clickhouse-io
  skills/misc/codebase-onboarding
  skills/misc/coding-standards
  skills/misc/compose-multiplatform-patterns
  skills/misc/context-budget
  skills/misc/cpp-coding-standards
  skills/misc/cpp-testing
  skills/misc/csharp-testing
  skills/misc/dart-flutter-patterns
  skills/misc/data-scraper-agent
  skills/misc/database-migrations
  skills/misc/database-review
  skills/misc/deep-research
  skills/misc/defi-amm-security
  skills/misc/deployment-patterns
  skills/misc/design-system
  skills/misc/django-celery
  skills/misc/django-patterns
  skills/misc/django-security
  skills/misc/django-tdd
  skills/misc/django-verification
  skills/misc/docker-patterns
  skills/misc/dotnet-patterns
  skills/misc/error-handling
  skills/misc/evm-token-decimals
  skills/misc/fastapi-patterns
  skills/misc/flox-environments
  skills/misc/flutter-dart-code-review
  skills/misc/fsharp-testing
  skills/misc/git-workflow
  skills/misc/github-ops
  skills/misc/golang-patterns
  skills/misc/golang-testing
  skills/misc/hexagonal-architecture
  skills/misc/ios-icon-gen
  skills/misc/java-coding-standards
  skills/misc/jpa-patterns
  skills/misc/kotlin-coroutines-flows
  skills/misc/kotlin-exposed-patterns
  skills/misc/kotlin-ktor-patterns
  skills/misc/kotlin-patterns
  skills/misc/kotlin-testing
  skills/misc/kubernetes-patterns
  skills/misc/laravel-patterns
  skills/misc/laravel-security
  skills/misc/laravel-verification
  skills/misc/mcp-server-patterns
  skills/misc/mysql-patterns
  skills/misc/modular-monolith-patterns
  skills/misc/nestjs-patterns
  skills/misc/nextjs-turbopack
  skills/misc/nodejs-keccak256
  skills/misc/nuxt4-patterns
  skills/misc/perl-patterns
  skills/misc/perl-security
  skills/misc/perl-testing
  skills/misc/php-review
  skills/misc/postgres-patterns
  skills/misc/prediction-market-risk-review
  skills/misc/prisma-patterns
  skills/misc/production-audit
  skills/misc/python-patterns
  skills/misc/python-testing
  skills/misc/pytorch-patterns
  skills/misc/quarkus-patterns
  skills/misc/quarkus-security
  skills/misc/quarkus-tdd
  skills/misc/quarkus-verification
  skills/misc/react-patterns
  skills/misc/react-performance
  skills/misc/react-testing
  skills/misc/redis-patterns
  skills/misc/rust-patterns
  skills/misc/rust-testing
  skills/misc/search-first
  skills/misc/security-bounty-hunter
  skills/misc/security-review
  skills/misc/shared-hosting-deployment
  skills/misc/springboot-patterns
  skills/misc/springboot-security
  skills/misc/springboot-tdd
  skills/misc/springboot-verification
  skills/misc/swift-actor-persistence
  skills/misc/swift-concurrency-6-2
  skills/misc/swift-protocol-di-testing
  skills/misc/swiftui-patterns
  skills/misc/team-handoff-quality
  skills/misc/ui-to-vue
  skills/misc/verify-evidence
  skills/misc/vite-patterns
  skills/productivity/grill-me
  skills/productivity/handoff
  skills/productivity/write-a-skill
  skills/personal/eval
  skills/personal/openviking
  skills/personal/ddev
  skills/personal/idea-fragments
)

# If the destination is a symlink that resolves into this repo, we'd end up
# writing the per-skill symlinks back into the repo's own skills/ tree. Detect
# and bail out instead of polluting the working copy.
if [ -L "$DEST" ]; then
  resolved="$(readlink -f "$DEST")"
  case "$resolved" in
    "$REPO"|"$REPO"/*)
      echo "error: $DEST is a symlink into this repo ($resolved)." >&2
      echo "Remove it (rm \"$DEST\") and re-run; the script will recreate it as a real dir." >&2
      exit 1
      ;;
  esac
fi

mkdir -p "$DEST"

for relative in "${ACTIVE_SKILLS[@]}"; do
  src="$REPO/$relative"
  name="$(basename "$src")"
  target="$DEST/$name"

  if [ ! -f "$src/SKILL.md" ]; then
    echo "error: missing $src/SKILL.md" >&2
    exit 1
  fi

  if [ -e "$target" ] && [ ! -L "$target" ]; then
    echo "error: $target exists and is not a symlink" >&2
    exit 1
  fi

  ln -sfn "$src" "$target"
  echo "linked $name -> $src"
done
