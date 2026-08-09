# Interaction and platform patterns

## Navigation and continuity

- Return to the actual entry context unless completing a flow requires a defined destination.
- Preserve entered data across validation and backward navigation.
- Preserve list filters, sorting, pagination, selection, and scroll after item actions.
- Make deep links and alternate entry points explicit when the same detail can be reached from several surfaces.

## Feedback and recovery

- Show immediate in-place results for lightweight commands.
- Prevent duplicate submission while work is pending.
- Use confirmation when impact is high, scope is broad, or reversal is difficult.
- Explain business errors in actionable language.
- Provide retry, correction, compensation, or escalation paths where appropriate.
- Distinguish initial loading, empty results, filtered-empty results, permission denial, and failure.

## Platform adaptation

Share business semantics, lifecycle commands, component meaning, core tokens, and accessibility rules across platforms. Adapt:

- navigation shape;
- information density;
- touch versus pointer input;
- modal, drawer, sheet, or inline presentation;
- responsive layout and column priority;
- hover behavior and keyboard shortcuts.

Do not assume the same control placement fits mobile and desktop. Preserve the same outcome and legal transition even when the interaction shape differs.

## Accessibility by design

- Ensure keyboard reachability, visible focus, logical order, and programmatic labels.
- Provide sufficient target size and contrast for the platform and standard in scope.
- Do not communicate state only through color.
- Announce asynchronous success, failure, and validation appropriately.
- Respect reduced-motion preferences.

## Interaction specification

For every nontrivial action define default, hover when applicable, focus, pressed, pending, success, failure, disabled, stale, and permission-hidden behavior. State what happens to user context after each outcome.
