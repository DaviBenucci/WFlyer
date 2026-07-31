import { expect, test, type Page } from "@playwright/test";
import axe from "axe-core";

async function mockTurnstile(page: Page) {
  await page.route("**/turnstile/v0/api.js**", (route) =>
    route.fulfill({
      body: `
        window.turnstile = {
          render: function (container, options) {
            var button = document.createElement("button");
            button.type = "button";
            button.textContent = "Concluir verificação de teste";
            button.onclick = function () { options.callback("axe-token"); };
            container.appendChild(button);
            return "axe-widget";
          },
          remove: function () {},
          reset: function () {}
        };
      `,
      contentType: "application/javascript; charset=utf-8",
    }),
  );
}

async function expectNoSeriousViolations(page: Page, state: string) {
  const violations = await page.evaluate(async () => {
    const axeWindow = window as typeof window & {
      axe: typeof import("axe-core");
    };
    const results = await axeWindow.axe.run(document, {
      resultTypes: ["violations", "incomplete"],
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
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
        impact,
        targets: nodes.map(({ target }) => target),
      }));
  });
  expect(violations, state).toEqual([]);
}

async function fillValidForm(page: Page) {
  const form = page.getByRole("form", { name: "Formulário de contato" });
  await form.getByLabel("Nome").fill("Pessoa Visitante");
  await form.getByLabel("E-mail").fill("visitante@example.com");
  await form.getByLabel("Tipo de projeto").selectOption("outro");
  await form
    .getByLabel("Mensagem")
    .fill("Esta é uma mensagem válida para a auditoria de acessibilidade.");
  await form.getByLabel(/Li a Política de Privacidade/u).check();
  return form;
}

test("idle, validation, verification, submitting, and success pass axe", async ({
  page,
}) => {
  await page.addInitScript({ content: axe.source });
  await mockTurnstile(page);
  let releaseResponse: (() => void) | undefined;
  await page.route("**/api/contact", async (route) => {
    await new Promise<void>((resolve) => {
      releaseResponse = resolve;
    });
    await route.fulfill({
      body: JSON.stringify({ ok: true }),
      contentType: "application/json",
    });
  });
  await page.goto("/contato");
  const form = page.getByRole("form", { name: "Formulário de contato" });

  await expectNoSeriousViolations(page, "idle");
  await form
    .getByRole("button", { name: "Concluir verificação de teste" })
    .click();
  await expectNoSeriousViolations(page, "verified");
  await form.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(form).toHaveAttribute("data-contact-form", "validation-error");
  await expectNoSeriousViolations(page, "validation-error");

  await fillValidForm(page);
  await form
    .getByRole("button", { name: "Concluir verificação de teste" })
    .click();
  void form.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(form).toHaveAttribute("data-contact-form", "submitting");
  await expectNoSeriousViolations(page, "submitting");
  releaseResponse?.();
  await expect(form).toHaveAttribute("data-contact-form", "success");
  await expectNoSeriousViolations(page, "success");
});

test("provider error passes axe and keeps editable context", async ({ page }) => {
  await page.addInitScript({ content: axe.source });
  await mockTurnstile(page);
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      body: JSON.stringify({ code: "service_unavailable", ok: false }),
      contentType: "application/json",
      status: 503,
    }),
  );
  await page.goto("/contato");
  const form = await fillValidForm(page);
  await form
    .getByRole("button", { name: "Concluir verificação de teste" })
    .click();
  await form.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(form).toHaveAttribute("data-contact-form", "error");

  await expectNoSeriousViolations(page, "provider-error");
  await expect(form.getByLabel("Nome")).toBeEnabled();
});

test("mobile dark reduced-motion form passes axe", async ({ page }) => {
  await page.addInitScript({ content: axe.source });
  await mockTurnstile(page);
  await page.setViewportSize({ height: 844, width: 320 });
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/contato");
  await page.evaluate(() => localStorage.setItem("wf-theme", "dark"));
  await page.reload();

  await expectNoSeriousViolations(page, "mobile-dark-reduced-motion");
});
