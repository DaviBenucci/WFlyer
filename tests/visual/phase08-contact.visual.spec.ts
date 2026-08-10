import { expect, test, type Page } from "@playwright/test";

import {
  stabilizeVisualCapture,
  waitForStableFrames,
} from "../helpers/visual";

async function mockTurnstile(page: Page) {
  await page.route("**/turnstile/v0/api.js**", (route) =>
    route.fulfill({
      body: `
        window.turnstile = {
          render: function (container, options) {
            var button = document.createElement("button");
            button.type = "button";
            button.textContent = "Concluir verificação de teste";
            button.style.padding = "0.75rem 1rem";
            button.style.border = "1px solid currentColor";
            button.style.borderRadius = "0.5rem";
            button.style.background = "transparent";
            button.style.color = "inherit";
            button.onclick = function () { options.callback("visual-token"); };
            container.appendChild(button);
            return "visual-widget";
          },
          remove: function () {},
          reset: function () {}
        };
      `,
      contentType: "application/javascript; charset=utf-8",
    }),
  );
}

async function openContact(page: Page) {
  await mockTurnstile(page);
  await page.setViewportSize({ height: 2000, width: 1440 });
  await page.goto("/contato");
  const form = page.getByRole("form", { name: "Formulário de contato" });
  await expect(
    form.getByRole("button", { name: "Concluir verificação de teste" }),
  ).toBeVisible();
  return form;
}

async function fillValidForm(page: Page) {
  const form = page.getByRole("form", { name: "Formulário de contato" });
  const consent = form.getByLabel(/Li a Política de Privacidade/u);
  await form.getByLabel("Nome").fill("Pessoa Visitante");
  await form.getByLabel("E-mail").fill("visitante@example.com");
  await form.getByLabel("Empresa (opcional)").fill("W_Flyer");
  await form.getByLabel("Tipo de projeto").selectOption("site-institucional");
  await form
    .getByLabel("Mensagem")
    .fill("Preciso conversar sobre um projeto digital sob medida.");
  // Visual tests prepare the authored state directly; real actionability stays
  // covered by the E2E and axe suites.
  await consent.check({ force: true });
  await expect(consent).toBeChecked();
  return form;
}

async function verify(form: ReturnType<Page["getByRole"]>) {
  await form
    .getByRole("button", { name: "Concluir verificação de teste" })
    .click();
}

async function expectFormScreenshot(
  form: ReturnType<Page["getByRole"]>,
  name: string,
) {
  const page = form.page();
  await form.evaluate((element) => {
    element.scrollIntoView({ block: "center", inline: "nearest" });
  });
  await stabilizeVisualCapture(page, { stateLocator: form });
  await expect(form).toHaveScreenshot(name, {
    timeout: 10_000,
  });
}

test("contact idle", async ({ page }) => {
  const form = await openContact(page);
  await expectFormScreenshot(form, "contact-idle.png");
});

test("contact field error", async ({ page }) => {
  const form = await openContact(page);
  const name = form.getByLabel("Nome");
  const projectType = form.getByLabel("Tipo de projeto");
  const status = page.locator("#contact-form-status");
  await verify(form);
  // Exercise the authored invalid state without capturing browser-native UI.
  // Native submit validation remains covered by the E2E and axe suites.
  await name.fill("A");
  await name.fill("");
  await form.getByLabel("E-mail").fill("invalid@example");
  await form.getByLabel("E-mail").fill("");
  await projectType.focus();
  await projectType.press("ArrowDown");
  await projectType.press("Home");
  await expect(projectType).toHaveValue("");
  await form.getByLabel("Mensagem").fill("Mensagem temporária");
  await form.getByLabel("Mensagem").fill("");
  await form.getByLabel(/Li a Política de Privacidade/u).check();
  await form.getByLabel(/Li a Política de Privacidade/u).uncheck();
  await name.dispatchEvent("invalid");
  await expect(form).toHaveAttribute("data-contact-form", "validation-error");
  await waitForStableFrames(page);
  await status.focus();
  await expect(status).toBeFocused();
  await expectFormScreenshot(form, "contact-field-error.png");
});

test("contact verified", async ({ page }) => {
  const form = await openContact(page);
  await fillValidForm(page);
  await verify(form);
  await expectFormScreenshot(form, "contact-verified.png");
});

test("contact submitting", async ({ page }) => {
  let releaseResponse: (() => void) | undefined;
  await page.route("**/api/contact", async (route) => {
    await new Promise<void>((resolve) => {
      releaseResponse = resolve;
    });
    await route.fulfill({ body: "{\"ok\":true}", contentType: "application/json" });
  });
  const form = await openContact(page);
  await fillValidForm(page);
  await verify(form);
  void form.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(form).toHaveAttribute("data-contact-form", "submitting");
  await expectFormScreenshot(form, "contact-submitting.png");
  releaseResponse?.();
});

test("contact success", async ({ page }) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({ body: "{\"ok\":true}", contentType: "application/json" }),
  );
  const form = await openContact(page);
  await fillValidForm(page);
  await verify(form);
  await form.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(form).toHaveAttribute("data-contact-form", "success");
  await expectFormScreenshot(form, "contact-success.png");
});

test("contact provider error", async ({ page }) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      body: "{\"code\":\"service_unavailable\",\"ok\":false}",
      contentType: "application/json",
      status: 503,
    }),
  );
  const form = await openContact(page);
  await fillValidForm(page);
  await verify(form);
  await form.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(form).toHaveAttribute("data-contact-form", "error");
  await expectFormScreenshot(form, "contact-provider-error.png");
});

test("contact dark", async ({ page }) => {
  await mockTurnstile(page);
  await page.setViewportSize({ height: 2000, width: 1440 });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/contato");
  await page.evaluate(() => localStorage.setItem("wf-theme", "dark"));
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Concluir verificação de teste" }),
  ).toBeVisible();
  await expectFormScreenshot(
    page.getByRole("form", { name: "Formulário de contato" }),
    "contact-dark.png",
  );
});

test("contact mobile", async ({ page }) => {
  await mockTurnstile(page);
  await page.setViewportSize({ height: 1600, width: 320 });
  await page.goto("/contato");
  await expect(
    page.getByRole("button", { name: "Concluir verificação de teste" }),
  ).toBeVisible();
  await expectFormScreenshot(
    page.getByRole("form", { name: "Formulário de contato" }),
    "contact-mobile.png",
  );
});

test("contact reduced motion", async ({ page }) => {
  await mockTurnstile(page);
  await page.setViewportSize({ height: 2000, width: 1440 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/contato");
  await expect(
    page.getByRole("button", { name: "Concluir verificação de teste" }),
  ).toBeVisible();
  await expectFormScreenshot(
    page.getByRole("form", { name: "Formulário de contato" }),
    "contact-reduced-motion.png",
  );
});
