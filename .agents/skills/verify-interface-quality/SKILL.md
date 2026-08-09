---
name: verify-interface-quality
description: Verify product-interface quality against business journeys and design contracts using static inspection, behavioral testing, content stress, responsive and visual checks, accessibility checks, and cross-surface propagation evidence. Use after a design or implementation change, for UI acceptance testing, when validating state transitions or operation-column behavior, or for requests such as “交互测试”, “长文本测试”, “响应式检查”, or “无障碍检查”. Reports evidence and residual risk; it does not claim success from code inspection alone when runtime behavior matters.
---

# Verify Interface Quality

Verify the highest-risk product outcomes first. A polished screenshot does not prove that a role can complete its work.

## Establish the contract

1. Identify roles, critical journeys, lifecycle commands, legal states, permissions, side effects, affected surfaces, and acceptance criteria.
2. Mark absent criteria as unknown. Use `discover-product-model` for unclear business rules and `design-interface-system` for unresolved interaction decisions.
3. Inventory available evidence and tools: code, tests, fixtures, browser runtime, screenshots, logs, schemas, accessibility tree, and visual baselines.
4. Choose verification depth based on consequence, not implementation size.

## Verify in risk order

1. **Business journey**: the responsible role can reach and complete the intended outcome without a dead end.
2. **State and permission**: only legal commands appear and succeed; stale, forbidden, repeated, and failed commands behave safely.
3. **Propagation**: successful changes reach every required surface, derived state, notification, and audit record.
4. **Interaction**: pending, success, failure, retry, confirmation, focus, and context preservation match the contract.
5. **Content and responsive resilience**: extreme values and target viewports remain usable.
6. **Accessibility**: structure, names, roles, focus, keyboard/touch operation, contrast, and announcements are adequate.
7. **Visual consistency**: components and tokens match approved patterns without clipping, overlap, or unintended drift.

For a broad audit, include a check for every material discovery finding. A check may be `blocked` or `not-tested`, but it must name the missing evidence or environment rather than silently disappearing.

Read progressively:

- For user journeys, legal transitions, permissions, concurrency, and propagation, read `references/journey-and-state-testing.md`.
- For long content, responsive behavior, and accessibility, read `references/content-responsive-and-accessibility.md`.
- For static/runtime evidence and visual verification, read `references/implementation-and-visual-evidence.md`.

## Use evidence honestly

- Prefer existing project test commands and browser tooling when safe and relevant.
- Inspect runtime behavior when the claim depends on navigation, layout, focus, or asynchronous state.
- Capture before/after evidence for state-changing journeys.
- Distinguish `pass`, `fail`, `blocked`, and `not-tested`.
- Never report a visual or behavioral pass solely because the source appears correct.
- Do not modify product code during a review-only request.

## Deliver

Use `assets/verification-report-template.md` for durable results. Lead with failed core outcomes, then include:

- scope, environment, and contract source;
- test cases by role, state, and surface;
- observed versus expected behavior;
- evidence links or commands;
- severity and likely defect class;
- untested areas and residual risk;
- concise remediation direction without silently implementing it.

For an active Harness run, record checks with stable ids, methods, statuses, and referenced finding ids in the verification artifact.
