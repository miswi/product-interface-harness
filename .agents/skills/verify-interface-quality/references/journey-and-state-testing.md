# Journey and state testing

## Build a journey test

For each critical journey specify:

```text
actor + starting state + trigger + entry surface + command path + expected result + side effects + continuation
```

Measure task continuity as well as step count. Verify that the user retains list filters, selection, pagination, scroll, draft input, and navigation context where the design requires it.

## Transition coverage

For every command test:

- allowed actor and state;
- forbidden actor and state;
- unmet precondition;
- success and resulting state;
- repeat submission and idempotency where applicable;
- stale concurrent state;
- network or server failure;
- reversal or compensation when supported;
- audit and notification evidence;
- visibility and propagation to required consumers.

Do not test a generic status picker when the contract defines semantic commands. Verify that illegal transitions are unavailable rather than merely rejected late.

## Action-entry tests

- The dominant routine action is discoverable at its specified entry point.
- The action label predicts the business result.
- Secondary and risky actions are grouped without becoming invisible.
- Confirmation states scope and consequence where required.
- Success updates the current context without unnecessary navigation.
- Failure preserves work and offers a valid recovery path.
- Operation columns remain usable across representative rows and permissions.

## Cross-surface propagation

After a successful command, verify each required consumer independently. Include user-facing discovery, staff views, search or AI context, notifications, reports, exports, and audit trails when in scope. Record expected consistency delay and retry behavior.
