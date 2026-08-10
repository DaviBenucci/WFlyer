# Cloudflare edge and Napoleon origin state

- **Repository status:** `CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING`
- **External configuration:** pending
- **Production:** not authorized

This document separates repository-confirmed deployment contracts from facts
that still require authenticated Napoleon and Cloudflare evidence. It does not
authorize an infrastructure mutation.

## Confirmed contract

- the institutional site remains in the `DaviBenucci` GitHub repository;
- Napoleon is the Node.js origin provider;
- Napoleon's owner-confirmed integration independently pulls and builds a
  selected Git revision;
- GitHub Actions validates and checksums the candidate for provenance but does
  not deploy its archive to Napoleon;
- the runtime entry point is `.next/standalone/server.js`, started as a
  persistent Node.js process;
- a static-only `public_html` origin is incompatible with `POST /api/contact`;
- Cloudflare remains the required edge in front of the origin;
- VPS, EasyPanel, and mandatory Docker hosting are prohibited;
- `app.wflyer.com.br` is a separate application and must not be modified.

## Intended topology

```text
Client
  → owner-approved Cloudflare hostname (external value pending)
  → recorded Napoleon target (external value pending)
  → selected Git revision built by Napoleon
  → node .next/standalone/server.js
```

The exact staging hostname is an owner-approved external input. Do not create,
reserve, or infer one from repository examples. Record both the approved public
hostname and the actual Napoleon target before proposing any DNS change.

## Values are configured in two systems

GitHub Environment values are used by GitHub Actions to validate the exact
candidate and produce provenance evidence. They do not automatically become
Napoleon variables.

The corresponding public build value and server-only runtime values must be
configured independently in the selected Napoleon application. Evidence must
record variable names, scopes, and presence without displaying values. Never
copy a secret into documentation, an Actions summary, a command transcript, or
a screenshot.

## Read-only inventory required before DNS work

Capture authenticated, read-only evidence for:

- the existing Cloudflare zone and nameservers;
- apex, `www`, mail, verification, and application records;
- proxy, SSL/TLS, redirects, cache, WAF, and rate-limit configuration;
- the independent `app.wflyer.com.br` DNS and availability baseline;
- the Napoleon application type, repository, selected branch and SHA, build
  command, start command, injected port, process user, health check, restart,
  and rollback selector;
- the actual Napoleon target;
- the exact staging hostname approved by Davi Benucci.

Repository work may continue while this inventory is pending. DNS mutation,
staging publication, and external runtime validation may not be marked complete
without it.

## Non-destructive rules

- do not recreate the Cloudflare zone or change nameservers;
- do not delete or bulk-replace DNS records;
- do not modify `app.wflyer.com.br`;
- do not capture subdomains with a wildcard;
- do not cache `/api/contact`;
- do not enable HSTS until every covered host has been inventoried and
  validated;
- deploy and validate staging before requesting production approval;
- do not attach, restart, or repoint a production Napoleon application without
  Davi Benucci's explicit approval.

## Required staging evidence

- approved public hostname and actual Napoleon target;
- exact Git revision identity across branch head, green CI, release manifest,
  and Napoleon build;
- healthy persistent Node.js process using
  `node .next/standalone/server.js`;
- DNS resolution and valid HTTPS;
- Cloudflare proxy, cache exclusion for `/api/contact`, WAF, and rate limit;
- successful and fail-closed Contact scenarios with Turnstile and Resend;
- secret-safe GitHub, Napoleon, Cloudflare, Turnstile, and Resend logs;
- unchanged DNS and operational availability for `app.wflyer.com.br`;
- exercised staging rollback and the resulting restored SHA;
- Davi Benucci's dated homologation decision.

Until those fields are populated with real evidence, the infrastructure state
remains external configuration pending and production remains unauthorized.
