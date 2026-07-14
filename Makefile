# OpenCode Workflow Kit — Makefile
# Personal dotfiles + workflow pipeline. Use for common tasks.

.PHONY: help install test audit clean docs hooks

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

install: ## Run link-skills
	./scripts/link-skills.sh

hooks: ## Install pre-commit hook
	./scripts/install-hooks.sh

test: ## Run all skill structure + portability checks
	@./scripts/check-skill-structure.sh
	@./scripts/check-portable.sh

audit: ## Audit a specific skill (usage: make audit SKILL=skills/engineering/skill-author)
	@./scripts/audit-skill.sh $(SKILL)

docs: ## List all project docs
	@find docs -name "*.md" -type f | sort

clean: ## Remove pre-commit hook and backup files
	@rm -f .git/hooks/pre-commit
	@rm -rf .scratch/backup
	@echo "Cleaned"

.DEFAULT_GOAL := help
