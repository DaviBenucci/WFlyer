# Reduced-Motion Evidence

Reduced motion changes presentation only.

- Resolver priority and validated inputs are identical to normal motion.
- The same positioning adapter receives the same semantic chapter.
- Static/vertical projection is retained.
- Presentation minimum and reveal are `0ms`.
- The decorative intro pulse is disabled.
- The independent safety deadline remains `5000ms`; reduced motion never hides
  the cover before slow critical readiness and semantic positioning finish.
- Hashes, restoration, session behavior, content, landmarks, and controls remain
  available.
- No APP-04 autoplay, Persona motion, horizontal pinning, or story scrub exists.

Validated results:

- `#como-funciona` resolved `application-how-it-works` before near-immediate
  reveal in all supported engines.
- `#beneficios` retained `application-benefits` in the reduced-motion
  accessibility matrix.
- Same-session reload retained the semantic target and added no entry.
- All 13 chapter elements remained mounted in the DOM after reveal, and the
  reduced-motion axe result had no relevant finding.
- Screenshot `04-bootstrap-benefits-reduced-motion-desktop-1536x1024.png`
  confirms the resulting semantic target; it is not a golden.
