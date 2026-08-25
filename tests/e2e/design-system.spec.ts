import { expect, test } from "@playwright/test";

test("o tema alterna, persiste e preserva a geometria do header", async ({
  page,
}) => {
  await page.goto("/");

  const root = page.locator("html");
  const header = page.getByRole("banner");
  const toggle = page.getByRole("button", { name: "Tema escuro" });
  const lightHeaderBox = await header.boundingBox();

  await expect(root).toHaveAttribute("data-theme", "light");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.click();

  await expect(root).toHaveAttribute("data-theme", "dark");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => localStorage.getItem("wf-theme"))).toBe("dark");

  const darkHeaderBox = await header.boundingBox();
  expect(darkHeaderBox?.width).toBe(lightHeaderBox?.width);
  expect(darkHeaderBox?.height).toBe(lightHeaderBox?.height);

  await page.reload();
  await expect(root).toHaveAttribute("data-theme", "dark");
});

test("o menu mobile fecha por Escape e devolve o foco", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Abrir menu" });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Navegação W_Flyer" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Aplicação" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Sobre" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Projetos" })).toBeVisible();
  await expect(
    dialog.getByRole("link", { name: /Acessar (?:app|W_Flyer)/u }),
  ).toHaveCount(0);

  await page.keyboard.press("Escape");

  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("o menu mobile contém o foco e fecha por clique externo", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 844 });
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Abrir menu" });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Navegação W_Flyer" });
  const closeButton = dialog.getByRole("button", { name: "Fechar menu" });
  const lastLink = dialog.getByRole("link", { name: "Contato" });

  await expect(closeButton).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(lastLink).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(closeButton).toBeFocused();

  await page.locator("body").click({ position: { x: 2, y: 420 } });
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("o menu fecha ao cruzar o breakpoint desktop sem perder o foco", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: "Abrir menu" }).click();
  await expect(
    page.getByRole("dialog", { name: "Navegação W_Flyer" }),
  ).toBeVisible();

  await page.setViewportSize({ width: 1200, height: 844 });

  const desktopHomeLink = page.getByRole("link", {
    name: "W_Flyer — voltar à página inicial",
  });
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(desktopHomeLink).toBeVisible();
  await expect(desktopHomeLink).toBeFocused();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.getByRole("button", { name: "Abrir menu" })).toBeVisible();
});
