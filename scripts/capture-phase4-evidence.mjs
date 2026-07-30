import { mkdir } from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright";

const baseUrl =
  process.env.WFLYER_EVIDENCE_BASE_URL ?? "http://127.0.0.1:43118";
const outputDirectory = path.resolve(
  "docs/05-implementacao/evidencias/fase-4",
);

const routes = [
  { label: "Aplicação", route: "/aplicacao-wflyer" },
  {
    label: "Como funciona",
    route: "/aplicacao-wflyer/como-funciona",
  },
  {
    label: "Benefícios",
    route: "/aplicacao-wflyer/beneficios",
  },
  { label: "Empresa", route: "/sobre" },
  { label: "Serviços", route: "/servicos" },
  { label: "Processo", route: "/processo" },
  { label: "Portfólio", route: "/portfolio" },
  { label: "Contato", route: "/contato" },
  {
    label: "Detalhe · Sites",
    route: "/servicos/criacao-de-sites",
  },
  {
    label: "Detalhe · Aplicações",
    route: "/servicos/criacao-de-aplicacoes",
  },
  {
    label: "Detalhe · Integrações",
    route: "/servicos/integracoes",
  },
  {
    label: "Detalhe · Sob medida",
    route: "/servicos/solucoes-sob-medida",
  },
  {
    label: "Privacidade",
    route: "/politica-de-privacidade",
  },
  { label: "Cookies", route: "/politica-de-cookies" },
  { label: "Termos", route: "/termos-de-uso" },
  { label: "Acessibilidade", route: "/acessibilidade" },
];

const detailedCaptures = [
  {
    file: "application-desktop-light.png",
    fullPage: false,
    reducedMotion: "no-preference",
    route: "/aplicacao-wflyer",
    theme: "light",
    viewport: { height: 1024, width: 1536 },
  },
  {
    file: "application-mobile-dark.png",
    route: "/aplicacao-wflyer",
    theme: "dark",
    viewport: { height: 844, width: 390 },
  },
  {
    file: "how-it-works-mobile-light.png",
    route: "/aplicacao-wflyer/como-funciona",
    theme: "light",
    viewport: { height: 844, width: 390 },
  },
  {
    file: "benefits-desktop-dark.png",
    fullPage: false,
    route: "/aplicacao-wflyer/beneficios",
    theme: "dark",
    viewport: { height: 1024, width: 1536 },
  },
  {
    file: "company-mobile-light.png",
    route: "/sobre",
    theme: "light",
    viewport: { height: 844, width: 390 },
  },
  {
    file: "services-desktop-light.png",
    fullPage: false,
    route: "/servicos",
    theme: "light",
    viewport: { height: 1024, width: 1536 },
  },
  {
    file: "process-desktop-light.png",
    fullPage: false,
    route: "/processo",
    theme: "light",
    viewport: { height: 1024, width: 1536 },
  },
  {
    file: "portfolio-desktop-dark.png",
    fullPage: false,
    route: "/portfolio",
    theme: "dark",
    viewport: { height: 1024, width: 1536 },
  },
  {
    file: "contact-desktop-light.png",
    fullPage: false,
    route: "/contato",
    theme: "light",
    viewport: { height: 1024, width: 1536 },
  },
  {
    file: "service-detail-mobile-light.png",
    route: "/servicos/criacao-de-sites",
    theme: "light",
    viewport: { height: 844, width: 390 },
  },
  {
    file: "legal-mobile-dark.png",
    route: "/politica-de-privacidade",
    theme: "dark",
    viewport: { height: 844, width: 390 },
  },
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function captureMatrix(browser, viewportName, viewport, theme) {
  const desktop = viewportName === "desktop";
  const scale = desktop ? 0.22 : 0.48;
  const cardWidth = Math.round(viewport.width * scale);
  const cardHeight = Math.round(viewport.height * scale);
  const gap = desktop ? 18 : 14;
  const pageWidth = cardWidth * 4 + gap * 5;
  const pageHeight = (cardHeight + 42) * 4 + gap * 5;
  const context = await browser.newContext({
    colorScheme: theme,
    locale: "pt-BR",
    reducedMotion: "reduce",
    viewport: { height: pageHeight, width: pageWidth },
  });
  const page = await context.newPage();
  const background = theme === "dark" ? "#020b22" : "#eee5d9";
  const foreground = theme === "dark" ? "#f4efff" : "#24180f";

  await page.setContent(`
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; }
          html, body { margin: 0; min-height: 100%; background: ${background}; color: ${foreground}; }
          body {
            display: grid;
            grid-template-columns: repeat(4, ${cardWidth}px);
            gap: ${gap}px;
            align-content: start;
            padding: ${gap}px;
            font: 600 12px/1.2 ui-sans-serif, system-ui, sans-serif;
          }
          figure { margin: 0; min-width: 0; }
          figcaption {
            height: 32px;
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 0 4px;
            overflow: hidden;
            white-space: nowrap;
          }
          figcaption span { opacity: .58; font-weight: 500; }
          .viewport {
            position: relative;
            width: ${cardWidth}px;
            height: ${cardHeight}px;
            overflow: hidden;
            border: 1px solid color-mix(in srgb, ${foreground} 22%, transparent);
            border-radius: 10px;
            background: ${background};
          }
          iframe {
            position: absolute;
            inset: 0 auto auto 0;
            width: ${viewport.width}px;
            height: ${viewport.height}px;
            border: 0;
            pointer-events: none;
            transform: scale(${scale});
            transform-origin: 0 0;
          }
        </style>
      </head>
      <body>
        ${routes
          .map(
            ({ label, route }) => `
              <figure>
                <figcaption>${escapeHtml(label)} <span>${escapeHtml(route)}</span></figcaption>
                <div class="viewport">
                  <iframe
                    loading="eager"
                    src="${baseUrl}${route}"
                    title="${escapeHtml(label)}"
                  ></iframe>
                </div>
              </figure>
            `,
          )
          .join("")}
      </body>
    </html>
  `);

  await Promise.all(
    page
      .frames()
      .filter((frame) => frame !== page.mainFrame())
      .map((frame) => frame.waitForSelector("#main-content")),
  );
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  await page.screenshot({
    animations: "disabled",
    path: path.join(
      outputDirectory,
      `matrix-${viewportName}-${theme}.png`,
    ),
  });
  await context.close();
}

async function captureDetail(browser, capture) {
  const context = await browser.newContext({
    colorScheme: capture.theme,
    locale: "pt-BR",
    reducedMotion: capture.reducedMotion ?? "reduce",
    viewport: capture.viewport,
  });
  const page = await context.newPage();

  await page.goto(`${baseUrl}${capture.route}`, {
    waitUntil: "networkidle",
  });
  await page.locator("#main-content").waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    animations: "disabled",
    fullPage: capture.fullPage ?? true,
    path: path.join(outputDirectory, capture.file),
  });
  await context.close();
}

await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch();

try {
  for (const theme of ["light", "dark"]) {
    await captureMatrix(
      browser,
      "desktop",
      { height: 1024, width: 1536 },
      theme,
    );
    await captureMatrix(
      browser,
      "mobile",
      { height: 844, width: 390 },
      theme,
    );
  }

  for (const capture of detailedCaptures) {
    await captureDetail(browser, capture);
  }
} finally {
  await browser.close();
}

console.log(
  `Phase 4 evidence captured: 4 matrices + ${detailedCaptures.length} detailed views.`,
);
