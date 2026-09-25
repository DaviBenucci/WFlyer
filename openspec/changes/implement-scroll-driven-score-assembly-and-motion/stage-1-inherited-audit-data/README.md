# Access audit evidence archive

`access-key.jsonl.gz` is a lossless, deterministic gzip archive of the original
`access-key.jsonl` evidence. The original is 248,408,689 bytes, above GitHub's
100 MB per-file limit. Its SHA-256 is recorded in `access-key.jsonl.sha256`.

Before running audit tools that read `access-key.jsonl`, restore and verify it
from this directory:

```sh
gzip -dk access-key.jsonl.gz
sha256sum -c access-key.jsonl.sha256
```

The restored file is ignored by Git. Keep the archive and checksum together so
the original evidence can always be reconstructed byte for byte.
