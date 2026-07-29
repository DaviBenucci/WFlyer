# Mapa de IDs — assets de motion W_Flyer v1.0 review

## Master da introdução

| ID | Papel | Animável |
|---|---|---|
| `wf-intro-master` | raiz do SVG e tokens de tema | estado/fallback |
| `wf-intro-stage` | palco total | não |
| `wf-origin-layer` | conjunto do underscore inicial | opacidade |
| `wf-origin-underscore` | dash inicial preciso | escala X, opacidade, stroke dash |
| `wf-origin-underscore-glow` | glow duplicado do dash | opacidade |
| `wf-intro-lockup-position` | posição final estática do lockup | **não animar** |
| `wf-intro-logo` | wrapper animável do lockup | posição/escala geral |
| `wf-logo` | lockup oficial completo | posição durante símbolo→wordmark |
| `wf-symbol` | símbolo oficial | posição/escala/opacidade |
| `wf-symbol-anchor` | módulo principal esquerdo | x/y/rotação/escala/opacidade |
| `wf-symbol-upper-wing` | módulo superior direito | x/y/rotação/escala/opacidade |
| `wf-symbol-lower-wing` | módulo inferior direito | x/y/rotação/escala/opacidade |
| `wf-symbol-echoes` | wrapper dos ecos | não obrigatório |
| `wf-echo-1` | primeiro contorno exato | posição/escala/opacidade |
| `wf-echo-2` | segundo contorno exato | posição/escala/opacidade |
| `wf-wordmark-reveal` | grupo recortado do wordmark | opacidade |
| `wf-wordmark` | wordmark oficial em paths | lock final |
| `wf-wordmark-clip` | clipPath persistente | estrutural |
| `wf-wordmark-clip-rect` | revelação esquerda→direita | largura |
| `wf-ink-sweep` | faixa luminosa sincronizada | x/opacidade |
| `wf-wordmark-underscore` | underscore oficial do wordmark | último detalhe da revelação |
| `wf-accessibility-title` | título acessível | não |
| `wf-accessibility-description` | descrição acessível | não |

## Símbolo do header

| ID | Papel |
|---|---|
| `wf-header-symbol-asset` | raiz |
| `wf-header-symbol` | grupo do símbolo |
| `wf-header-symbol-anchor` | módulo principal |
| `wf-header-symbol-upper-wing` | módulo superior |
| `wf-header-symbol-lower-wing` | módulo inferior |
