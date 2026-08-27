# History, Hash, and Back/Forward Evidence

Date: 2026-08-27

## Ownership

- Phase-4 remains the only semantic hash/history destination resolver.
- Phase-6 stores only the versioned semantic `StoryChapterId` envelope; it does
  not store pixels or normalized progress as history identity.
- Canonical hashes are read from `STORY_CHAPTER_BY_ID`. Arbitrary fragments are
  never converted to selectors.

## Write policy

| Event | Browser history action |
|---|---|
| initial bootstrap | existing Phase-4 `replaceState` only |
| passive semantic chapter boundary | namespaced `replaceState` and canonical hash |
| completed explicit header traversal | namespaced `pushState` and canonical hash |
| same-position header activation | no append; canonical current entry remains coherent |
| canceled/superseded traversal | no append; current semantic entry may be passively replaced |
| Back/Forward/popstate | position through Phase-4 with writes suppressed |

Passive scrolling changed semantic state and hash without increasing
`history.length`. Two completed header targets increased it by exactly two.
Back and Forward restored About/Services and their hashes without changing the
length. The retained Phase-5 branch deep-link test now waits for traversal
`completed` before asserting the successful-navigation hash, then verifies
Back/Forward through Phase 4.

Terminal chapters have no canonical hash. Their passive URL builder clears a
stale hash while preserving path and query. Foreign top-level `history.state`
fields remain preserved by `mergeStoryHistoryState`.
