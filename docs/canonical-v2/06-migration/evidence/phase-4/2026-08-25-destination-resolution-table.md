# Destination Resolution Table

Priority is deterministic: valid nonempty explicit hash, validated history,
Home default. A nonempty invalid hash falls directly to Home and does not
consult history.

| Input hash | Semantic chapter |
|---|---|
| `#home` | `home` |
| `#aplicacao` | `application-overview` |
| `#como-funciona` | `application-how-it-works` |
| `#beneficios` | `application-benefits` |
| `#demonstracao` | `application-demo` |
| `#acessar-wflyer` | `application-access` |
| `#sobre` | `professional-about` |
| `#servicos` | `professional-services` |
| `#processo` | `professional-process` |
| `#projetos` | `professional-projects` |
| `#contato` | `professional-contact` |
| empty + valid history envelope | restored chapter; all 13 typed IDs accepted |
| empty + no valid restoration | `home` / `default-home` |
| nonempty invalid, stale, encoded selector-like, or malicious value | `home` / `invalid-hash-fallback`; URL left unchanged |

Raw URL or history values never become selectors, markup, code, or external
navigation. The native adapter queries only the fixed selector
`[data-chapter-id]` and compares an already validated data value.
