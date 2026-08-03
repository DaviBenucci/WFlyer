import { expect, test, type Page } from "@playwright/test";

import { mockTurnstile } from "../helpers/turnstile";

async function fillContactForm(
  page: Page,
  projectType = "solucao-personalizada",
) {
  const form = page.getByRole("form", { name: "Formulário de contato" });
  await form.getByLabel("Nome").fill("Pessoa Visitante");
  await form.getByLabel("E-mail").fill("visitante@example.com");
  await form.getByLabel("Empresa (opcional)").fill("W_Flyer");
  await form.getByLabel("Tipo de projeto").selectOption(projectType);
  await form
    .getByLabel("Mensagem")
    .fill("Preciso conversar sobre um projeto digital sob medida.");
  await form.getByLabel(/Li a Política de Privacidade/u).check();
  return form;
}

test("contact query, keyboard verification, finite submission, and success", async ({
  page,
}) => {
  await mockTurnstile(page);
  let submittedPayload: Record<string, unknown> | undefined;
  await page.route("**/api/contact", async (route) => {
    submittedPayload = route.request().postDataJSON() as Record<string, unknown>;
    await new Promise((resolve) => setTimeout(resolve, 250));
    await route.fulfill({
      body: JSON.stringify({ ok: true }),
      contentType: "application/json",
      status: 200,
    });
  });

  await page.goto("/contato?tipo=site-institucional");
  const form = await fillContactForm(page, "site-institucional");
  await expect(form.getByLabel("Tipo de projeto")).toHaveValue(
    "site-institucional",
  );
  const submit = form.getByRole("button", { name: "Enviar mensagem" });
  await expect(submit).toBeDisabled();

  const verification = form.getByRole("button", {
    name: "Concluir verificação de teste",
  });
  await verification.focus();
  await page.keyboard.press("Enter");
  await expect(form.getByText("Verificação de segurança concluída.")).toBeVisible();
  await expect(submit).toBeEnabled();

  await submit.click();
  await expect(form).toHaveAttribute("data-contact-form", "submitting");
  await expect(form).toHaveAttribute("data-contact-form", "success");
  await expect(form.getByText(/Mensagem enviada/u)).toBeFocused();
  expect(submittedPayload).toMatchObject({
    email: "visitante@example.com",
    privacyConsent: true,
    projectType: "site-institucional",
    turnstileToken: "browser-test-token",
    website: "",
  });
  expect(String(submittedPayload?.submissionId)).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu,
  );
});

test("an unchanged retry keeps one private logical-submission identity", async ({
  page,
}) => {
  await mockTurnstile(page);
  const submittedPayloads: Record<string, unknown>[] = [];
  await page.route("**/api/contact", async (route) => {
    submittedPayloads.push(
      route.request().postDataJSON() as Record<string, unknown>,
    );
    const retry = submittedPayloads.length > 1;
    await route.fulfill({
      body: JSON.stringify(
        retry ? { ok: true } : { code: "service_unavailable", ok: false },
      ),
      contentType: "application/json",
      status: retry ? 200 : 503,
    });
  });

  await page.goto("/contato");
  const form = await fillContactForm(page);
  const verification = form.getByRole("button", {
    name: "Concluir verificação de teste",
  });
  const submit = form.getByRole("button", { name: "Enviar mensagem" });

  await verification.click();
  await submit.click();
  await expect(form).toHaveAttribute("data-contact-form", "error");
  await expect(form.locator('[name="submissionId"]')).toHaveCount(0);

  await verification.click();
  await submit.click();
  await expect(form).toHaveAttribute("data-contact-form", "success");

  expect(submittedPayloads).toHaveLength(2);
  expect(submittedPayloads[0]?.submissionId).toBe(
    submittedPayloads[1]?.submissionId,
  );
});

test("native field error and provider failure remain recoverable", async ({
  page,
}) => {
  await mockTurnstile(page);
  await page.route("**/api/contact", async (route) => {
    await route.fulfill({
      body: JSON.stringify({ code: "service_unavailable", ok: false }),
      contentType: "application/json",
      status: 503,
    });
  });
  await page.goto("/contato");
  const form = page.getByRole("form", { name: "Formulário de contato" });
  await form
    .getByRole("button", { name: "Concluir verificação de teste" })
    .click();
  await form.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(form).toHaveAttribute("data-contact-form", "validation-error");
  await expect(form.getByRole("alert")).toContainText(/Revise os campos/u);

  await fillContactForm(page);
  await form
    .getByRole("button", { name: "Concluir verificação de teste" })
    .click();
  await form.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(form).toHaveAttribute("data-contact-form", "error");
  await expect(form.getByRole("alert")).toBeFocused();
  await expect(form.getByLabel("Nome")).toHaveValue("Pessoa Visitante");
});

test("mobile dark reduced-motion contact keeps controls and viewport intact", async ({
  page,
}) => {
  await mockTurnstile(page);
  await page.setViewportSize({ height: 844, width: 320 });
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/contato");
  await page.evaluate(() => localStorage.setItem("wf-theme", "dark"));
  await page.reload();

  const form = page.getByRole("form", { name: "Formulário de contato" });
  await expect(form).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  for (const control of await form.locator("input:not([type=checkbox]):not([name=website]), select, textarea, button").all()) {
    expect((await control.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  }
  expect(
    (await form.getByLabel(/Li a Política de Privacidade/u).locator("..").boundingBox())
      ?.height,
  ).toBeGreaterThanOrEqual(44);
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await expect(page.locator("[data-final-barline]")).toBeVisible();

  await page.setViewportSize({ height: 320, width: 844 });
  await form.getByLabel("Mensagem").focus();
  await expect(form.getByLabel("Mensagem")).toBeFocused();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await form.getByRole("button", { name: "Enviar mensagem" }).scrollIntoViewIfNeeded();
  await expect(form.getByRole("button", { name: "Enviar mensagem" })).toBeVisible();
});

test("security headers are explicit and the report-only CSP has no unsafe-eval", async ({
  request,
}) => {
  const response = await request.get("/contato");
  const headers = response.headers();
  const csp = headers["content-security-policy-report-only"];

  expect(response.ok()).toBe(true);
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("https://challenges.cloudflare.com");
  expect(csp).not.toContain("unsafe-eval");
  expect(headers["cross-origin-opener-policy"]).toBe("same-origin");
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-powered-by"]).toBeUndefined();

  const unsupportedMethod = await request.get("/api/contact");
  expect(unsupportedMethod.status()).toBe(405);
});
