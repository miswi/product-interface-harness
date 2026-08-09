# Content, responsive, and accessibility verification

## Content stress set

Use realistic extremes, not meaningless repeated characters:

- empty and missing optional values;
- one item and very large collections;
- long names, identifiers, addresses, organizations, and localized text;
- multiline descriptions, links, attachments, and filenames;
- zero, maximum, overflow, and unusually large numeric values;
- every state label, permission variant, and action combination;
- errors, loading, partial data, and stale data.

Verify wrapping, truncation, full-value access, copy behavior, alignment, row height, and action discoverability.

## Responsive checks

Test supported viewport classes and intermediate widths. Check:

- reflow and content priority;
- tables, sticky regions, drawers, dialogs, and menus;
- operation-column width and overflow behavior;
- touch targets and pointer interactions;
- zoom and text scaling;
- orientation where relevant;
- no clipped confirmation or unreachable action.

## Accessibility checks

Combine automation with keyboard and semantic inspection:

- heading and landmark structure;
- accessible names, roles, values, and descriptions;
- logical focus order and visible focus;
- keyboard execution and dismissal;
- focus placement after dialogs, errors, navigation, and in-place updates;
- status and error announcements;
- contrast and non-color state cues;
- target size and spacing;
- reduced-motion behavior;
- meaningful labels for overflow and icon actions.

Record the applicable standard or project requirement instead of hard-coding one universal compliance claim.
