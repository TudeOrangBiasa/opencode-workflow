# UI To Vue — Reference

See [SKILL.md](SKILL.md) for when to use, CLI usage, options, security, and review checklist.

## Inputs

Use an input directory that groups screenshots by module and page state:

```text
screenshots/
|-- HomePage/
|   |-- List/
|   |   |-- HomePage-List-Default@3x.png
|   |   `-- cut-images/
|   |-- cut-images/
|   `-- HomePage-Default@3x.png
`-- cut-images/
```

Supported cut-image directory names: `assets`, `icons`, `sprites`, `cut`, `images`, `cut-images`.

## Conversion Model

- Page grouping: combine related screenshots into one page component when they represent list, detail, form, loading, or empty states.
- UI library mapping: map native visual elements to Vant, Element Plus, or Ant Design Vue components where practical.
- Cut-image priority: prefer page-level assets, then module-level assets, then global shared assets.
- Component extraction: extract repeated UI regions into shared components when they appear more than once.

## API Key Handling

```bash
export DASHSCOPE_API_KEY=your_key
```

If using config file, keep out of version control:

```json
{ "apiKey": "your_dashscope_key", "input": "./designs", "ui": "vant", "output": "./src" }
```

```gitignore
.ui-to-vue.config.json
```

## Troubleshooting

| Issue | Check |
| --- | --- |
| `401` / auth error | Confirm `DASHSCOPE_API_KEY` is set |
| `command not found: ui-to-vue` | Use `npx ui-to-vue-converter@1.0.2` |
| Cut images ignored | Confirm asset dir is nested under matching page |
| Components ignore requested UI lib | Re-run with explicit `--ui` value |
| Layout dimensions wrong | Confirm screenshot export width matches target library baseline |
