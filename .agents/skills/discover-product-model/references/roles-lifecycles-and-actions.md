# Roles, lifecycles, and required actions

## Role-task discovery

For each role, record:

- business outcome and accountability;
- event that starts the work;
- decisions the role must make;
- information required for those decisions;
- commands the role must execute;
- handoff recipient and completion evidence;
- exceptions the role must resolve.

Account names are not sufficient. Two accounts may share a screen while holding different authority.

## Lifecycle model

Model states as business conditions, not colors or labels. For every transition record:

| From | Command | Actor | Preconditions | To | Side effects | Reversible | Audit/notification |
|---|---|---|---|---|---|---|---|

Separate independent state dimensions. Publication, registration availability, review progress, payment, fulfillment, and time-derived status must not be collapsed merely because a screen displays them together.

Prefer commands such as `publish`, `withdraw`, `approve`, or `reopen` over `set status`. Expose only legal next commands.

## Required-action inventory

Derive actions from:

1. Role responsibilities and success outcomes.
2. Lifecycle transitions and reversals.
3. Upstream triggers and downstream handoffs.
4. Exceptions, expiry, rejection, cancellation, and recovery.
5. Compliance, audit, notification, and reconciliation duties.
6. Repetitive work that may require bulk operations.

For each candidate action, require a traceable reason. Do not add generic create/read/update/delete controls without a business outcome.

## Gap classification

- `missing-action`: required command has no usable entry point.
- `misplaced-action`: command exists but task cost or available context makes its location inappropriate.
- `illegal-action`: UI enables a forbidden transition.
- `ambiguous-action`: user cannot predict scope or result.
- `dead-end-workflow`: required next step is unavailable.
- `permission-mismatch`: role can see or execute the wrong capability.
- `state-conflation`: independent lifecycle dimensions are merged.

## Completeness questions

- Can each role start, advance, correct, reverse, and close its responsibility where policy permits?
- Can the role recover from partial failure?
- Does every terminal state have an appropriate follow-up, record, or explanation?
- Are system-derived states protected from arbitrary editing?
- Do side effects reach every required surface and stakeholder?
