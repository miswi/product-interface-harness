---
name: audit-surface-contracts
description: Audit consistency and completeness across product surfaces, channels, data sources, fields, states, commands, and permissions. Use when comparing mobile, web, admin, API, search, AI, notification, reporting, import/export, or other touchpoints; when checking frontend/backend field mappings or source-of-truth rules; when a publication or state change must propagate; for requests such as “前后台不一致”, “字段对应”, or “发布后不同步”; or when looking for surface coverage gaps and contract drift. Use `discover-product-model` first if the intended capability or semantics are not established.
---

# Audit Surface Contracts

Find where product meaning or capability breaks across touchpoints. Treat a surface as any place a user or system reads, changes, derives, transmits, or reports the same business object.

## Define the audit boundary

1. Identify the business object, roles, lifecycle dimensions, commands, and intended outcome.
2. Enumerate relevant surfaces: customer clients, staff tools, APIs, databases, search, AI, notifications, reports, exports, integrations, and audit logs.
3. Establish evidence labels and authority per fact type. Current implementation is As-Is evidence, not automatically the target contract.
4. Use `discover-product-model` when the required capability, semantic definition, or legal transition is uncertain.

## Audit capability coverage

Read `references/surface-and-capability-coverage.md` when checking where information or actions should appear.

For each required role-object-state-command combination, compare:

- visibility and discoverability;
- read versus execute capability;
- permissions and legal states;
- input context and confirmation;
- success, failure, and recovery behavior;
- side effects and propagation;
- audit and notification evidence.

For every object discovered on a consumer surface, trace backward to its accountable role, source of truth, management surface, and executable maintenance commands. A readable object with no identifiable writer or responsible surface is a gap even when its current data happens to be populated.

Look for both missing surfaces and missing capabilities inside an existing surface. Do not assume symmetry: different surfaces may intentionally expose different operations.

## Audit field and source contracts

Read `references/field-and-source-contracts.md` when fields, data sources, derived states, or synchronization are involved.

Compare semantic meaning before comparing field names. Record source, owner, type, cardinality, nullability, allowed values, derivation, mutability, validation, visibility, privacy, update direction, and conflict behavior.

Separate:

- operator-controlled lifecycle state;
- time- or rule-derived display state;
- workflow progress;
- availability or capacity;
- presentation labels.

## Classify findings

- `surface-gap`: required information or command is absent from a required touchpoint.
- `contract-drift`: meaning, type, values, or transformation disagree.
- `source-conflict`: two writers or authorities can produce incompatible values.
- `stale-propagation`: a successful command does not update required consumers.
- `permission-drift`: surfaces enforce different authority.
- `state-conflation`: independent state dimensions are merged.
- `orphan-field` or `orphan-capability`: implemented but unsupported by the target model.
- `ownership-gap`: a business object has no established accountable role.
- `management-surface-gap`: a mutable object is consumed but has no maintenance surface.
- `lifecycle-command-gap`: a required correction, reversal, or termination transition has no legal command.

Distinguish intentional asymmetry from defects and cite the rule that justifies it.

## Deliver

Use `assets/surface-coverage-matrix-template.md` and `assets/field-contract-template.md` when durable artifacts are needed. Lead with material gaps and include:

- audit boundary and evidence;
- required versus observed coverage;
- semantic field and state mappings;
- source ownership and propagation path;
- severity, affected roles, and consequence;
- proposed contract or escalation decision;
- acceptance criteria for `verify-interface-quality`.

Do not change schemas, APIs, or interfaces unless the user asks for implementation.

For an active Harness run, record one coverage row for every discovered object-surface pair. Never omit an uncovered pair; represent it with a finding and evidence status.
