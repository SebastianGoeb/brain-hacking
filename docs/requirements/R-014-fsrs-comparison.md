# R-014 FSRS scheduler + compare against baselines — 💤 deferred

Why: FSRS is the modern scheduler to beat — but comparing it only means
something once there's real review data (R-004 generates that) and the A/B
partitioning to run arms side by side (R-005).

Done when: an `fsrs` scheduler implements the `Scheduler` interface and can be
assigned as an experiment arm (R-005), with a query comparing retention/latency
against `sm2` on the same item set.

Notes: may use a ready FSRS lib or a hand-rolled version — the whole point is
comparison, possibly ours vs. the reference. Either way, behind the interface.
Candidate for Rust/WASM if JS perf becomes a bottleneck. Build after R-004 has
produced data and R-005 exists.
