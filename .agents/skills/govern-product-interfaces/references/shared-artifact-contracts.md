# Shared artifact contracts

Use these compact artifacts to hand work between the product-interface skills. Create only the artifacts the task needs.

## Evidence labels

Attach one label to every material project fact:

- `confirmed-user`: explicitly stated by the user or an authorized stakeholder.
- `confirmed-source`: stated by an identified authoritative document, schema, API, or policy.
- `observed-as-is`: directly observed in current code, data, screenshot, or running behavior.
- `inferred`: likely but not verified; include the reasoning.
- `proposed`: a target-state design decision.
- `unknown`: required but unavailable.
- `conflict`: sources disagree; identify both sources.

Never silently promote `observed-as-is` or `inferred` to a requirement.

## Project Profile

Keep project facts outside the reusable skills. Record:

- product purpose and scope;
- surfaces and channels;
- roles, permissions, and responsibilities;
- business objects and relationships;
- lifecycle states and legal commands;
- authoritative sources and precedence;
- critical journeys;
- field glossary and semantic distinctions;
- design-system and platform constraints;
- unresolved decisions and evidence labels.

Use the Project Profile template linked directly from the governing `SKILL.md` as the starting structure.

## Specialist handoffs

### Discovery to design

Provide role-task map, entity lifecycle, legal command inventory, critical journeys, As-Is/To-Be gaps, and unresolved questions.

### Discovery or design to contract audit

Provide objects, commands, affected surfaces, intended visibility, source-of-truth candidates, and semantic field definitions.

### Design or audit to verification

Provide acceptance criteria, transition preconditions, expected side effects, surface updates, responsive expectations, and evidence requirements.

## Defect vocabulary

- `missing-action`: a required business command has no usable entry point.
- `misplaced-action`: a command exists but is placed where the task cost or context is inappropriate.
- `illegal-action`: the UI permits a transition forbidden by business rules.
- `ambiguous-action`: the label, scope, or result is unclear.
- `dead-end-workflow`: the user cannot complete a required downstream task.
- `permission-mismatch`: visibility or execution rights conflict with role responsibilities.
- `surface-gap`: intended capability or information is absent from a required surface.
- `contract-drift`: fields, states, meanings, or sources disagree across surfaces.
- `ownership-gap`: a consumed business object has no established accountable role.
- `management-surface-gap`: a mutable consumed object has no maintenance surface.
- `lifecycle-command-gap`: a required correction, reversal, or termination path has no legal command.

## Machine-readable handoff

When the product-interface Harness is active, use the schemas in `product-interface-harness/schemas/` at the repository root. Stable ids must connect evidence, roles, surfaces, objects, commands, findings, coverage rows, placement decisions, and verification checks. A blank relationship must become an explicit finding or unresolved decision; omission is not a valid handoff.
