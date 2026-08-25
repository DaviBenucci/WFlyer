import { expect, test } from "@playwright/test";

import { mockTurnstile } from "../helpers/turnstile";

const mainPageContracts = [
  {
    archetype: "product-demo",
    route: "/aplicacao-wflyer",
    selector: "main #demonstracao",
    count: 1,
  },
  {
    archetype: "editorial-sequence",
    route: "/aplicacao-wflyer/como-funciona",
    selector: "main #etapas article",
    count: 5,
  },
  {
    archetype: "editorial-benefits-terminal",
    route: "/aplicacao-wflyer/beneficios",
    selector: "main #beneficios article",
    count: 4,
  },
  {
    archetype: "editorial-sequence",
    route: "/sobre",
    selector: "main #perspectiva article",
    count: 3,
  },
  {
    archetype: "service-grid",
    route: "/servicos",
    selector: "main #categorias article",
    count: 4,
  },
  {
    archetype: "process-timeline",
    route: "/processo",
    selector: "main #etapas article",
    count: 4,
  },
  {
    archetype: "portfolio-grid",
    route: "/portfolio",
    selector: "main [data-project-list] article",
    count: 3,
  },
  {
    archetype: "contact-terminal",
    route: "/contato",
    selector: "[data-contact-workspace]",
    count: 1,
  },
] as const;

for (const contract of mainPageContracts) {
  test(`${contract.route} materializa o arquétipo ${contract.archetype}`, async ({
    page,
  }) => {
    await page.goto(contract.route);

    const main = page.getByRole("main");
    await expect(main).toHaveAttribute("data-archetype", contract.archetype);
    await expect(main.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator(contract.selector)).toHaveCount(contract.count);
    await expect(
      page.locator('img[src*="golden-pages"], img[src*="design-reference"]'),
    ).toHaveCount(0);
  });
}

test("a Aplicação preserva o contrato público sem restaurar o tablet interativo", async ({
  page,
}) => {
  await page.goto("/aplicacao-wflyer");

  const main = page.getByRole("main");
  const demoContract = main.locator("#demonstracao");
  await expect(demoContract).toBeVisible();
  await expect(main.locator("select, canvas, video")).toHaveCount(0);
  await expect(main.getByRole("button", { name: "Transpor" })).toHaveCount(0);
  await expect(main.locator("#proposta article")).toHaveCount(3);
  await expect(demoContract).toContainText(/WebM, MP4, poster e quadro final/u);
  await expect(main).toContainText(/revisão humana/u);
});

test("Serviços oferece quatro destinos reais com foco equivalente ao hover", async ({
  page,
}) => {
  await page.goto("/servicos");

  const links = page.locator('main #categorias a[href^="/servicos/"]');
  await expect(links).toHaveCount(4);

  await links.first().focus();
  await expect(links.first()).toBeFocused();
  await expect(links.first()).toHaveAttribute(
    "href",
    "/servicos/criacao-de-sites",
  );
  await expect(page.locator("main #processo article")).toHaveCount(4);
  await expect(
    page.locator('[data-score-chapter="services"]'),
  ).toHaveCount(1);
});

test("Projetos permanece limitado aos três registros públicos autorizados", async ({
  page,
}) => {
  await page.goto("/portfolio");

  const projects = page.locator("main [data-project-list] article");
  await expect(projects).toHaveCount(3);
  await expect(projects.nth(0)).toContainText("W_Flyer");
  await expect(projects.nth(1)).toContainText("MSN Distribuidora");
  await expect(projects.nth(2)).toContainText("MSN Suprimentos");
  await expect(
    page.locator("main [data-project-list] img"),
  ).toHaveCount(0);
});

