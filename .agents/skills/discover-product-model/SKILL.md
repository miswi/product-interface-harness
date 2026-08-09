---
name: discover-product-model
description: Reconstruct and sharpen a product model from requirements, conversation history, screenshots, prototypes, code, schemas, tests, and stakeholder statements. Use when roles, business objects, lifecycle states, legal actions, critical journeys, permissions, or requirements are incomplete or contradictory; when auditing whether a business function is missing; for requests such as “业务功能缺失”, “少了某个操作”, or “状态流程不完整”; or before interface design would otherwise copy an incomplete current UI. Produces evidence-labeled As-Is, To-Be, and gap artifacts rather than visual styling.
---

# Discover Product Model

Build the smallest defensible business model needed for the requested interface decision. Do not treat the current UI as the complete product definition.

## Gather evidence

1. Read repository instructions before inspecting project artifacts. In a CodeGraph-indexed repository, use CodeGraph before text search for code questions.
2. Establish source precedence for this task. Record user-confirmed requirements, authoritative policies or schemas, current implementation, tests, screenshots, and historical proposals separately.
3. Label material facts using `references/evidence-and-reconciliation.md`.
4. Inspect enough upstream and downstream context to understand the business result, not only the named page.

## Model the business

1. Identify roles by responsibility, goal, permission, and accountability—not merely account labels.
2. Identify business objects, relationships, ownership, and durable identifiers.
3. For each relevant object, model lifecycle states and semantic commands. A command must state actor, preconditions, effect, next state, side effects, reversibility, audit requirements, and affected surfaces.
4. Map critical journeys from trigger to observable success outcome.
5. Inventory required actions from role responsibilities and lifecycle obligations. Do not infer completeness from buttons that already exist.
6. For every object visible on a consumer surface, identify its accountable role and management surface. If either cannot be established, record an `ownership-gap`, `management-surface-gap`, or unresolved business decision; never leave the mapping silently blank.
7. For every creatable object, examine correction, reversal, and termination paths across pre-publication, active, referenced, and historical states. Do not assume generic deletion is legal, but always account for how erroneous or obsolete records leave active work.

Read `references/roles-lifecycles-and-actions.md` whenever the task concerns business-function completeness, workflow, status, permissions, an operation column, or a missing action.

## Reconcile reality and intent

Create three distinct views:

- **As-Is**: what current artifacts demonstrably implement.
- **To-Be**: confirmed requirements plus clearly labeled proposals.
- **Gap**: missing, misplaced, illegal, ambiguous, dead-end, permission, or evidence conflicts.

When sources conflict, expose the conflict. Do not silently select the newest-looking document or the current code. Ask only when the choice would materially change scope, permissions, legal transitions, or irreversible behavior.

## Audit negative space

For every critical role-object-state combination, ask:

- What outcome must this role achieve here?
- Which command enables it?
- Where can it be discovered and executed?
- What happens when the normal path fails, expires, is rejected, or must be reversed?
- What downstream work starts after success?
- Is the capability absent, or merely hidden behind an unnecessary path?
- Who is accountable for maintaining every object exposed to another role or channel, and where can that maintenance happen?
- How can a newly created object be corrected, withdrawn, terminated, or retained as history in each materially different reference state?

Do not add speculative CRUD operations. A required action must trace to a goal, responsibility, lifecycle obligation, policy, or observed downstream dependency.

## Deliver

Use `assets/business-model-template.md` when a durable artifact is requested. Otherwise return the relevant subset:

- evidence register and conflicts;
- role-task map;
- object and lifecycle model;
- legal command inventory;
- critical journeys;
- As-Is/To-Be/gap table;
- unresolved decisions with consequence and owner.

For an active Harness run, encode roles, surfaces, objects, commands, evidence, and findings in the discovery artifact. Use semantic command purposes `correct`, `reverse`, and `terminate` so lifecycle completeness can be checked without relying on domain-specific command names.

Hand confirmed and proposed artifacts to `design-interface-system`; hand cross-surface or data-source questions to `audit-surface-contracts`.
