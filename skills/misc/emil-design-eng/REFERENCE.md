# Emil Design Engineering — Reference

See [SKILL.md](SKILL.md) for quick start, core philosophy, review format, and checklist.

## Animation Decision Framework

### 1. Should this animate at all?

**Ask:** How often will users see this animation?

| Frequency | Decision |
| --- | --- |
| 100+ times/day (keyboard shortcuts, command palette toggle) | No animation. Ever. |
| Tens of times/day (hover effects, list navigation) | Remove or drastically reduce |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare/first-time (onboarding, feedback forms, celebrations) | Can add delight |

**Never animate keyboard-initiated actions.** These actions are repeated hundreds of times daily. Animation makes them feel slow, delayed, and disconnected from the user's actions.

Raycast has no open/close animation. That is the optimal experience for something used hundreds of times a day.

### 2. What is the purpose?

Every animation must have a clear answer to "why does this animate?"

Valid purposes:
- **Spatial consistency**: toast enters and exits from the same direction, making swipe-to-dismiss feel intuitive
- **State indication**: a morphing feedback button shows the state change
- **Explanation**: a marketing animation that shows how a feature works
- **Feedback**: a button scales down on press, confirming the interface heard the user
- **Preventing jarring changes**: elements appearing or disappearing without transition feel broken

If the purpose is just "it looks cool" and the user will see it often, don't animate.

### 3. What easing should it use?

Is the element entering or exiting?
  Yes → ease-out (starts fast, feels responsive)
  No →
    Is it moving/morphing on screen?
      Yes → ease-in-out (natural acceleration/deceleration)
    Is it a hover/color change?
      Yes → ease
    Is it constant motion (marquee, progress bar)?
      Yes → linear
    Default → ease-out

**Critical: use custom easing curves.** The built-in CSS easings are too weak. They lack the punch that makes animations feel intentional.

```css
/* Strong ease-out for UI interactions */
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);

/* Strong ease-in-out for on-screen movement */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);

/* iOS-like drawer curve (from Ionic Framework) */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
```

**Never use ease-in for UI animations.** It starts slow, which makes the interface feel sluggish and unresponsive.

**Easing curve resources:** Don't create curves from scratch. Use [easing.dev](https://easing.dev/) or [easings.co](https://easings.co/) to find stronger custom variants of standard easings.

### 4. How fast should it be?

| Element | Duration |
| --- | --- |
| Button press feedback | 100-160ms |
| Tooltips, small popovers | 125-200ms |
| Dropdowns, selects | 150-250ms |
| Modals, drawers | 200-500ms |
| Marketing/explanatory | Can be longer |

**Rule: UI animations should stay under 300ms.** A 180ms dropdown feels more responsive than a 400ms one. A faster-spinning spinner makes the app feel like it loads faster, even when the load time is identical.

### Perceived performance

Speed in animation is not just about feeling snappy — it directly affects how users perceive your app's performance:
- A **fast-spinning spinner** makes loading feel faster (same load time, different perception)
- A **180ms select** animation feels more responsive than a **400ms** one
- **Instant tooltips** after the first one is open (skip delay + skip animation) make the whole toolbar feel faster

The perception of speed matters as much as actual speed. Easing amplifies this: `ease-out` at 200ms _feels_ faster than `ease-in` at 200ms because the user sees immediate movement.

## Spring Animations

Springs feel more natural than duration-based animations because they simulate real physics. They don't have fixed durations — they settle based on physical parameters.

