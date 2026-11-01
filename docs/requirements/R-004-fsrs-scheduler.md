# R-004 Real scheduler (SM-2) + due-queue filtering — ✅ done

Why: the stub showed every card every time — not spaced repetition. A real
scheduler with interval growth + a due queue is what makes reviews actually
space out, and it's what starts generating meaningful observation data. SM-2 is
the classic, dependency-free baseline (the thing FSRS is measured against).

Done when:
- An `sm2` scheduler implements the `Scheduler` interface: grade → updated
  interval/ease → `next_due`, following SM-2 (again resets, higher grades grow
  the interval by ease factor). Behind the registry like every strategy. ✅
- The player reviews only **due** items (`next_due <= now` or never reviewed),
  in `position` order, instead of all items unconditionally. ✅
- Scheduler history comes from the item's own `reviews` rows so intervals grow
  across sessions. ✅ (required adding `reviews.grade` — migration 0003.)

✅ verified by e2e: two due cards → grade both (sm2) → rows written with future
next_due → queue empty on reload.

Spine invariant: behind the interface; writes a complete observation row
(strategy=`sm2`, grade persisted). SM-2 logic has a runnable self-check
(`npx tsx src/lib/scheduler.ts`).

Notes: FSRS specifically, and comparing it on real data, is R-014.
