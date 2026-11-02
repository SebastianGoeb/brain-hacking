# R-019 Pre-reader / kids curriculum (audio+image, non-text) — 💤 deferred

Why: kids learning Chinese can't learn by English translation — they barely read
English. Needs voice-first, image-based items (cf. Khan Academy Kids). This is a
*separate curriculum*, not a mode toggle: different items, prompts, and answer
interaction — not the same content rendered two ways.

Done when: a curriculum can present audio/image prompts and a non-text answer
interaction (e.g. tap the right picture), review and progress logged as usual.

Notes:
- Content side needs zero core change (subject-agnostic; media via media_url +
  meta). The answer interaction needs R-017 (card interaction type).
- Mandarin audio must be tone-correct — recorded or a good TTS, not a
  wrong-tone robovoice (teaches kids wrong). Source TBD.
- Voice-first pre-literate UI == accessibility basics (audio instructions, big
  tap targets, no reading). In-core, not a separate app.
- Drives audio/image + interaction scope onto the authoring path (R-003/R-021)
  and surfaces the need for per-learner profiles (R-020).
