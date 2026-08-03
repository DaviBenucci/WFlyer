import { expect, test, type Page } from "@playwright/test";
import axe from "axe-core";

import {
  pageSeo,
  publicRoutes,
  type PublicRoute,
} from "../../src/config/seo";
import { siteConfig } from "../../src/config/site";

const brandIntroSessionKey = "wflyer.brand-intro.completed.v1";
const notFoundDescription =
  "O endereço solicitado não corresponde a uma página publicada no site institucional W_Flyer.";

interface RelevantViolation {
  readonly help: string;
  readonly id: string;
  readonly impact: string | null;
  readonly targets: readonly string[];
}

async function setCompletedBrandIntro(page: Page): Promise<void> {
  await page.addInitScript((key) => {
    try {
      window.sessionStorage.setItem(key, "1");
    } catch {
      // A storage failure must not prevent the public page from loading.
    }
  }, brandIntroSessionKey);
}

async function clearCompletedBrandIntro(page: Page): Promise<void> {
  await page.goto("/sobre");
  await page.evaluate((key) => {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // The public controller fails open when storage is unavailable.
    }
  }, brandIntroSessionKey);
}

async function installAxe(page: Page): Promise<void> {
  await page.addInitScript({ content: axe.source });
}

async function findRelevantViolations(
  page: Page,
): Promise<RelevantViolation[]> {
  return page.evaluate(async () => {
    const axeWindow = window as typeof window & {
      axe: typeof import("axe-core");
    };
    const results = await axeWindow.axe.run(document, {
      resultTypes: ["violations", "incomplete"],
      runOnly: {
        type: "tag",
        values: [
          "wcag2a",
          "wcag2aa",
          "wcag21a",
          "wcag21aa",
          "wcag22aa",
        ],
      },
    });
    const relevantIncomplete = results.incomplete.filter(
      ({ id }) => id === "aria-hidden-focus",
    );

    return [...results.violations, ...relevantIncomplete]
      .filter(({ impact }) => impact === "critical" || impact === "serious")
      .map(({ help, id, impact, nodes }) => ({
        help,
        id,
        impact: impact ?? null,
        targets: nodes.map(({ target }) => JSON.stringify(target)),
      }));
  });
}

async function expectMetadata(route: PublicRoute, page: Page): Promise<void> {
  const seo = pageSeo[route];
  const expectedUrl = new URL(route, siteConfig.url).toString();

  await expect(page).toHaveTitle(seo.title);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    seo.description,
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "website",
  );
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
    "content",
    "pt_BR",
  );
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
    "content",
    siteConfig.name,
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    seo.title,
  );
  await expect(
    page.locator('meta[property="og:description"]'),
  ).toHaveAttribute("content", seo.description);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary",
  );
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
    "content",
    seo.title,
  );
  await expect(
    page.locator('meta[name="twitter:description"]'),
  ).toHaveAttribute("content", seo.description);

  const canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute("href");
  const openGraphUrl = await page
    .locator('meta[property="og:url"]')
    .getAttribute("content");

  expect(canonical).not.toBeNull();
  expect(openGraphUrl).not.toBeNull();
  expect(new URL(canonical!).toString()).toBe(expectedUrl);
  expect(new URL(openGraphUrl!).toString()).toBe(expectedUrl);
}

async function expectStagingRobotsMetadata(page: Page): Promise<void> {
  const values = await page
    .locator('meta[name="robots"]')
    .evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("content") ?? ""),
    );
  const combined = values.join(", ").toLowerCase();

  expect(combined).toContain("noindex");
  expect(combined).toContain("nofollow");
}

for (const route of publicRoutes) {
  test(`${route} exposes rendered SEO and passes the public accessibility gate`, async ({
    page,
  }) => {
    test.setTimeout(90_000);
    await setCompletedBrandIntro(page);
    await installAxe(page);

    const response = await page.goto(route);

    expect(response?.status()).toBe(200);
    expect(response?.headers()["x-robots-tag"]).toContain("noindex");
    expect(response?.headers()["x-robots-tag"]).toContain("nofollow");
    expect(
      await page.evaluate(
        () => "__WFLYER_TRANSITION_TEST__" in window,
      ),
    ).toBe(false);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("contentinfo")).toBeAttached();
    await expectMetadata(route, page);
    await expectStagingRobotsMetadata(page);

    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
    expect(await findRelevantViolations(page), route).toEqual([]);
  });
}

test("staging fails closed at HTTP, HTML, and robots.txt layers", async ({
  page,
  request,
}) => {
  await setCompletedBrandIntro(page);

  const homeResponse = await page.goto("/");
  const [robotsResponse, sitemapResponse] = await Promise.all([
    request.get("/robots.txt"),
    request.get("/sitemap.xml"),
  ]);
  const robots = await robotsResponse.text();
  const sitemap = await sitemapResponse.text();
  const robotsLines = robots
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean);

  expect(homeResponse?.status()).toBe(200);
  expect(homeResponse?.headers()["x-robots-tag"]?.split(/,\s*/u)).toEqual(
    expect.arrayContaining([
      "noindex",
      "nofollow",
      "noarchive",
      "noimageindex",
    ]),
  );
  await expectStagingRobotsMetadata(page);

  expect(robotsResponse.status()).toBe(200);
  expect(robotsResponse.headers()["content-type"]).toContain("text/plain");
  expect(robotsResponse.headers()["x-robots-tag"]).toContain("noindex");
  expect(robotsLines).toEqual(["User-Agent: *", "Disallow: /"]);
  expect(robots).not.toContain("Sitemap:");

  expect(sitemapResponse.status()).toBe(200);
  for (const route of publicRoutes) {
    expect(sitemap).toContain(new URL(route, siteConfig.url).toString());
  }
  expect(sitemap).not.toContain("/api/contact");
  expect(sitemap).not.toContain(siteConfig.applicationUrl);
});

