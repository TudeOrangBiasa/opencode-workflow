---
name: ui-to-vue
description: Use only when converting UI mockups, screenshots, or designs into Vue components — composition API, script setup, reactive state, and Tailwind/component libraries.
---

# UI To Vue

Adapted from ECC's `ui-to-vue` skill (MIT).

Batch-convert UI design screenshots into Vue 3 Composition API component code.

## When to Use

Vue 3 project with design screenshots → first pass of page components + router wiring.

## When Not to Use

Single screenshot for bespoke component | Non-Vue project | Complex interaction logic | Private customer data.

## Inputs

Group screenshots by module and page state. See [REFERENCE.md](REFERENCE.md) for directory structure.

## Conversion Model

See [REFERENCE.md](REFERENCE.md) for details on page grouping, UI library mapping, cut-image priority, and component extraction.

## CLI Usage

Run the converter with `npx` so the documented command works without relying on a global binary:

```bash
export DASHSCOPE_API_KEY=your_key
npx ui-to-vue-converter@1.0.2 --input ./screenshots --ui vant --output ./src
```

For desktop UI libraries:

```bash
npx ui-to-vue-converter@1.0.2 --input ./designs --ui element-plus --output ./src
npx ui-to-vue-converter@1.0.2 --input ./designs --ui antd-vue --output ./src
```

If the package is installed globally, the `ui-to-vue` binary can be used directly:

```bash
npm install -g ui-to-vue-converter@1.0.2
ui-to-vue --input ./screenshots --ui vant --output ./src
```

## Options

| Option | Description | Default |
| --- | --- | --- |
| `--input` | Design image directory | `./screenshots` |
| `--ui` | UI library: `vant`, `element-plus`, or `antd-vue` | `vant` |
| `--output` | Output directory | `./src` |
| `--config` | Config file path | `./.ui-to-vue.config.json` |

## API Key Handling

Use `export DASHSCOPE_API_KEY=your_key`. Keep config files out of version control.

## Security and Privacy

Treat screenshots as external. Pin converter version. Review generated code before committing.

## Output Review Checklist

- [ ] Page components in `views/`, repeated regions extracted
- [ ] Router compatible, UI library consistent, passes lint/build

## Troubleshooting

See [REFERENCE.md](REFERENCE.md) for troubleshooting table.

## References

npm: `ui-to-vue-converter`
