## ADDED Requirements

### Requirement: Navigation policies share one canonical story model
The controller SHALL expose `NORMAL_SCRUB`, `FAST_TRAVERSAL`, and
`RESTORE_SETTLED_STATE` as presentation policies over the same native-scroll
story position, canonical path, semantic chapter ownership, history, and focus
contracts. Ordinary wheel, touch, keyboard, scrollbar, and assistive scrolling
SHALL remain `NORMAL_SCRUB`; manual scroll velocity alone SHALL NOT activate
Fast Traversal.

#### Scenario: User scrolls rapidly without selecting a destination
- **WHEN** high-velocity manual input advances the native document
- **THEN** normal scrub remains authoritative and no programmatic Fast Traversal policy starts

### Requirement: Explicit navigation uses staff-only Fast Traversal
Only explicit programmatic story navigation MAY activate `FAST_TRAVERSAL`.
During it, staff progression, reversible draw/erase, and canonical path state
SHALL remain active, with Assembly geometry active when required. All
Composer-backed event presentation SHALL remain disabled and intermediate
content motion SHALL be simplified or suppressed.

#### Scenario: A distant header destination is selected
- **WHEN** canonical navigation begins a nontrivial traversal
- **THEN** the user moves through continuous staff-only geometry with no note, accidental, beam, tuplet, ledger, or other Composer-backed event visible until arrival

### Requirement: Arrival resolves semantic state before event presentation
Fast Traversal SHALL end only after actual destination semantic state is
resolved. It SHALL then return to `NORMAL_SCRUB`, allow eligible events to
resolve from precomputed anchors, settle destination content, update history,
and apply the canonical destination-focus contract without an intermediate
false active label.

#### Scenario: Traversal reaches its destination
- **WHEN** actual canonical progress enters the target ownership interval
- **THEN** traversal settles once, normal presentation resumes, eligible destination events may appear, and semantic header/history/focus state agree with the destination

### Requirement: Cancellation and target replacement resume from actual progress
Wheel, touch, navigation key, Escape, a new target, or a material responsive
mode change SHALL cancel the active traversal from its actual current story
progress. The abandoned destination SHALL NOT complete. A replacement target
SHALL start from that same real position and Composer-backed events SHALL remain
hidden for the replacement traversal.

#### Scenario: User interrupts an active traversal
- **WHEN** a cancellation input occurs before arrival
- **THEN** the old traversal releases ownership, normal scrub resolves events and content from actual progress, and the old destination does not settle

#### Scenario: A second destination replaces the first
- **WHEN** a new valid target is selected during Fast Traversal
- **THEN** the first target is discarded and staff-only traversal restarts deterministically from current real progress toward the replacement

### Requirement: Restoration and cross-branch traversal do not replay Home entry
Professional↔Application Fast Traversal MAY pass through settled Home, but SHALL
NOT replay the one-shot Home cinematic. Deep-link and history restoration SHALL
use `RESTORE_SETTLED_STATE` to resolve the correct scroll, destination, focus,
and semantic chapter directly rather than animating through prior chapters.

#### Scenario: Navigation crosses from one branch to the other
- **WHEN** explicit navigation traverses through Home between Professional and Application
- **THEN** settled Home may provide continuity while its origin entry sequence remains complete and unreplayed

#### Scenario: Browser history restores a prior destination
- **WHEN** popstate or refresh resolves an existing story location
- **THEN** the controller restores its canonical settled state directly with consistent history, focus, and chapter ownership
