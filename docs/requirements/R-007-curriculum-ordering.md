# R-007 Intentional curriculum ordering design — 💤 deferred

Why: HSK-style "10 a day, random order" wastes repetition effects. Curricula
should encode designed sequence, prerequisites, and deliberate spacing/
interleaving for retention (principle 5).

Done when: a curriculum can express ordering + prerequisites (R-001 gives
`position` + `prereq_ids`), and the player can follow that designed order — with
random/scheduler-reordered modes as explicit opt-ins, not the default.

Notes: this is the design-heavy one. The data model (R-001) must not foreclose
it; the actual ordering theory is future work.
