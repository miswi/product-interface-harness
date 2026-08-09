---
name: govern-product-interfaces
description: Route and govern broad product-interface work across business discovery, interaction and visual-system design, cross-surface contract auditing, and quality verification. Use when a request spans several of those concerns, asks for a full product/UI audit or redesign, provides mixed evidence such as requirements plus screenshots plus code, uses phrases such as “整体评估” or “全面审查”, or is too ambiguous to assign safely to one specialist skill. Do not use for a narrowly scoped task that clearly belongs to one specialist.
---

# Govern Product Interfaces

Coordinate product-interface work without loading every method at once. Preserve the distinction between reusable methods and project facts.

## Route the request

1. Read repository instructions and identify the available evidence: user statements, history, requirements, screenshots, code, schemas, tests, and live behavior.
2. Classify the request before proposing UI:
   - Reconstruct roles, objects, lifecycle, required actions, or missing capabilities: use `discover-product-model`.
   - Design task paths, action placement, information architecture, page patterns, components, tokens, or platform adaptations: use `design-interface-system`.
   - Compare surfaces, sources, fields, states, and capability coverage: use `audit-surface-contracts`.
   - Verify journeys, transitions, content resilience, accessibility, responsive behavior, or implementation quality: use `verify-interface-quality`.
3. Invoke only the specialists needed. For a broad completeness audit, run discovery, contracts, design, and verification in dependency order. For a focused request, invoke one specialist directly.
4. Exchange artifacts using `references/shared-artifact-contracts.md`. Never pass undocumented assumptions as confirmed facts.

## Enforce broad audits

Read `references/harness-contract.md` whenever the request asks for a comprehensive, complete, overall, end-to-end, or cross-surface audit, or when an active Harness run is announced in context.

For a broad audit:

1. Use the active product-interface Harness run or start one as described in the reference.
2. Complete the ownership closure for every consumer-visible object: accountable role, management surface, or an explicit finding.
3. Complete the lifecycle closure for every creatable object: correction, reversal, and termination paths where legal, or an explicit finding or unresolved decision.
4. Complete surface coverage and action-placement decisions for every discovered object and semantic command.
5. Record specialist artifacts and run final validation before delivering. Do not claim comprehensive completion while the Harness reports an unaccounted row.

## Apply governing rules

- Treat business outcomes and role responsibilities as higher priority than existing screens.
- Separate **As-Is**, **To-Be**, and **Gap**. Existing code proves current behavior, not desired behavior.
- Treat screenshots and prototypes as evidence, not as complete requirements.
- Look for both an existing capability placed badly and a required capability missing entirely.
- Treat a blank owner, management surface, lifecycle exit, or command entry point as a finding to resolve, not as permission to omit the row.
- Keep project-specific entities, terminology, status values, permissions, fields, and brand values in a Project Profile, not in these skills.
- When a durable Project Profile is needed, copy `assets/project-profile-template.md` into the project's own documentation area and populate it with evidence labels.
- Name an authoritative source only after verifying it. Do not assume the backend, mobile client, database, or document is always authoritative.
- Prefer semantic business commands over arbitrary state editing.
- Ask for clarification only when uncertainty materially changes the proposed workflow, permissions, or risk. Otherwise proceed and label the inference.

## Control scope

Do not turn every concern into a separate skill. Keep a concern inside a specialist when it shares the same inputs, reasoning loop, and output. Split only when the task can be requested independently and has a distinct output contract.

Do not implement product changes unless the user asks for implementation. For review or design requests, return evidence-backed findings and specifications.

## Deliver

Lead with the decision or highest-risk gap. Include:

- evidence and confidence;
- affected role, object, state, surface, and task;
- current path and target path when behavior changes;
- missing, misplaced, illegal, ambiguous, or dead-end actions;
- unresolved business decisions;
- which specialist outputs were produced;
- verification required before acceptance.
- Harness validation status for broad audits.

For skill evaluation or a claimed generalization result, read `references/evaluation-protocol.md` and protect blind-test integrity.
