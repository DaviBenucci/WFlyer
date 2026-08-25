# Production Build and Isolation Validation

Date: 2026-08-25  
Result: **PASS**

The authoritative production sequence set the deployment environment at build
time:

```text
WFLYER_DEPLOYMENT_ENVIRONMENT=production pnpm build
pnpm prepare:standalone
WFLYER_DEPLOYMENT_ENVIRONMENT=production pnpm smoke:standalone
WFLYER_DEPLOYMENT_ENVIRONMENT=production pnpm smoke:indexing
```

Observed results:

- Next.js `16.2.12` compiled successfully and generated 35 static pages;
- TypeScript passed inside the build;
- the bootstrap lab route compiled as an on-demand route but returned the
  custom HTTP 404 under production policy;
- the standalone package copied public and Next static assets successfully;
- standalone smoke passed 20 public routes, 3 development-route 404s, and 22
  static assets;
- production indexing smoke passed;
- `/__visual-lab/story`, `/__visual-lab/story/bootstrap`, and
  `/__visual-lab/music` leaked no fixture markup;
- sitemap and production indexing surfaces expose no Visual Lab route.

No staging server, hosted production system, DNS, Cloudflare, Napoleon, or
provider was changed or tested by this local production-mode validation.
