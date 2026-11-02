# R-017 Pluggable card interaction / grader type — 💤 deferred

Why: "how a card is answered and graded" is a swappable strategy, like
scheduling. Today's only mode is reveal → self-rate. Two independent features
push on this same seam: interactive coding tasks (type a solution, check it) and
kids/pre-reader cards (hear a prompt, tap a picture). Two unrelated motivations
for one abstraction = the abstraction is real.

Done when: card presentation+grading sits behind an interface; self-rated recall
is impl #1; a second impl (client-side interactive, or tap/audio) drops in
without a player rewrite. The produced grade still flows into the Scheduler and
a complete `reviews` row (unchanged spine).

Notes: do NOT build the abstraction's machinery with one impl — that's a
speculative interface. The near-term obligation is only to keep the current
reveal+grade UI factored behind a clear boundary so impl #2 is addable, not to
pave it now. Client-side graders keep the no-server constraint; remote grading
is R-018.
