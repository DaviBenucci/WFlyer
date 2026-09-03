# Phase 0 baseline recovery and validation

**Captured:** 2026-08-15T14:01:20-03:00  
**Authorized recovery source:** `784856b5b34ef87c8be24ab666d5d37756573ded`  
**Safety branch:** `safety/music-v0-1-pre-baseline-restore-20260815`  
**Scope:** repository-local recovery and baseline validation only; no production, DNS, Cloudflare, Napoleon, `app.wflyer.com.br`, or public landing integration change.

## Recovery evidence

- Pre-restore porcelain status: 448 entries.
- Deleted tracked paths recorded: 413.
- Pre-existing untracked files fingerprinted: 35.
- Non-deleted tracked changes before restore: 0.
- Restore target: only the 413 paths reported deleted relative to the authorized source commit.
- Deleted tracked paths remaining after restore: 0.
- Files under `src/` after restore: 156.
- All 35 pre-existing untracked SHA-256 checks passed after restore.
- The complete canonical package checksum file passed.
- All eight visual-library source masters and eight runtime candidates matched their manifest SHA-256 values (16/16).
- No previously existing modified or untracked overlay file was overwritten or removed.

The complete pre/post status and path inventories are stored beside this report. The canonical KEEP/REFACTOR/REPLACE/REMOVE_AFTER_CUTOVER/DEFER classification remains the file-by-file migration map in `docs/canonical-v2/06-migration/02-file-by-file-migration-map.md`.

## Restored baseline commands

| Command | Exact result |
|---|---|
| `pnpm validate:dependencies` | PASS, exit 0; every dependency uses an exact version |
| `pnpm lint` | PASS, exit 0, zero warnings |
| `pnpm typecheck` | PASS, exit 0; Next.js route types generated and TypeScript completed |
| `pnpm test` | PASS, exit 0; 33 files and 306 tests passed |
| `pnpm build` | PASS, exit 0; Next.js 16.2.12 production build generated 22 app routes |
| focused restored public E2E baseline | PASS, exit 0; 28 Chromium tests passed across Home, legacy score continuity, application demo, and contact/security |
| `tests/visual/home.visual.spec.ts` | PASS, exit 0; 11 Chromium visual/responsive/theme checks passed without snapshot updates |
| production-standalone cross-engine diagnostic | DIAGNOSTIC FAIL, exit 1; 71 passed, 16 failed, 66 did not run because the pre-existing production bundle lacked the required build-time test-only environment; tests were not changed |

Focused public E2E command:

```bash
pnpm exec playwright test tests/e2e/home.spec.ts tests/e2e/score-continuity.spec.ts tests/e2e/phase06-application-demo.spec.ts tests/e2e/phase08-contact-security.spec.ts --project=chromium --workers=1
```

## Baseline conclusion

The legacy public baseline is restored and reproducible. Existing legacy music remains compatibility code only. The new Music System v0.1 may now be implemented in parallel boundaries without altering or removing the landing implementation.

The focused passing baseline above was completed before new music-system source work. The broader standalone result is retained separately as a truthful harness diagnostic, not represented as a product regression or a passing production gate.

## Post-recovery production verification

After the baseline was restored and the isolated Music System work was added, the
production bundle was rebuilt with the governed test-only build variables. The
complete focused public compatibility slice then passed:

| Command scope | Exact result |
|---|---|
| Home, Phase 05 navigation, legacy score continuity, Phase 06 application demo, and Phase 08 contact/security | PASS, exit 0; 153/153 tests across Chromium, Firefox, and WebKit in 4.4 minutes |
| Representative stored-image/capture slice | HOST DIAGNOSTIC, exit 1; 7/12 passed, with five stored-image comparisons differing by only 8–26 pixels (reported as 0.01%) on the noncanonical Ubuntu 26.04 host |
| Repeated affected stored-image subset | HOST DIAGNOSTIC, exit 1; the same five comparisons reproduced with the same pixel counts |
| Committed visual snapshot integrity | PASS; 84 PNGs, aggregate `ba4f23c08613c1c1c9a1481fa6d8466dd7bfa0641cf3b6ae898424966ccc6b63`, and `git diff --exit-code -- tests/visual` returned 0 |

No snapshot was updated, no visual threshold was loosened, and no public source file
was changed. Canonical stored-image acceptance remains explicitly reserved for the
pinned Playwright Noble image recorded in `2026-08-15-browser-environment.txt`.
