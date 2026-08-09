# Task and action architecture

## Start from the command

For every material action, capture:

| Attribute | Question |
|---|---|
| Outcome | What business result does the user intend? |
| Scope | One item, selected items, a collection, or the whole system? |
| Frequency | Routine, occasional, or exceptional? |
| Context | What must be seen before deciding? |
| Legality | In which states and for which actors is it allowed? |
| Risk | What is the consequence of error? |
| Reversibility | Can it be undone or compensated? |
| Side effects | Which records, surfaces, people, or processes change? |
| Feedback | What proves success or explains failure? |

## Choose placement

| Placement | Use when | Avoid when |
|---|---|---|
| Row action | Item-scoped, frequent, context is visible, transition is legal | Requires deep evidence or many parameters |
| Overflow menu | Item-scoped but secondary, conditional, or higher risk | It is the dominant routine task |
| Bulk toolbar | Same command applies safely to selected items | Items may have incompatible states or effects |
| Detail page | Decision needs history, evidence, relationships, or complex consequences | Detail adds no decision context |
| Edit form | Changing descriptive or configured attributes | Executing a lifecycle command |
| Dedicated flow | Multi-step, regulated, cross-object, or recoverable process | One safe command is sufficient |
| Page-level action | Creates/imports/exports or affects the collection | Action belongs to one row |

Placement is a consequence of task shape, not a universal preference for fewer clicks.

## Measure the path

Record:

```text
trigger → locate object → inspect context → invoke command → confirm → receive feedback → continue work
```

Flag unnecessary navigation, repeated lookup, context loss, duplicated confirmation, and forced re-entry. A shorter path is better only when legality, comprehension, and error prevention remain intact.

## Design state commands

- Show a semantic next action, not a free-form status picker.
- Filter commands by actor, current state, preconditions, and time-dependent rules.
- Distinguish system-derived state from operator-controlled state.
- For risky commands, summarize scope and consequences in confirmation.
- Define stale-state handling when another user changes the record first.
- Record actor, time, reason, and before/after state when auditability matters.

## Manage operation columns

1. Keep the dominant routine action visible.
2. Keep commonly paired navigation visible when space permits.
3. Put secondary or risky actions in a labeled overflow menu.
4. Prefer a contextual action whose label changes by legal state over several permanently visible disabled buttons.
5. Do not use unlabeled icons for unfamiliar business commands.
6. Consider a batch toolbar when operators repeat the same safe action across rows.
7. Preserve stable column width and responsive behavior.

## Detect anti-patterns

- **Detail toll gate**: a list contains enough decision context but forces navigation for a simple command.
- **Status-as-data**: lifecycle control is hidden inside an edit form as though it were ordinary metadata.
- **Button farm**: every possible command is visible in every row.
- **False simplification**: a dangerous or evidence-heavy command is moved inline solely to reduce clicks.
- **State conflation**: publication, availability, review, time, or fulfillment states are merged.
- **Silent side effect**: the command changes other surfaces without preview or confirmation.
- **Orphan action**: UI control exists without a role responsibility or legal transition.

## Acceptance criteria pattern

Specify actor, precondition, entry point, command, confirmation, success state, side effects, error/recovery, audit evidence, and required surface updates. Avoid criteria that only describe button color or location.
