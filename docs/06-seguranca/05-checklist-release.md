# Checklist de segurança para release

Repository-owned security closure is complete. Unchecked items below are
exclusively external. Local source/test evidence never stands in for GitHub,
Napoleon, Cloudflare, provider, professional-review, or physical-device
evidence.

- [x] Next.js está em patch de segurança atual da linha aprovada.
- [x] React e dependências críticas estão atualizadas.
- [x] No credential value was found in tracked repository source or focused
  local release-test output.
- [x] Final-current-revision browser/server bundles, archive, and local closure
  logs contain no credential value; expected runtime variable names remain in
  server code by design.
- [x] `/api/contact` rejeita método incorreto.
- [x] Content-Type e payload são limitados.
- [x] Origem externa é rejeitada.
- [x] Turnstile é validado no servidor.
- [x] `hostname` e `action` são validados.
- [x] Honeypot é testado.
- [ ] Rate limit está ativo na Cloudflare.
- [x] Resend usa remetente e destinatário fixos.
- [x] Entradas são escapadas.
- [x] CSP foi testada e não permite `unsafe-eval`.
- [ ] CSP has been observed in deployed staging and separately approved to
  leave report-only mode.
- [x] Cabeçalhos aplicáveis antes do inventário HSTS estão presentes.
- [x] Final-current-revision local staging output fails closed through
  metadata, `robots.txt`, and `X-Robots-Tag`.
- [ ] HTTPS for every covered host has been inventoried before any HSTS change.
- [x] `/api/contact` não é cacheado.
- [x] Application source emits no contact-payload log, and focused local tests
  do not record a complete visitor address or message.
- [ ] Napoleon, Cloudflare, Actions, and provider technical logs have been
  inspected under the owner-approved retention policy.
- [x] The final locally checksummed archive contains no inspiration image.
- [x] Workflow source and focused unit/actionlint checks neither print
  configured values nor invoke an invented Napoleon integration.
- [ ] Real Actions execution logs have been inspected without exposing values.
- [ ] GitHub Environments `staging` and `production` are configured and
  protected.
- [ ] Turnstile and Resend are externally validated in deployed staging.
- [ ] Legal content has professional review and owner confirmation.
- [ ] Critical journeys have a physical screen-reader review.
- [ ] The Napoleon Node.js process runs as an isolated, non-administrative
  hosting user.
- [ ] Rollback has been exercised and validated in staging.
