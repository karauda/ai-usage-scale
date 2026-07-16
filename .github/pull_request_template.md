## What this changes

<!-- One sentence. -->

## Does it change what a level *means*?

- [ ] **No** — wording, docs, code, a new edge case, a translation.
- [ ] **Yes** — work that used to land on one number now lands on another.

If yes: this invalidates declarations already published against the old definition, so it
is a **breaking change**. Say which levels move, and which real cases change hands.

## Checks

- [ ] `npm test` passes
- [ ] If `spec/levels.json` changed: `npm run badges` was run and `public/badge/` is committed
