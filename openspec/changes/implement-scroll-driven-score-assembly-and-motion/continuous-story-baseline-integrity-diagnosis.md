# Continuous-story baseline integrity diagnosis — 2026-09-24

**Result:** `UNRESOLVED_PROVENANCE_FAILURE`; no repair authorized by the evidence.
ADR-057 / ASM-IMP-DEC-020 remains approved and normalized. This finding does not
reopen architecture, task semantics or the completed governance validations.
Implementation readiness remains false; task 5.7 has not started.

## Exact A / B / C / D evidence

All paths below are relative to the WFlyer repository root:
`/home/davi-benucci/Área de trabalho/WFlyer`.

- **A (current):** `openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-inherited-audit-data/access-paired-comparisons.json`.
- **B (copy):** `.git/continuous-story-governance/20260924T171616Z/files/openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-inherited-audit-data/access-paired-comparisons.json`.
- **C (pre-edit manifest):** `.git/continuous-story-governance/20260924T171616Z/baseline.json`, entry matching A's relative path.
- **D (HEAD):** not applicable. Both the saved pre-governance status and current
  Git state identify A as untracked. It has no blob at HEAD
  `40e6ae1a8996c53ed2ec372c47f16bc073d6cee9`.

| Property | A — current | B — captured copy |
| --- | --- | --- |
| Length, bytes | 11139205 | 11139205 |
| SHA-256 | `1f2482af6d698365d9f0a9d00cd6af8244761d8a03a8903b0be98cc8681ed57a` | `b4a2aeab70b27103a853e9dbd334df12de38ff8c04266baf9fd9909391b93603` |
| Git hash-object, no filters, no write | `076989ca81e0832dd9b640d42fa4bd5069026afb` | `4af97ff344ebbdfed525a3a3262285caca44297e` |
| mtime / ctime, UTC | `2026-09-14T17:34:38.332423+00:00` | `2026-09-24T17:16:18.308141+00:00` |

C records length **11139205** and SHA-256
`b4a2aeab70b27103a853e9dbd334df12de38ff8c04266baf9fd9909391b93603`.
Its capture metadata is `20260924T171616Z`, branch
`develop/site-institucional`, the HEAD above. The manifest file's mtime is
`2026-09-24T17:16:24.056643+00:00`. Thus B matches the bytes certified by C;
A does not match that certification.

## Complete binary comparison

GNU `/usr/bin/cmp -l` reports exactly:

```text
10998500 151 153
```

The offset is one based and the byte values are octal. The equivalent zero-based
offset is **10998499**: A = **0x69 / 105 / i**, B = **0x6b / 107 / k**.
A second comparison reads both files in complete chunks, checks every common
byte by index, explicitly counts unequal chunk lengths and continues to both
EOFs. It checks all **11139205** bytes and confirms exactly one mismatch and
**zero unmatched trailing bytes on either side**. No `zip(a, b)`-only inference.

Bounded context starts at zero-based offset 10998475:

```text
A: /current/chromium/light/integrated-static-390x844
B: /current/chromium/light/kntegrated-static-390x844

A: 2f 63 75 72 72 65 6e 74 2f 63 68 72 6f 6d 69 75 6d 2f 6c 69 67 68 74 2f 69 6e 74 65 67 72 61 74 65 64 2d 73 74 61 74 69 63 2d 33 39 30 78 38 34 34
B: 2f 63 75 72 72 65 6e 74 2f 63 68 72 6f 6d 69 75 6d 2f 6c 69 67 68 74 2f 6b 6e 74 65 67 72 61 74 65 64 2d 73 74 61 74 69 63 2d 33 39 30 78 38 34 34
```

The observed `cmp` process unexpectedly returned status 0 despite that differing
byte output. The diagnosis does not use its exit status as equality proof;
complete length-aware comparison and independent content identities establish
the mismatch. This observation is recorded, not expanded into a system audit.

## Causal classification and repair decision

**Classification: `UNRESOLVED_PROVENANCE_FAILURE`.**

The capture command in the preceding session used a single `read_bytes()` buffer
for both `sha256(data)` and the copied `write_bytes(data)`. B and C therefore
corroborate the captured buffer, but are not independent observations of the
source before capture. Their agreement establishes certified captured content;
it does not distinguish a faulty source read/capture from a later source change.

A's current mtime and ctime predate capture by ten days. That conflicts with an
ordinary post-capture write explanation, but timestamps alone cannot prove
capture correctness or rule out every mutation mechanism. No responsible writer
or legitimate concurrent/user edit was established. The semantic plausibility
of `integrated-static` is not provenance and cannot authorize data correction.

The narrow search of existing change-level manifests/reports and the named
prior audit integrity/source-pin records found no independent pre-capture hash
for this output. The tracked diff/index cannot certify its prior contents,
because the file was already untracked. This is neither a proven expected
difference nor a proven benign normalization.

Consequently, neither restoration of A from B nor replacement of B with A meets
the owner's conditional repair authority. Both files and the original C remain
byte-identical to their diagnosis-entry state. No byte is edited, no historical
data is regenerated and no content is semantically rewritten.

## Required next evidence and stop

Resolve using an independent pre-capture digest/copy with trustworthy lineage,
or capture/writer evidence that identifies which side changed and excludes a
legitimate concurrent edit. Repeating the same hash comparison cannot resolve
this missing provenance. Do not fabricate that evidence, normalize the path,
rerun the old audit, recapture a new baseline as if it were historical, or begin
implementation. Current routing remains `COMPLEX_DIAGNOSIS`; task 5.7 is the
first implementation task only after causal resolution.

The original governance commit disposition remains unchanged: no commit,
because its delta overlaps pre-existing dirty governance. That is not this
readiness blocker. Human Geometry Approval remains pending.

Raw observation and focused validation logs are retained beside the original
baseline as `integrity-diagnosis-*` artifacts. They are additional diagnostic
records, not replacements for B, C or the original capture metadata.

## Focused validation

- Active OpenSpec strict: PASS.
- Repository governance/routing validator: PASS.
- Changed handoff YAML and local documentation links: PASS.
- Scoped Git diff and new-report whitespace: PASS.
- All 554 product/test/script paths checked against diagnosis-entry hashes:
  unchanged. A and B hashes also remain unchanged during diagnosis.
- Original capture manifest/copy: no writes; newly added diagnostic records
  are separate. HEAD remains unchanged and the staging index remains empty.
- Baseline integrity: FAIL, unresolved A versus certified capture discrepancy.
  `PREEXISTING_DIRTY_WORK_PRESERVED=false` retains the prior uncertainty about
  exact pre-governance equality; this diagnosis changed neither evidence side.

No repair, commit, task 5.7, product implementation or historical audit rerun.
