# Surface and capability coverage

## Build the surface map

Include any touchpoint that consumes or changes the object:

- end-user mobile, web, kiosk, or native clients;
- staff administration, review queues, and operational tools;
- APIs, integrations, imports, and exports;
- search indexes and recommendation or AI contexts;
- notifications, messages, and scheduled jobs;
- reports, analytics, audit logs, and archival views.

## Compare capabilities, not identical screens

For each surface, record:

| Dimension | Questions |
|---|---|
| Audience | Who uses or consumes it? |
| Purpose | What outcome does this surface support? |
| Visibility | Which objects, states, and fields appear? |
| Commands | Which legal commands can start here? |
| Authority | What permission and policy governs them? |
| Propagation | What must update after a command? |
| Failure | How are stale, partial, or rejected results handled? |

Expect intentional asymmetry. A customer surface may read while an operations surface commands; a search index may expose only published objects. Require an explicit business or privacy reason for the difference.

## Audit negative space

- Does every role responsibility have a usable surface and entry point?
- Does every lifecycle command have an owner and execution path?
- Does every published or withdrawn object update all discovery surfaces?
- Can a user reach supporting records created by an operation?
- Are exception, cancellation, expiry, and recovery paths represented?
- Does a surface display a state but omit the action its responsible role routinely needs?
- Is a capability present on one surface only because another implementation forgot it?

Escalate to `discover-product-model` when the expected capability cannot be justified from the business model.

## Severity

- **Critical**: illegal exposure, data/privacy risk, irreversible incorrect command, or blocked core outcome.
- **High**: required action absent, major state propagation failure, or role cannot complete work.
- **Medium**: excessive task cost, inconsistent semantics, weak recovery, or confusing asymmetry.
- **Low**: cosmetic or low-frequency inconsistency with limited consequence.
