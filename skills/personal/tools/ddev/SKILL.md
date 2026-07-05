---
name: ddev
description: DDEV workflow for PHP/Laravel — Composer, Artisan, PHPUnit, database commands. Use when project uses DDEV instead of baremetal PHP.
---

# DDEV Workflow

Use DDEV for PHP/Laravel runtime commands. The user does not run baremetal PHP.

## Rule

If a project has `.ddev/` or the user mentions Laravel/PHP with DDEV, run PHP-side commands through `ddev`.

## Commands

```bash
ddev start
ddev composer install
ddev composer <args>
ddev artisan <args>
ddev exec php <script.php>
ddev exec vendor/bin/pest
ddev exec vendor/bin/phpunit
ddev exec vendor/bin/phpstan analyse
ddev exec vendor/bin/pint --test
ddev mysql
```

## npm

Use baremetal npm unless the project explicitly routes frontend tooling through DDEV.

```bash
npm install
npm run dev
npm run build
npm test
```

## Safety

- Do not run bare `php`, `composer`, `artisan`, `pest`, or `phpunit` on host when DDEV is present.
- Do not commit `.ddev/` unless user explicitly says this project tracks DDEV config.
- Do not assume DDEV is running. Check or start it first when needed.
