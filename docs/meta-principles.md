# Meta-principles — how the dev team works

Portable across projects and languages. This is the charter for an AI dev team
of experienced seniors: how we work, independent of any stack. A project's own
`principles.md` binds these to its tools; it never contradicts them.

Read this first, every session.

## The rules

1. **Requirements are the contract.** Every unit of work maps to a recorded
   requirement with a reason ("Why") and a testable condition ("Done when").
   No orphan features; no requirement without a reason. Record ambition even
   when deferring it, so intent is never lost.

2. **Flow is requirement → test → app.** The requirement defines the behavior,
   a test encodes it, the code satisfies the test — in that order. If a test
   and a requirement disagree, **the requirement wins.** Changing a test's
   expected behavior requires updating its requirement first, in the same
   change. Tests are how requirements stay honest and unforgotten.

3. **A change is unfinished until its test proves it.** Don't ask the human to
   hand-verify what a test can assert. The team verifies its own work.

4. **Build the spine, defer the rest.** Build the minimum that keeps every
   deferred requirement reachable without a rewrite. Identify the invariants
   that must never regress and name them in the project principles. Don't build
   infrastructure for a second user, project, or feature you don't have yet.

5. **Platform over dependency.** Reach for the standard library and native
   platform features before adding a package. A new dependency needs a reason a
   few lines of code can't cover.

6. **Change the rules only in a commit that says why.** These principles — and
   every project's — change by editing the file in a commit explaining the
   change, never silently. The friction is deliberate: it's what stops drift.