test("Contato apresenta o formulário seguro sem simular envio", async ({
  page,
}) => {
  await mockTurnstile(page);
  await page.goto("/contato");

  const form = page.getByRole("form", {
    name: "Formulário de contato",
  });
  await expect(form).toBeVisible();
  await expect(form.locator("fieldset")).not.toHaveAttribute("disabled", "");
  await expect(
    form.getByRole("button", { name: "Enviar mensagem" }),
  ).toBeDisabled();
  await expect(form).toContainText(
    "Conclua a verificação de segurança para habilitar o envio.",
  );
  await expect(form.locator("[data-contact-status]"))
    .toHaveAttribute("data-contact-status", "idle");
  const workspace = page.locator("[data-contact-workspace]");
  await expect(
    workspace.getByRole("link", {
      name: "davi.benucci@wflyer.com.br",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    workspace.getByRole("link", { name: /^@davibenucci/u }),
  ).toBeVisible();
  await expect(
    workspace.getByRole("link", { name: /^DaviBenucci/u }),
  ).toBeVisible();
});

for (const route of [
  "/aplicacao-wflyer/beneficios",
  "/contato",
] as const) {
  test(`${route} termina depois da navegação e não reinicia pauta no footer`, async ({
    page,
  }) => {
    await page.goto(route);

    const finalBarline = page.locator(
      "main [data-final-barline]",
    );
    const navigation = page.getByRole("navigation", {
      name: "Navegação entre capítulos",
    });

    await expect(finalBarline).toHaveCount(1);
    await expect(navigation).toBeVisible();
    expect(
      await finalBarline.evaluate((finalElement) => {
        const chapterNavigation = document.querySelector(
          'nav[aria-label="Navegação entre capítulos"]',
        );

        return Boolean(
          chapterNavigation &&
            chapterNavigation.compareDocumentPosition(finalElement) &
              Node.DOCUMENT_POSITION_FOLLOWING,
        );
      }),
    ).toBe(true);
    await expect(page.locator("[data-footer-score]")).toBeHidden();
  });
}

const serviceDetailRoutes = [
  {
    contactType: "site-institucional",
    route: "/servicos/criacao-de-sites",
  },
  {
    contactType: "aplicacao-web",
    route: "/servicos/criacao-de-aplicacoes",
  },
  {
    contactType: "integracao",
    route: "/servicos/integracoes",
  },
  {
    contactType: "solucao-personalizada",
    route: "/servicos/solucoes-sob-medida",
  },
] as const;

for (const { contactType, route } of serviceDetailRoutes) {
  test(`${route} usa o detalhe editorial sem criar capítulo`, async ({
    page,
  }) => {
    await page.goto(route);

    const main = page.getByRole("main");
    await expect(main).toHaveAttribute("data-archetype", "service-detail");
    await expect(main).toHaveAttribute("data-route-kind", "auxiliary");
    await expect(main).not.toHaveAttribute("data-chapter");
    await expect(page.locator("[data-service-detail-mark]")).toHaveCount(1);
    await expect(page.locator("[data-audience-list] > li")).toHaveCount(2);
    await expect(main.locator("#processo article")).toHaveCount(4);
    await expect(main.locator("[data-final-barline]")).toHaveCount(0);

    const contactLink = main.getByRole("link", {
      name: /Falar sobre|Apresentar necessidade/u,
    }).first();
    await expect(contactLink).toHaveAttribute(
      "href",
      `/contato?tipo=${contactType}`,
    );
    await contactLink.click();
    await expect(page).toHaveURL(
      new RegExp(`/contato\\?tipo=${contactType}$`, "u"),
    );
    await expect(page.getByLabel("Tipo de projeto")).toHaveValue(
      contactType,
    );
  });
}

const legalRoutes = [
  { route: "/politica-de-privacidade", updatedAt: "2026-07-31" },
  { route: "/politica-de-cookies", updatedAt: "2026-07-31" },
  { route: "/termos-de-uso", updatedAt: "2026-07-29" },
  { route: "/acessibilidade", updatedAt: "2026-07-29" },
] as const;

for (const { route, updatedAt } of legalRoutes) {
  test(`${route} usa o template editorial legal`, async ({ page }) => {
    await page.goto(route);

    const main = page.getByRole("main");
    await expect(main).toHaveAttribute("data-archetype", "legal-editorial");
    await expect(main).toHaveAttribute("data-route-kind", "auxiliary");
    await expect(main.locator("time")).toHaveAttribute(
      "datetime",
      updatedAt,
    );
    await expect(
      main.getByRole("navigation", { name: /^Índice de/u }),
    ).toBeVisible();
    await expect(main.locator("[data-final-barline]")).toHaveCount(0);
    await expect(page.locator("header[data-variant]")).toHaveAttribute(
      "data-variant",
      "simplified",
    );
    await expect(
      page.getByRole("navigation", { name: "Navegação da aplicação" }),
    ).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Navegação profissional" }),
    ).toBeVisible();
    await expect(
      page.locator(
        'header[data-variant="simplified"] [data-navigation-id] > svg',
      ).first(),
    ).toBeHidden();
  });
}
