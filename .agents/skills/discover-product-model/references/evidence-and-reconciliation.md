# Evidence and reconciliation

## Evidence labels

Use these labels consistently:

- `confirmed-user`: explicit stakeholder statement.
- `confirmed-source`: authoritative policy, requirement, schema, or API.
- `observed-as-is`: current code, data, test, screenshot, or running behavior.
- `inferred`: reasoned but unverified conclusion.
- `proposed`: target-state choice.
- `unknown`: required evidence unavailable.
- `conflict`: sources disagree.

Include source name or location and relevant date or version when available.

## Precedence is contextual

Determine authority per fact type. A policy may govern eligibility; an API schema may govern transport fields; a product decision may govern target behavior; running code only proves current behavior. Never declare one global source authoritative for every fact.

## Reconciliation table

| Topic | As-Is evidence | Confirmed intent | Inference/proposal | Gap or conflict | Decision needed |
|---|---|---|---|---|---|

## Rules

- Preserve contradictory evidence until resolved.
- Distinguish absence of evidence from evidence of absence.
- Treat old proposals and mockups as historical evidence unless confirmed current.
- Do not convert a screen label into a business definition without corroboration.
- Record semantic collisions, such as two different lifecycle concepts displayed in one status field.
