# Angular Developer — Reference

## Execution Rules for New Projects

1. **Version check**: If user requests specific version, use `npx @angular/cli@<version> new`. Else, check local CLI with `ng version`. If not found, fallback to `npx @angular/cli@latest new`.
2. **Prefer Signal Forms** for new projects when target version supports them.
3. **Run `ng build`** after generating code to verify.

## Components Reference

- **Fundamentals**: See [references/components.md](references/components.md)
- **Inputs**: See [references/inputs.md](references/inputs.md)
- **Outputs**: See [references/outputs.md](references/outputs.md)
- **Host Elements**: See [references/host-elements.md](references/host-elements.md)

## Reactivity & Data Management

- **Signals Overview**: See [references/signals-overview.md](references/signals-overview.md)
- **linkedSignal**: See [references/linked-signal.md](references/linked-signal.md)
- **resource**: See [references/resource.md](references/resource.md)
- **effect**: See [references/effects.md](references/effects.md)

## Forms

- **Signal Forms** (preferred for new apps): See [references/signal-forms.md](references/signal-forms.md)
- **Template-driven forms**: See [references/template-driven-forms.md](references/template-driven-forms.md)
- **Reactive forms**: See [references/reactive-forms.md](references/reactive-forms.md)

## Dependency Injection

- **Fundamentals**: See [references/di-fundamentals.md](references/di-fundamentals.md)
- **Creating Services**: See [references/creating-services.md](references/creating-services.md)
- **Defining Providers**: See [references/defining-providers.md](references/defining-providers.md)
- **Injection Context**: See [references/injection-context.md](references/injection-context.md)
- **Hierarchical Injectors**: See [references/hierarchical-injectors.md](references/hierarchical-injectors.md)

## Angular Aria

Building accessible custom components (Accordion, Listbox, Combobox, Menu, Tabs, Toolbar, Tree, Grid): See [references/angular-aria.md](references/angular-aria.md)

## Routing

- **Define Routes**: See [references/define-routes.md](references/define-routes.md)
- **Loading Strategies**: See [references/loading-strategies.md](references/loading-strategies.md)
- **Outlets**: See [references/show-routes-with-outlets.md](references/show-routes-with-outlets.md)
- **Navigation**: See [references/navigate-to-routes.md](references/navigate-to-routes.md)
- **Route Guards**: See [references/route-guards.md](references/route-guards.md)
- **Data Resolvers**: See [references/data-resolvers.md](references/data-resolvers.md)
- **Router Lifecycle**: See [references/router-lifecycle.md](references/router-lifecycle.md)
- **Rendering Strategies**: See [references/rendering-strategies.md](references/rendering-strategies.md)
- **Route Animations**: See [references/route-animations.md](references/route-animations.md)

## Styling & Animations

- **Tailwind CSS**: See [references/tailwind-css.md](references/tailwind-css.md)
- **Angular Animations**: See [references/angular-animations.md](references/angular-animations.md)
- **Component Styling**: See [references/component-styling.md](references/component-styling.md)

## Testing

- **Fundamentals**: See [references/testing-fundamentals.md](references/testing-fundamentals.md)
- **Component Harnesses**: See [references/component-harnesses.md](references/component-harnesses.md)
- **Router Testing**: See [references/router-testing.md](references/router-testing.md)
- **E2E Testing**: See [references/e2e-testing.md](references/e2e-testing.md)

## Tooling

- **Angular CLI**: See [references/cli.md](references/cli.md)
- **Angular MCP Server**: See [references/mcp.md](references/mcp.md)

## Anti-Patterns

- Using `null`/`undefined` as initial signal form field values — use `''`, `0`, or `[]`
- Accessing form field state flags without calling the field first: `form.field.valid()` — use `form.field().valid()`
- Starting new forms with older form APIs when Signal Forms are supported
- Setting `min`, `max`, `value`, `disabled`, or `readonly` HTML attributes on `[formField]` inputs
- Calling `inject()` outside an injection context
- Using `effect()` for derived state that should use `computed()`
- Referencing `$parent.$index` in nested `@for` loops — use `let outerIdx = $index`

## Related Skills

- `tdd-workflow`
- `security-review`
- `frontend-patterns`
