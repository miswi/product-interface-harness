# Product-interface Harness contract

Use the Harness for comprehensive audits. It makes coverage and completion mechanically checkable; it does not decide business truth for the agent.

## Run interface

Use the repository-root command:

```text
node product-interface-harness/runtime/harnessctl.mjs start --session <session-id>
node product-interface-harness/runtime/harnessctl.mjs record --session <session-id> --stage <stage> --file <artifact.json>
node product-interface-harness/runtime/harnessctl.mjs validate --session <session-id>
node product-interface-harness/runtime/harnessctl.mjs finalize --session <session-id>
```

When a Hook announces an active run, use the supplied session id. Otherwise choose one stable audit id, start the run explicitly, and keep it for every command.

Required full-audit stages are `discovery`, `contracts`, `design`, and `verification`. Use `product-interface-harness/schemas/artifact-examples.json` as the shape example and the adjacent schemas as the contract.

## Completion rule

Do not deliver a comprehensive result until `finalize` returns `valid: true`. Resolve validation feedback by returning to the named specialist stage. A reported gap, evidence conflict, or unresolved decision is valid coverage; a silently absent row is not.

Use `cancel --reason <reason>` only when the user explicitly abandons or replaces the audit. Do not cancel merely to bypass validation.

## Portability

The Harness Core and schemas are platform-independent. Codex and Claude adapters only translate lifecycle events into the same interface. If Hooks are unavailable, run the interface manually and report that lifecycle enforcement was manual rather than automatic.
