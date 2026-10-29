# R-004 FSRS scheduler implementation — 💤 deferred

Why: FSRS is one scheduling strategy to compare — likely the baseline to beat.
It is *an* implementation of the `Scheduler` interface (R-002), not the engine.

Done when: an `FsrsScheduler` implements the same interface as every other
scheduler and can be selected per curriculum/experiment arm.

Notes: may use a ready FSRS lib or a hand-rolled version — the point is to
compare, possibly our own against the reference. Either way it hides behind the
interface. Candidate for Rust/WASM later if JS perf becomes a bottleneck.
