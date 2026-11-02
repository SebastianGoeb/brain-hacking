# R-005 Strategy A/B partitioning + comparison — 💤 deferred

Why: the reason the project exists — compare strategies on oneself. Partition an
item set, run strategy A on one half and B on the other, compare retention.

Done when: items can be assigned to an experiment arm (which strategy), the arm
is recorded on every `reviews` row, and a query/view compares outcomes (retention,
latency) across arms.

Status note (deliberately not started): deferred until there's a *working base
worth experimenting on* — a real curriculum, reviewed over enough days that
retention is a question you actually have. Partitioning before that is building
the lab before the subject exists. The spine already records `strategy` per
review, so no data is lost by waiting; the assignment + comparison can be added
later with no schema rewrite. Revisit when daily review is a habit and you want
to know whether a different strategy would help.

Notes: depends on R-002's observation logging being complete (it is). No new schema
needed if R-001's `reviews.strategy` is populated correctly — this is mostly
assignment + analysis queries, which is why the spine matters.
