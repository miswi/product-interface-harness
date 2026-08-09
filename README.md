# Product Interface Harness

A reusable, cross-domain Harness Engineering toolkit for auditing product-interface completeness, action placement, lifecycle coverage, permissions, and cross-surface consistency.

It combines five composable Agent Skills with a deterministic runtime, host-specific Hooks, schemas, tests, and evaluation fixtures. The Skills perform semantic product reasoning; the Harness makes required coverage, evidence, validation, feedback, and completion conditions observable and enforceable.

## Included Skills

- `govern-product-interfaces`: orchestrates comprehensive audits and the Harness lifecycle.
- `discover-product-model`: reconstructs roles, objects, ownership, lifecycles, commands, and critical journeys.
- `audit-surface-contracts`: checks data, state, command, permission, and source consistency across surfaces.
- `design-interface-system`: designs action placement, information architecture, interaction rules, components, and visual contracts.
- `verify-interface-quality`: verifies journeys, states, implementation behavior, responsiveness, accessibility, and cross-surface propagation.

The specialist Skills can be invoked independently. Use `$govern-product-interfaces` when the request requires a broad audit spanning all four stages.

## Repository Layout

```text
.agents/skills/                 Agent Skills
.codex/hooks.json               Codex Hook configuration
.claude/settings.json           Claude Code Hook configuration
product-interface-harness/      Runtime, adapters, schemas, tests, and evals
.product-interface-harness/     Local run-state boundary (records are ignored)
.github/workflows/              Deterministic CI checks
```

Runtime records may contain prompts and evidence summaries. Never commit or share `.product-interface-harness/runs/`.

## Requirements

- Node.js 20 or later
- A host that supports Agent Skills
- Optional Hook support in Codex or Claude Code; without Hooks, the governing Skill uses the same CLI manually

## Use in a Product Repository

Merge these paths into the target repository root:

```text
.agents/skills/{govern-product-interfaces,discover-product-model,audit-surface-contracts,design-interface-system,verify-interface-quality}
product-interface-harness/
.product-interface-harness/
.codex/hooks.json
.claude/settings.json
```

If the target already has Hook configuration, merge the `UserPromptSubmit` and `Stop` entries instead of overwriting the file. Copy or merge the scripts from `package.json`, then restart or open a fresh agent task so the host reloads project Hooks.

Invoke a comprehensive audit explicitly:

```text
使用 $govern-product-interfaces，结合项目资料和实现，全面审查业务功能完整性与操作入口合理性。不要预设问题。
```

The prompt Hook starts a session-scoped run only for an explicit governing-Skill invocation. The Stop Hook blocks completion until discovery, contract audit, design accounting, and verification artifacts satisfy the Harness contracts.

## Validate

```bash
npm run check:harness
```

This runs Skill structure validation, runtime tests, cross-domain fixtures, known failure cases, and negative controls. The `evals/fixtures/blind/` directory intentionally contains no expected answer; semantic blind evaluation should use fresh tasks and protected holdouts.

## Workflow Boundaries

This repository governs product understanding and interface completeness. Specification and ticket-generation tools can follow it without conflict:

```text
audit and Harness validation -> human decision -> specification -> tickets -> implementation -> verification
```

Finalize the active Harness run before switching to downstream planning tools; otherwise the completion Hook correctly reports unfinished audit stages.

See [architecture](product-interface-harness/ARCHITECTURE.md) for the runtime boundary and state model.
