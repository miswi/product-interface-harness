# Page, component, and visual system

## Choose a page pattern

- **List or queue**: scanning, comparing, filtering, and repeated item actions.
- **Detail**: evidence, history, relationships, complex decisions, and infrequent high-context actions.
- **Dashboard**: monitoring and prioritization; provide paths into work rather than duplicating every operation.
- **Form**: creating or editing attributes with validation.
- **Wizard**: ordered steps with dependencies, save/resume, or progressive disclosure.
- **Timeline**: state history and accountability.

Combine patterns only when each region has a distinct job. Name the page's primary job before choosing layout.

## Reuse components

Use this order:

1. Reuse an existing component unchanged.
2. Extend it with a semantic variant or slot.
3. Create a new component only when behavior or structure is genuinely distinct.

Prefer shared structure with explicit business configuration. Do not clone components because data labels differ. Avoid overly generic components with many unrelated flags.

Specify purpose, anatomy, data contract, variants, states, actions, accessibility, responsive behavior, and usage constraints for every material component.

## Build tokens by meaning

Use a compact hierarchy:

```text
primitive values → semantic tokens → component tokens when needed
```

Name semantic tokens by purpose, such as text, surface, border, focus, danger, success, spacing, typography, radius, elevation, motion, and layering. Use existing project scales when available. Introduce a token only when it represents a reusable decision.

Do not bake a specific brand palette, framework, pixel scale, or domain vocabulary into this reusable skill. Store those values in the Project Profile or project design artifacts.

## Design long and extreme content

- Identify fields likely to contain long names, identifiers, multilingual text, URLs, attachments, or large counts.
- Define wrap, truncation, expansion, tooltip, copy, and full-value access deliberately.
- Never make ellipsis the only way to access critical content.
- Check empty, one-item, dense, overflow, error, loading, disabled, and permission-restricted states.

## Output decisions, not decoration

For every proposed page or component, trace major choices to a task, information need, platform constraint, accessibility requirement, or reusable system rule.
