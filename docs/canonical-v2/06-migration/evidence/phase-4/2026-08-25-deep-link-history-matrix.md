# Deep-Link and History Matrix

## State envelope

```ts
history.state.__wflyerStoryV2 = {
  version: 1,
  chapterId: StoryChapterId,
};
```

Foreign and Next.js-owned top-level state fields are preserved. Physical
coordinates, progress, hashes, paths, and external URLs are not stored.

| Scenario | Resolution | Positioning | History mutation |
|---|---|---|---|
| direct semantic root proxy | Home | before reveal | merge current entry with `replaceState` |
| valid landing hash | manifest chapter | before reveal; no Home traversal | merge current entry with `replaceState` |
| invalid nonempty hash | Home | best current projection | no URL rewrite; current semantic envelope may be refreshed |
| valid version-1 restoration | stored typed chapter | before reveal | current entry only |
| stale/foreign restoration | ignored | Home | foreign fields preserved |
| same-session refresh | same resolver priority | before near-immediate reveal | no appended entry |
| browser-native header fragment in the lab | explicit manifest hash | one coalesced reconciliation | browser owns its fragment entry; bootstrap does not append |
| Back/Forward | current hash, then validated event state, then Home | immediate adapter call | none |
| canceled/failed later traversal | future Phase-6 concern | n/a | no entry by contract |

`hashchange` and `popstate` are coalesced into one semantic reconciliation,
with `popstate` state taking precedence when both describe one browser action.
The aggregate three-engine browser run verified two explicit fragment entries,
Back, Forward, restored chapters, unchanged history length, and no bootstrap
append.

Phase 6 remains the owner of later passive `replaceState` and successful
cinematic-navigation `pushState` generation.
