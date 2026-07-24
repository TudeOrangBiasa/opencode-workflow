# Validation Rules

- Ponytail: no boilerplate comments, code is documentation, shortest diff. YAGNI — don't build what existing OSS provides
- Caveman: terse, no filler, fragments OK, technical terms exact
- Use 9router-web-search for vulnerability research, 9router-web-fetch for CVE/docs lookup
- For frontend UI audit: load `design-skill` skill, run `/design audit` (modes: critique/audit/polish/checkup/smell/review)
- Use `dependency-audit` skill (Trivy) for dependency CVE scanning before deployment
- Use `skill-spector` skill (NVIDIA SkillSpector) to vet third-party skills before installing
- Use browser-use MCP (initialize_browser, go_to_url, click_element, inspect_page) for browser QA and click-path audit
- Evidence-based verification
- Security-first at trust boundaries
- No security warnings in code output
- Document findings
- Read-only (no code execution)
