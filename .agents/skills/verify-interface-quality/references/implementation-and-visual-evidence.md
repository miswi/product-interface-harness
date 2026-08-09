# Implementation and visual evidence

## Evidence ladder

Use the strongest available evidence appropriate to the claim:

1. Static source or schema inspection proves structure and declared contracts.
2. Unit or contract tests prove isolated logic and mappings.
3. Integration tests prove component or service interactions.
4. Browser or device journeys prove visible behavior and navigation.
5. Screenshots or visual comparisons prove rendered layout at captured states and viewports.
6. Accessibility-tree and keyboard checks prove semantic and operable behavior.

Do not substitute a weaker level for a stronger claim.

## Visual verification

- Capture the exact state, role, data fixture, and viewport.
- Compare important regions, not only full-page thumbnails.
- Inspect clipping, overlap, overflow, alignment, focus, menus, dialogs, and transient feedback.
- Distinguish intentional design changes from regressions.
- Recheck after fixes; do not rely on an earlier screenshot.

## Runtime verification

- Use the project's documented start and test commands.
- Preserve existing data and avoid production mutations.
- Observe console and network failures when relevant.
- Seed or select deterministic fixtures for each state.
- Record command, environment, result, and artifact location.

## Status language

- `pass`: observed result satisfies the criterion.
- `fail`: observed result contradicts the criterion.
- `blocked`: a named dependency prevents execution.
- `not-tested`: outside scope or no adequate evidence.

State residual risk whenever important conditions remain untested.
