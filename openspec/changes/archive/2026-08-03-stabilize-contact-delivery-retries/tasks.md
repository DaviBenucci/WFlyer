## 1. Contract and browser lifecycle

- [x] 1.1 Add the validated logical-submission UUID to the exact contact payload contract.
- [x] 1.2 Generate, retain, rotate, and serialize the UUID according to unchanged-retry, edit-after-failure, and success behavior.
- [x] 1.3 Add component coverage for the submission-identity lifecycle without exposing it in the rendered interface.

## 2. Provider delivery

- [x] 2.1 Derive the Resend idempotency key from the validated logical-submission UUID while preserving the finite deadline and generic result.
- [x] 2.2 Add domain and route regression coverage for UUID validation, stable provider identity, and a late-resolving first attempt followed by retry.

## 3. Evidence and synchronization

- [x] 3.1 Update the contact technical documentation and canonical capability purpose without weakening privacy or security boundaries.
- [x] 3.2 Run targeted lint, typecheck, unit/component, and contact Playwright gates and record their results.
- [x] 3.3 Strict-validate OpenSpec and prepare the completed corrective change for synchronized archival and a focused durable checkpoint.
