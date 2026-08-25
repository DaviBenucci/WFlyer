# W_Flyer v2 Canonical Documentation

**Status:** approved target specification  
**Current code:** retained public v1 landing baseline plus completed Phase-2
static story foundation, Gate-3 typed content/detailed-route contracts, and
Gate-4 readiness/bootstrap/deep-link contracts on an isolated development route
**Implementation plan:** [`../../WFLYER_IMPLEMENTATION_PLAN.md`](../../WFLYER_IMPLEMENTATION_PLAN.md)

## Reading order

1. `00-governance/01-source-of-truth.md`
2. `00-governance/02-scope-status-and-terminology.md`
3. `00-governance/03-decision-register.md`
4. `00-governance/04-supersession-map.md`
5. `00-governance/06-decision-traceability.md`
6. `01-product/`
7. `02-experience/`
8. `03-visual/`
9. `04-music/`
10. `05-architecture/`
11. `06-migration/`
12. `07-quality/`
13. `manifests/`

## Canonical classification

Every statement in this directory is classified as one of:

- **APPROVED:** Codex must implement it.
- **CALIBRATION:** Codex may propose values; human approval is required before the value becomes canonical.
- **PENDING ASSET:** implementation may scaffold the contract, but final integration cannot be approved until the asset is supplied and approved.
- **RETAINED:** an existing v1 behavior remains authoritative.
- **SUPERSEDED:** historical/current-state behavior must not be used as the target.
- **OUT OF SCOPE:** Codex must not implement it in the current website repository.

## Core target

```text
APPLICATION TERMINAL ← ACCESS ← DEMO ← BENEFITS ← HOW ← APPLICATION ← HOME
                                                                      HOME → ABOUT → SERVICES → PROCESS → PROJECTS → CONTACT → PROFESSIONAL TERMINAL
```

Desktop maps native vertical scroll to this horizontal story. Mobile uses the semantic document order: professional branch first, application branch second.
