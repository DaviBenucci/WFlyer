# Source of Truth and Precedence

## 1. Authority order

1. `AGENTS.md`
2. `WFLYER_IMPLEMENTATION_PLAN.md`
3. this canonical v2 directory and its manifests
4. active v2 OpenSpec changes/specifications
5. retained security, contact, legal, deployment, and operations documents
6. legacy documentation
7. current code and current tests

The current implementation is evidence of what exists, not proof of what should exist.

## 2. Conflict handling

- Do not silently merge incompatible behaviors.
- Record the conflict in the phase evidence.
- Apply the supersession map.
- If precedence does not resolve it, stop and request owner input.
- Do not treat a legacy test as normative when its behavior is explicitly superseded.

## 3. Canonical language

Technical documentation, schemas, ADRs, implementation instructions, tests, and code comments are English. Public website copy and legal content are pt-BR.

## 4. Single normative version

Do not maintain two editable normative specifications for the same behavior. Legacy files may remain as history, but the v2 document is authoritative.

## 5. Evidence

Claims such as “approved,” “complete,” “staging validated,” or “production ready” require recorded evidence. Human visual gates cannot be self-approved by Codex.
