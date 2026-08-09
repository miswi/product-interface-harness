# Product-interface task Harness

## Purpose

Make comprehensive product-interface audits observable and mechanically complete without encoding project-specific product answers. The Harness checks whether every discovered object, role, lifecycle command, surface, placement decision, finding, and verification result is accounted for. Specialist Skills remain responsible for semantic reasoning.

## External interface

`runtime/harnessctl.mjs` is the single interface for agents, Hooks, tests, and CI:

```text
start     Create or resume a session-scoped run.
record    Record one specialist stage artifact.
status    Read compact run state.
validate  Return deterministic coverage failures.
finalize  Mark a valid run complete.
cancel    End a run only with an explicit abandonment reason.
```

The implementation owns file layout, atomic writes, state transitions, trace entries, and validation. Host adapters must not duplicate those rules.

## States

```text
active → needs-attention → active → complete
   └──────────────────────────────→ cancelled
```

A full audit requires `discovery`, `contracts`, `design`, and `verification`. Missing capability is allowed only when represented as an evidence-backed finding or unresolved business decision. Missing rows are never treated as success.

## Storage

Runtime state lives under `.product-interface-harness/runs/` and is excluded from version control. It contains prompts and evidence summaries, so it must not be used as a permanent knowledge base. Durable product facts remain in project documentation; reusable behavior remains in Skills, schemas, validators, and eval fixtures.

## Hook adapters

Codex and Claude adapters start a run only for explicit `govern-product-interfaces` invocation. This prevents general conversations about audits from activating a completion gate. Both adapters call the same Harness implementation.

Hook definitions are host-specific:

- Codex: `.codex/hooks.json`
- Claude Code: `.claude/settings.json`

If a host does not support Hooks, the governing Skill runs `harnessctl` manually and reports that lifecycle enforcement was manual.

## Evaluation integrity

`evals/fixtures/known/` contains disclosed structural failures. `cross-domain/` tests transfer without project terminology. `negative-controls/` protects against indiscriminate findings. `blind/` intentionally contains no expected answer in this repository while the held-out issue remains undisclosed.

Structural evals validate the deterministic Harness, not the model's semantic discovery ability. Semantic forward tests must use fresh agent sessions, raw artifacts, multiple trials, and a protected blind holdout.
