# Default visual scale

Use this only when the project has no established scale and no supplied brand system. Treat it as a coherent starting point, then test with actual content and platform constraints. Do not override an existing system silently.

## Spacing

Use a 4 px base with an 8 px rhythm:

```text
0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64
```

Prefer 8 or 16 within components, 24 between related groups, and 32–48 between page sections. Use 2 or 4 only for tight optical adjustments.

## Typography

Starter web scale:

| Role | Size | Line height | Typical weight |
|---|---:|---:|---:|
| Caption | 12 | 18 | 400–500 |
| Dense metadata | 13 | 20 | 400–500 |
| Body compact | 14 | 22 | 400 |
| Body comfortable | 16 | 24 | 400 |
| Section heading | 20 | 28 | 600 |
| Page heading | 24 | 32 | 600–700 |
| Display | 32 | 40 | 600–700 |

Prefer fewer roles over page-specific sizes. Verify text scaling and language-specific line height.

## Controls and targets

- Compact desktop control: 32 px high.
- Default desktop control: 40 px high.
- Comfortable or touch-oriented control: at least 44 px high.
- Keep icon-only controls large enough to operate and give them accessible names.

## Radius

```text
small 4, medium 8, large 12, panel 16, pill 9999
```

Use fewer levels when the product should feel formal or dense. Do not round every container independently.

## Elevation

Use borders and surface contrast before shadows. A starter set:

```css
--shadow-sm: 0 1px 2px rgb(15 23 42 / 0.08);
--shadow-md: 0 6px 18px rgb(15 23 42 / 0.12);
--shadow-lg: 0 16px 40px rgb(15 23 42 / 0.16);
```

Reserve stronger elevation for temporary layers such as menus and dialogs.

## Motion

```text
fast 120ms, standard 180ms, deliberate 240ms
```

Use standard easing for state feedback and deceleration for entering layers. Respect reduced-motion preferences.

## Layout breakpoints

If the technical stack provides none, start evaluation around 480, 768, 1024, and 1280 px, then place actual breakpoints where content fails rather than treating these numbers as device truth.

## Color

Derive brand and semantic colors from project identity and required contrast. When no identity exists, begin with a restrained neutral scale plus one primary accent and distinct success, warning, danger, and information semantics. Validate every text/background and control-state pairing; do not copy a universal palette merely to fill tokens.

## Tokenize the decisions

Express accepted values as primitive and semantic tokens. Do not scatter these starter numbers through page CSS.
