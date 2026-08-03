import type { Page } from "@playwright/test";

export async function mockTurnstile(page: Page): Promise<void> {
  await page.route("**/turnstile/v0/api.js**", async (route) => {
    await route.fulfill({
      body: `
        window.turnstile = {
          render: function (container, options) {
            window.__wfTurnstileOptions = options;
            var button = document.createElement("button");
            button.type = "button";
            button.textContent = "Concluir verificação de teste";
            button.addEventListener("click", function () {
              options.callback("browser-test-token");
            });
            container.appendChild(button);
            return "browser-contact-widget";
          },
          remove: function () {},
          reset: function () {}
        };
      `,
      contentType: "application/javascript; charset=utf-8",
      status: 200,
    });
  });
}
