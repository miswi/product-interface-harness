---
name: design-interface-system
description: Design or improve product interfaces from validated business tasks through action placement, information architecture, page patterns, reusable components, interaction rules, design tokens, and platform adaptation. Use for UI/UX design, backend operation columns, workflow-step reduction, list-versus-detail decisions, component reuse, responsive behavior, visual-system creation, default visual values, or when an existing function is present but hard to reach; including requests such as “操作列”, “入口太深”, “步骤过多”, “列表还是详情页”, or “对尺寸没概念”. Use `discover-product-model` first when roles, required capabilities, permissions, or legal lifecycle transitions are unknown.
---

# Design Interface System

Translate business intent into efficient, coherent, and reusable interfaces. Do not begin with CSS when task architecture is unresolved.

## Establish the design input

1. Identify the role, object, current state, trigger, intended outcome, frequency, risk, and affected surfaces.
2. Separate current behavior from target behavior. Treat screenshots and code as As-Is evidence.
3. Confirm the legal command and required context. If a required capability or lifecycle rule is unknown, use `discover-product-model` before placing controls.
4. Inspect existing components, tokens, patterns, and technical constraints before creating new ones.

## Design in dependency order

1. **Task architecture**: shorten the critical path and place each semantic command where sufficient context exists.
2. **Information architecture**: group decision inputs, status, actions, history, and supporting detail according to user intent.
3. **Page pattern**: choose list, detail, dashboard, form, wizard, queue, timeline, or hybrid based on work shape.
4. **Component system**: reuse, extend, then create. Keep business semantics separate from visual primitives.
5. **Interaction rules**: define states, validation, confirmation, feedback, recovery, navigation, focus, and keyboard/touch behavior.
6. **Visual system**: define semantic tokens and component variants before page-specific CSS.
7. **Platform adaptation**: preserve business meaning while adapting density, navigation, input, and layout.

Read references progressively:

- For task steps, status commands, operation columns, list/detail placement, bulk actions, or missing/misplaced controls, read `references/task-and-action-architecture.md`.
- For page families, component reuse, and token decisions, read `references/page-component-and-visual-system.md`.
- When no project scale exists or the user asks for concrete starter values, read `references/default-visual-scale.md`.
- For interaction states, navigation, feedback, mobile/desktop adaptation, and accessibility-sensitive design, read `references/interaction-and-platform-patterns.md`.

## Protect business semantics

- Represent lifecycle changes as commands such as publish, withdraw, approve, pause, or reopen—not as an unrestricted status field.
- Expose only legal next commands for the current state and actor.
- Keep independent state dimensions separate even if they appear in one table cell.
- Show consequences before high-impact commands and update all affected surfaces after success.
- Keep filters, pagination, selection, and scroll position after an in-place list action.
- Avoid making a detail page a mandatory toll gate for a frequent, item-scoped command whose decision context is already present.
- Avoid action-column button proliferation; prioritize, group, or move actions based on frequency and risk.
- Account for every confirmed semantic command with a placement decision. Mark commands that intentionally have no user-facing placement explicitly; do not let them disappear from the design inventory.

## Deliver a testable design

Use `assets/interface-design-spec-template.md` for a durable specification, `assets/action-placement-matrix-template.md` when action location is material, `assets/component-spec-template.md` for reusable components, and `assets/design-token-template.md` for a project token system. Include:

- current and target task paths;
- action placement with rationale;
- page and component reuse decisions;
- state, permission, confirmation, feedback, and failure behavior;
- responsive and accessibility requirements;
- affected surfaces and contract dependencies;
- acceptance criteria suitable for `verify-interface-quality`.

Do not implement the interface unless the user requests implementation.

For an active Harness run, record each command's surface, location, and rationale in the design artifact, including explicit findings where legality or placement is unresolved.
