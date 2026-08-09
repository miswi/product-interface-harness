# Field and source contracts

## Define semantic fields

Compare meaning before spelling. Map aliases only after confirming they represent the same concept.

For each field record:

- semantic definition and business owner;
- authoritative source for that fact type;
- producer and consumers;
- type, format, cardinality, and nullability;
- allowed values or referenced vocabulary;
- operator-entered, system-derived, imported, or aggregated status;
- validation and transformation;
- mutability and legal command that changes it;
- visibility, sensitivity, and retention;
- update direction, latency, retry, and conflict handling.

## Separate state dimensions

Do not collapse independent concepts into one generic status. Typical dimensions include:

- publication or exposure lifecycle;
- application, review, or fulfillment workflow;
- time-derived phase;
- availability, quota, or capacity;
- payment or settlement;
- compliance or restriction;
- presentation label.

A display label may derive from several source fields. Document the derivation instead of making the label writable.

## Trace commands through data

For each command, trace:

```text
entry surface → authorization → validation → authoritative write → side effects → consumers → visible confirmation → audit record
```

Check partial failure and stale concurrency. Specify whether updates are synchronous, eventually consistent, retried, or compensating.

## Detect drift

- Same name, different meaning.
- Different names, same meaning without mapping.
- Client-local state that competes with an authoritative record.
- Derived field accepted as writable input.
- Enum values or null behavior differ by surface.
- Update succeeds in the writer but remains stale elsewhere.
- Sensitive or internal fields leak to an unintended consumer.
