# Phase 8 Evidence Seal Record

Closeout date: 2026-08-28

`SHA256SUMS.txt` seals 27 Phase-8 evidence payload files: eight reviewed PNG
captures and 19 Markdown/JSON records. The checksum manifest intentionally
excludes itself and `SHA256SUMS.txt.sha256`.

`SHA256SUMS.txt.sha256` records the standalone SHA-256 digest of the checksum
manifest. Verification is performed from this directory with:

```bash
sha256sum --check --strict SHA256SUMS.txt
sha256sum --check --strict SHA256SUMS.txt.sha256
```

The sealed payload covers Phase-8 scene and APP-04 contracts, intentionally
absent Phase-11 media, Access/terminal and Phase-9 boundaries, responsive and
accessibility review, lifecycle/performance, failed diagnostics and A/B root
causes, source/browser/regression/production validation, prior-seal integrity,
OpenSpec progress and strict validation, changed files, and commit boundary.