test("an unknown route returns unique, non-indexable 404 metadata", async ({
  page,
}) => {
  await setCompletedBrandIntro(page);

  const response = await page.goto("/rota-publica-inexistente");

  expect(response?.status()).toBe(404);
  expect(response?.headers()["x-robots-tag"]).toContain("noindex");
  await expect(page).toHaveTitle("Página não encontrada — W_Flyer");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    notFoundDescription,
  );
  await expectStagingRobotsMetadata(page);
  await expect(
    page.getByRole("heading", { level: 1, name: "Página não encontrada" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Voltar à página inicial", exact: true }),
  ).toHaveAttribute("href", "/");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:title"]')).toHaveCount(0);
  await expect(page.locator('meta[name="twitter:title"]')).toHaveCount(0);
});

test("public navigation keeps committed pages in browser history", async ({
  page,
}) => {
  await setCompletedBrandIntro(page);
  await page.goto("/sobre");

  await page.locator('[data-navigation-id="services"]:visible').first().click();
  await page.waitForURL(/\/servicos$/u);
  await expectMetadata("/servicos", page);

  await page.goBack();
  await page.waitForURL(/\/sobre$/u);
  await expectMetadata("/sobre", page);

  await page.goForward();
  await page.waitForURL(/\/servicos$/u);
  await expectMetadata("/servicos", page);
});

test("first-session intro exposes only its skip control and does not replay", async ({
  page,
}) => {
  await clearCompletedBrandIntro(page);
  await page.goto("/");

  const overlay = page.locator("[data-brand-intro]");
  const skip = page.getByRole("button", { name: "Pular introdução" });
  await expect(overlay).toBeVisible();
  await expect(skip).toBeVisible();

  const operableLabels = await page
    .locator(
      "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]",
    )
    .evaluateAll((elements) =>
      elements
        .filter((element): element is HTMLElement => {
          if (!(element instanceof HTMLElement) || element.tabIndex < 0) {
            return false;
          }
          if (
            element.closest("[inert]") ||
            element.closest('[aria-hidden="true"]')
          ) {
            return false;
          }
          const bounds = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return (
            bounds.width > 0 &&
            bounds.height > 0 &&
            style.display !== "none" &&
            style.visibility !== "hidden"
          );
        })
        .map(
          (element) =>
            element.getAttribute("aria-label") ?? element.textContent?.trim(),
        ),
    );

  expect(operableLabels).toEqual(["Pular introdução"]);
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await skip.click();

  await expect(overlay).toHaveCount(0);
  await expect(page.getByRole("main")).not.toHaveAttribute("inert");
  await expect(page.getByRole("main")).not.toHaveAttribute("aria-hidden");
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect
    .poll(() =>
      page.evaluate((key) => window.sessionStorage.getItem(key), brandIntroSessionKey),
    )
    .toBe("1");

  await page.reload();
  await page.waitForTimeout(250);
  await expect(overlay).toHaveCount(0);
});

test("first-session intro completes naturally and releases the public Home", async ({
  page,
}) => {
  test.setTimeout(30_000);
  await clearCompletedBrandIntro(page);
  await page.goto("/");

  const overlay = page.locator("[data-brand-intro]");
  await expect(overlay).toBeVisible();
  await expect(overlay).toHaveCount(0, { timeout: 9_000 });
  await expect(page.getByRole("main")).not.toHaveAttribute("inert");
  await expect(page.getByRole("main")).not.toHaveAttribute("aria-hidden");
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(
    page.getByRole("link", { name: "Acessar aplicação", exact: true }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate((key) => window.sessionStorage.getItem(key), brandIntroSessionKey),
    )
    .toBe("1");
});

test("public tablet journey stays local and contact remains non-destructive", async ({
  page,
}) => {
  await setCompletedBrandIntro(page);
  let contactSubmissions = 0;
  page.on("request", (request) => {
    if (
      request.method() === "POST" &&
      new URL(request.url()).pathname === "/api/contact"
    ) {
      contactSubmissions += 1;
    }
  });

  await page.goto("/aplicacao-wflyer");
  const demo = page.locator("[data-application-demo]");
  const destinationKey = demo.getByLabel("Tom de destino");
  await destinationKey.selectOption("g-major");
  await expect(demo).toHaveAttribute("data-demo-state", "configured");
  await demo.getByRole("button", { name: "Transpor" }).click();
  await expect(demo).toHaveAttribute("data-demo-state", "result");
  await expect(demo.locator('[data-demo-score="result"]')).toBeVisible();
  await demo
    .getByRole("button", { name: "Restaurar demonstração" })
    .click();
  await expect(demo).toHaveAttribute("data-demo-state", "reset");
  await expect(destinationKey).toHaveValue("bb-major");

  await page.goto("/contato");
  const form = page.getByRole("form", { name: "Formulário de contato" });
  await expect(form).toBeVisible();
  await expect(form).toHaveAttribute("data-contact-form", "idle");
  await form.getByLabel("Nome").focus();
  await expect(form.getByLabel("Nome")).toBeFocused();
  expect(contactSubmissions).toBe(0);
});
