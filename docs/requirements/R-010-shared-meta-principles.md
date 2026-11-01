# R-010 Principles auto-load (in-repo) + shared cross-project home — 🔨 partial

Why: principles are worthless if nothing loads them. They must be in context
automatically — every session, and every subagent — without the human
restating anything. Eventually the portable charter should also be reusable
across other projects/machines.

## Done (in-repo, this project)

- `.kiro/steering/principles.md` (`inclusion: always`) loads automatically at
  the start of every Kiro session (default agent) and **inlines** both
  `docs/meta-principles.md` and `docs/principles.md` via `#[[file:...]]`, so the
  actual rules are in context — not merely linked. `docs/` stays the
  human-readable, version-controlled source of truth.
- The steering file carries an explicit rule to **propagate principles into any
  subagent prompt**, since subagents do not inherit steering.

## Deferred (cross-project / cross-machine reuse)

Done when: the portable charter (`docs/meta-principles.md`) lives in one
canonical place reused across projects — most likely global steering
(`~/.kiro/steering/meta-principles.md`, `inclusion: always`) or a global skill.

Not built yet (meta-principle 4): only one project, one machine. Writing global
steering is an out-of-workspace change for a need that doesn't exist yet. Decide
the mechanism when a second project/machine/teammate actually needs it.

## Caveat

If this repo ever runs under a *custom agent*, steering is NOT auto-loaded —
the agent must list it in `resources` (e.g. `file://.kiro/steering/**/*.md`).
"Out of the box" holds for the default agent only.
