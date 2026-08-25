# Phase-4 Evidence Seal Record

Date: 2026-08-25

The final seal covers **27 payload files**, excluding the checksum manifest
itself and its detached manifest-hash record.

Verification command:

```text
sha256sum --check --strict SHA256SUMS.txt
```

Expected result: all 27 payload entries report `OK` and the command exits zero.
The detached SHA-256 of `SHA256SUMS.txt` is recorded in
`SHA256SUMS.txt.sha256` and repeated in the final closeout response.

The seal includes every Gate report, contract/matrix, changed-file and commit
boundary record, validation summary, OpenSpec JSON record, and the four review
PNGs. It does not modify or supersede any Phase-2, Phase-3, or Music evidence
seal.
