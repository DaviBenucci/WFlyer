# Current Napoleon DNS and hosting state

> The filename is retained for link stability. Cloudflare edge topology is
> historical and was superseded by ADR-040 on 2026-08-29.

- **Repository status:** `CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING`
- **DNS migration:** owner-completed; documented here without mutation
- **External staging/runtime evidence:** pending
- **Production deployment:** not authorized

This document separates the current routing topology from deployment facts
that still require authenticated Napoleon evidence. It authorizes no DNS,
hosting, provider, or production change.

## Current topology

```text
Registro.br
  → Napoleon authoritative DNS
  → Napoleon hosting
  → selected Git revision built by Napoleon
  → node .next/standalone/server.js
```

Cloudflare authoritative DNS, proxy, WAF, redirects, cache purge, and DNS API
are not in the active W_Flyer request path. Cloudflare Turnstile remains an
independent anti-abuse integration used by `POST /api/contact`.

## Confirmed repository contract

- the institutional site remains in the `DaviBenucci` GitHub repository;
- Napoleon provides authoritative DNS and Node.js hosting;
- Napoleon's owner-confirmed source integration independently pulls and builds
  a selected Git revision;
- GitHub Actions validates and checksums a candidate for provenance but does
  not deploy its archive to Napoleon;
- the runtime entry point is `.next/standalone/server.js`, started as a
  persistent Node.js process;
- a static-only `public_html` host is incompatible with `POST /api/contact`;
- VPS, EasyPanel, and mandatory Docker hosting remain prohibited;
- `app.wflyer.com.br` is a separate application and must not be modified.

## Values are configured in two systems

GitHub Environment values validate the exact candidate and generate provenance
evidence. They do not automatically become Napoleon variables.

The corresponding public build value and server-only runtime values must be
configured independently in the selected Napoleon application. Evidence records
only names, scopes, and presence. Secret values never enter documentation,
Actions summaries, transcripts, screenshots, or release artifacts.

## Read-only inventory still required

Capture authenticated, read-only evidence for:

- Napoleon authoritative nameservers and the apex, `www`, mail, verification,
  staging, and separate-application records;
- actual Napoleon HTTPS/certificate, redirect, cache, log, and security
  controls;
- whether Napoleon exposes WAF or rate limiting; do not claim either until
  observed, configured, approved, and tested;
- the Napoleon application type, repository, selected branch/SHA, build/start
  commands, injected port, process user, health check, restart, logs, and
  rollback selector;
- the exact staging hostname approved by Davi Benucci;
- the independent `app.wflyer.com.br` DNS/HTTPS/application baseline.

No Napoleon DNS API, cache-purge API, WAF, rate limiter, or redirect API is
assumed. Record the real provider control surface instead of inventing one.

## Non-destructive rules

- do not change Registro.br delegation or Napoleon DNS records without explicit
  owner approval;
- do not delete or bulk-replace DNS records;
- do not modify `app.wflyer.com.br` or capture subdomains with a wildcard;
- preserve application `Cache-Control: no-store` for every Contact response;
- do not enable HSTS until every covered host is inventoried and validated;
- deploy and validate staging before requesting production approval;
- do not attach, restart, or repoint a production Napoleon application without
  Davi Benucci's explicit approval.

## Required staging evidence

- approved public hostname and actual Napoleon DNS/hosting target;
- exact Git revision identity across branch head, green CI, release manifest,
  and Napoleon build;
- healthy persistent Node.js process using
  `node .next/standalone/server.js`;
- DNS resolution, valid HTTPS, and observed Napoleon redirect/cache behavior;
- proof that `/api/contact` remains uncached;
- any claimed Napoleon WAF/rate control, or an explicit record that it is absent;
- successful and fail-closed Contact scenarios with independent Turnstile and
  Resend;
- secret-safe GitHub, Napoleon, Turnstile, and Resend logs;
- unchanged availability for `app.wflyer.com.br`;
- exercised staging rollback and the resulting restored SHA;
- Davi Benucci's dated homologation decision.

Until those fields contain real evidence, external configuration remains
pending and production deployment remains unauthorized.