### When to use springs
- Drag interactions with momentum
- Elements that should feel "alive" (like Apple's Dynamic Island)
- Gestures that can be interrupted mid-animation
- Decorative mouse-tracking interactions

### Spring-based mouse interactions

Tying visual changes directly to mouse position feels artificial because it lacks motion. Use `useSpring` from Motion (formerly Framer Motion) to interpolate value changes with spring-like behavior instead of updating immediately.

```jsx
import { useSpring } from 'framer-motion';

// Without spring: feels artificial, instant
const rotation = mouseX * 0.1;

// With spring: feels natural, has momentum
const springRotation = useSpring(mouseX * 0.1, {
  stiffness: 100,
  damping: 10,
});
```

### Spring configuration

**Apple's approach (recommended — easier to reason about):**
```js
{ type: "spring", duration: 0.5, bounce: 0.2 }
```

**Traditional physics (more control):**
```js
{ type: "spring", mass: 1, stiffness: 100, damping: 10 }
```

Keep bounce subtle (0.1-0.3) when used. Avoid bounce in most UI contexts. Use it for drag-to-dismiss and playful interactions.

### Interruptibility advantage

Springs maintain velocity when interrupted — CSS animations and keyframes restart from zero. This makes springs ideal for gestures users might change mid-motion.

## Component Building Principles

### Buttons must feel responsive

Add `transform: scale(0.97)` on `:active`. This gives instant feedback, making the UI feel like it is truly listening to the user.

```css
.button {
  transition: transform 160ms ease-out;
}
.button:active {
  transform: scale(0.97);
}
```

### Never animate from scale(0)

Nothing in the real world disappears and reappears completely. Elements animating from `scale(0)` look like they come out of nowhere.
Start from `scale(0.9)` or higher, combined with opacity.

```css
/* Bad */
.entering { transform: scale(0); }

/* Good */
.entering { transform: scale(0.95); opacity: 0; }
```

### Make popovers origin-aware

Popovers should scale in from their trigger, not from center. **Exception: modals** — modals should keep `transform-origin: center`.

```css
.popover { transform-origin: var(--radix-popover-content-transform-origin); }
```

### Tooltips: skip delay on subsequent hovers

```css
.tooltip[data-instant] { transition-duration: 0ms; }
```

### Use CSS transitions over keyframes for interruptible UI

CSS transitions can be interrupted and retargeted mid-animation. Keyframes restart from zero. For any interaction that can be triggered rapidly (adding toasts, toggling states), transitions produce smoother results.

### Use blur to mask imperfect transitions

When a crossfade between two states feels off despite trying different easings and durations, add subtle `filter: blur(2px)` during the transition.

Keep blur under 20px. Heavy blur is expensive, especially in Safari.

### Animate enter states with @starting-style

The modern CSS way to animate element entry without JavaScript:
```css
.toast {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 400ms ease, transform 400ms ease;
  @starting-style {
    opacity: 0;
    transform: translateY(100%);
  }
}
```

## CSS Transform Mastery

### translateY with percentages

Percentage values in `translate()` are relative to the element's own size. Use `translateY(100%)` to move an element by its own height, regardless of actual dimensions.

### scale() scales children too

Unlike `width`/`height`, `scale()` also scales an element's children. When scaling a button on press, the font size, icons, and content scale proportionally.

### 3D transforms for depth

`rotateX()`, `rotateY()` with `transform-style: preserve-3d` create real 3D effects in CSS.

```css
@keyframes orbit {
  from { transform: translate(-50%, -50%) rotateY(0deg) translateZ(72px) rotateY(360deg); }
  to   { transform: translate(-50%, -50%) rotateY(360deg) translateZ(72px) rotateY(0deg); }
}
```

### transform-origin

Every element has an anchor point from which transforms execute. Set it to match where the trigger lives.

## clip-path for Animation

`clip-path` is not just for shapes. It is one of the most powerful animation tools in CSS.

### The inset shape

`clip-path: inset(top right bottom left)` defines a rectangular clipping region. Each value "eats" into the element from that side.

```css
.hidden  { clip-path: inset(0 100% 0 0); }
.visible { clip-path: inset(0 0 0 0); }
```

### Patterns

- **Tabs with perfect color transitions**: Duplicate the tab list. Style the copy as "active". Clip the copy so only the active tab is visible. Animate the clip on tab change.
- **Hold-to-delete**: Use `clip-path: inset(0 100% 0 0)` on a colored overlay. On `:active`, transition to `inset(0 0 0 0)` over 2s with linear timing.
- **Image reveals on scroll**: Start with `clip-path: inset(0 0 100% 0)`. Animate to `inset(0 0 0 0)` when the element enters the viewport.
- **Comparison sliders**: Overlay two images. Clip the top one with `clip-path: inset(0 50% 0 0)`. Adjust the right inset based on drag position.

## Gesture and Drag Interactions

### Momentum-based dismissal
Don't require dragging past a threshold. Calculate velocity: `Math.abs(dragDistance) / elapsedTime`. If velocity exceeds ~0.11, dismiss regardless of distance.

```js
const velocity = Math.abs(swipeAmount) / timeTaken;
if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) { dismiss(); }
```

### Damping at boundaries
When a user drags past the natural boundary, apply damping. The more they drag, the less the element moves.

### Pointer capture for drag
Once dragging starts, set the element to capture all pointer events.

### Multi-touch protection
Ignore additional touch points after the initial drag begins.

```js
function onPress() { if (isDragging) return; }
```

### Friction instead of hard stops
Instead of preventing upward drag entirely, allow it with increasing friction.

## Performance Rules

### Only animate transform and opacity
These properties skip layout and paint, running on the GPU.

### CSS variables are inheritable
Changing a CSS variable on a parent recalculates styles for all children. Update `transform` directly on the element instead.

```js
// Bad: triggers recalc on all children
element.style.setProperty('--swipe-amount', `${distance}px`);

// Good: only affects this element
element.style.transform = `translateY(${distance}px)`;
```

### Framer Motion hardware acceleration caveat
Framer Motion's shorthand properties (`x`, `y`, `scale`) are NOT hardware-accelerated. They use `requestAnimationFrame` on the main thread.

```jsx
// NOT hardware accelerated
<motion.div animate={{ x: 100 }} />

// Hardware accelerated
<motion.div animate={{ transform: "translateX(100px)" }} />
```

### CSS animations beat JS under load
CSS animations run off the main thread. When the browser is busy, CSS animations remain smooth. Use CSS for predetermined animations; JS for dynamic, interruptible ones.

### Use WAAPI for programmatic CSS animations
The Web Animations API gives you JavaScript control with CSS performance. Hardware-accelerated, interruptible, and no library needed.

```js
element.animate([{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0 0)'}], {
  duration: 1000, fill: 'forwards',
  easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
});
```

## Accessibility

### prefers-reduced-motion
Animations can cause motion sickness. Keep opacity and color transitions that aid comprehension. Remove movement and position animations.

```css
@media (prefers-reduced-motion: reduce) {
  .element { animation: fade 0.2s ease; }
}
```

### Touch device hover states
```css
@media (hover: hover) and (pointer: fine) {
  .element:hover { transform: scale(1.05); }
}
```

## The Sonner Principles

These principles come from building Sonner (13M+ weekly npm downloads) and apply to any component:

1. **Developer experience is key.** No hooks, no context, no complex setup.
2. **Good defaults matter more than options.** Ship beautiful out of the box.
3. **Naming creates identity.** Sacrifice discoverability for memorability.
4. **Handle edge cases invisibly.** Pause toast timers when the tab is hidden.
5. **Use transitions, not keyframes, for dynamic UI.**
6. **Build a great documentation site.** Interactive examples lower the barrier.

### Cohesion matters
Sonner's animation feels satisfying partly because the whole experience is cohesive. Easing and duration fit the vibe of the library. Match the motion to the mood.

### The opacity + height combination
When items enter and exit a list, the opacity change must work well with the height animation. Adjust until it feels right.

### Review your work the next day
Review animations with fresh eyes. You notice imperfections the next day that you missed during development.

### Asymmetric enter/exit timing
Pressing should be slow where deliberate (hold-to-delete: 2s linear), release always snappy (200ms ease-out).

```css
.overlay { transition: clip-path 200ms ease-out; }
.button:active .overlay { transition: clip-path 2s linear; }
```

## Stagger Animations

When multiple elements enter together, stagger their appearance. Each element animates in with a small delay.

```css
.item:nth-child(1) { animation-delay: 0ms; }
.item:nth-child(2) { animation-delay: 50ms; }
.item:nth-child(3) { animation-delay: 100ms; }
.item:nth-child(4) { animation-delay: 150ms; }
```

Keep stagger delays short (30-80ms between items). Stagger is decorative — never block interaction while stagger animations are playing.

## Debugging Animations

### Slow motion testing
Play animations at reduced speed (2-5x normal duration) or use browser DevTools animation inspector.

### Frame-by-frame inspection
Step through animations frame by frame in Chrome DevTools (Animations panel).

### Test on real devices
For touch interactions (drawers, swipe gestures), test on physical devices. Connect your phone via USB.
