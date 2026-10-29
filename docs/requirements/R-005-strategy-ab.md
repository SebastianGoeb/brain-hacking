# R-005 Strategy A/B partitioning + comparison — 💤 deferred

Why: the reason the project exists — compare strategies on oneself. Partition an
item set, run strategy A on one half and B on the other, compare retention.

Done when: items can be assigned to an experiment arm (which strategy), the arm
is recorded on every `reviews` row, and a query/view compares outcomes (retention,
latency) across arms.

Notes: depends on R-002's observation logging being complete. No new schema
needed if R-001's `reviews.strategy` is populated correctly — this is mostly
assignment + analysis queries, which is why the spine matters.
