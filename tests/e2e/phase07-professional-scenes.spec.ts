import { expect, test, type Locator, type Page } from "@playwright/test";
import axe from "axe-core";

import { mockTurnstile } from "../helpers/turnstile";

const productionServer =
  process.env.WFLYER_PLAYWRIGHT_TEST_SERVER === "production";
const MOTION_PATH = "/__visual-lab/story/motion";
const BOOTSTRAP_ROOT = "[data-story-bootstrap]";
const MOTION_ROOT = "main[data-motion-lab]";

const PROFESSIONAL_CHAPTER_IDS = [
  "professional-about",
  "professional-services",
  "professional-process",
  "professional-projects",
  "professional-contact",
  "professional-terminal",
] as const;

const PROFESSIONAL_SCENES = [
  "about",
  "services",
  "process",
  "projects",
  "contact",
  "terminal",
] as const;

const PROJECT_DESTINATIONS = [
  ["W_Flyer", "/portfolio/w-flyer"],
  ["MSN Distribuidora", "/portfolio/msn-distribuidora"],
  ["MSN Suprimentos", "/portfolio/msn-suprimentos"],
] as const;

interface Bounds {
  readonly bottom: number;
  readonly left: number;
  readonly right: number;
  readonly top: number;
}

interface RelevantFinding {
  readonly help: string;
  readonly id: string;
  readonly impact: string | null;
  readonly targets: readonly string[];
}

async function openMotionLab(page: Page, suffix = "") {
  const response = await page.goto(`${MOTION_PATH}${suffix}`, {
    waitUntil: "domcontentloaded",
  });
  expect(response?.ok()).toBe(true);
  await expect(page.locator(BOOTSTRAP_ROOT)).toHaveAttribute(
    "data-bootstrap-state",
    "REVEALED",
    { timeout: 10_000 },
  );
  await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
    "data-motion-lifecycle",
    "mounted",
  );
}

async function positionImmediately(page: Page, chapterId: string) {
  await page.evaluate(async (requestedChapterId) => {
    const controller = window.__WFLYER_PHASE5_MOTION__;
    if (controller === undefined) throw new Error("Missing motion controller.");
    await controller.position(
      requestedChapterId as Parameters<typeof controller.position>[0],
    );
  }, chapterId);
  await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
    "data-motion-active-chapter",
    chapterId,
  );
}

async function sceneAndStageBounds(
  page: Page,
  chapterId: (typeof PROFESSIONAL_CHAPTER_IDS)[number],
): Promise<{ readonly scene: Bounds; readonly stage: Bounds }> {
  return page.evaluate((requestedChapterId) => {
    const scene = document.querySelector<HTMLElement>(
      `[data-chapter-id="${requestedChapterId}"] [data-professional-scene]`,
    );
    const stage = document.querySelector<HTMLElement>("[data-motion-stage]");
    if (scene === null || stage === null) {
      throw new Error(`Missing scene geometry for ${requestedChapterId}.`);
    }

    const serialize = (rectangle: DOMRect): Bounds => ({
      bottom: rectangle.bottom,
      left: rectangle.left,
      right: rectangle.right,
      top: rectangle.top,
    });

    return {
      scene: serialize(scene.getBoundingClientRect()),
      stage: serialize(stage.getBoundingClientRect()),
    };
  }, chapterId);
}

function expectContained(
  inner: Bounds,
  outer: Bounds,
  label: string,
  tolerance = 3,
) {
  expect(inner.left, `${label} left edge`).toBeGreaterThanOrEqual(
    outer.left - tolerance,
  );
  expect(inner.right, `${label} right edge`).toBeLessThanOrEqual(
    outer.right + tolerance,
  );
  expect(inner.top, `${label} top edge`).toBeGreaterThanOrEqual(
    outer.top - tolerance,
  );
  expect(inner.bottom, `${label} bottom edge`).toBeLessThanOrEqual(
    outer.bottom + tolerance,
  );
}

async function selectedCardBounds(item: Locator): Promise<{
  readonly bounds: Bounds;
  readonly cardBoxShadow: string;
  readonly outlineStyle: string;
  readonly outlineWidth: number;
  readonly rotationDegrees: number;
  readonly scale: number;
  readonly transform: string;
  readonly translateY: number;
  readonly zIndex: number;
}> {
  return item.evaluate((element) => {
    const link = element.querySelector<HTMLElement>("[data-project-card-link]");
    const card = element.querySelector<HTMLElement>("[data-project-card]");
    if (link === null || card === null) {
      throw new Error("Project card structure is incomplete.");
    }
    const rectangle = link.getBoundingClientRect();
    const itemStyle = getComputedStyle(element);
    const linkStyle = getComputedStyle(link);
    const transform = new DOMMatrix(itemStyle.transform);
    const outlineClearance =
      Number.parseFloat(linkStyle.outlineWidth) +
      Number.parseFloat(linkStyle.outlineOffset);

    return {
      bounds: {
        bottom: rectangle.bottom + outlineClearance,
        left: rectangle.left - outlineClearance,
        right: rectangle.right + outlineClearance,
        top: rectangle.top - outlineClearance,
      },
      cardBoxShadow: getComputedStyle(card).boxShadow,
      outlineStyle: linkStyle.outlineStyle,
      outlineWidth: Number.parseFloat(linkStyle.outlineWidth),
      rotationDegrees:
        (Math.atan2(transform.b, transform.a) * 180) / Math.PI,
      scale: Math.hypot(transform.a, transform.b),
      transform: itemStyle.transform,
      translateY: transform.f,
      zIndex: Number.parseInt(itemStyle.zIndex, 10),
    };
  });
}

async function relevantFindings(
  page: Page,
  selector: string,
): Promise<RelevantFinding[]> {
  return page.evaluate(async (contextSelector) => {
    const axeWindow = window as typeof window & {
      axe: typeof import("axe-core");
    };
    const context = document.querySelector(contextSelector);
    if (context === null) throw new Error(`Missing axe context: ${contextSelector}`);
    const results = await axeWindow.axe.run(context, {
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

    return [
      ...results.violations,
      ...results.incomplete.filter(({ id }) => id === "aria-hidden-focus"),
    ]
      .filter(({ impact }) => impact === "critical" || impact === "serious")
      .map(({ help, id, impact, nodes }) => ({
        help,
        id,
        impact: impact ?? null,
        targets: nodes.map(({ target }) => JSON.stringify(target)),
      }));
  }, selector);
}

test("the Phase-7 professional-scene lab remains development-only", async ({
  page,
  request,
}) => {
  const response = await page.goto(MOTION_PATH, {
    waitUntil: "domcontentloaded",
  });

  if (!productionServer) {
    expect(response?.ok()).toBe(true);
    await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
      "data-professional-scenes",
      "phase-7",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/u,
    );
    return;
  }

  expect(response?.status()).toBe(404);
  await expect(page.locator('[data-professional-scenes="phase-7"]')).toHaveCount(
    0,
  );
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("__visual-lab");
});

test.describe("Phase-7 professional branch scenes", () => {
  test.skip(productionServer, "Development-only Phase-7 review surface");

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1536 });
  });

  test("renders the approved professional sequence and exact scene contracts", async ({
    page,
  }) => {
    await openMotionLab(page);

    expect(
      await page
        .locator(`${MOTION_ROOT} [data-chapter-id^="professional-"]`)
        .evaluateAll((chapters) =>
          chapters.map((chapter) => chapter.getAttribute("data-chapter-id")),
        ),
    ).toEqual(PROFESSIONAL_CHAPTER_IDS);
    expect(
      await page.locator("[data-professional-scene]").evaluateAll((scenes) =>
        scenes.map((scene) => scene.getAttribute("data-professional-scene")),
      ),
    ).toEqual(PROFESSIONAL_SCENES);
    await expect(
      page.locator('[data-story-scene-contract="phase-7"]'),
    ).toHaveCount(6);

    const persona = page.locator('[data-persona-slot="required"]');
    await expect(persona).toHaveAttribute(
      "data-persona-status",
      "pending-owner-approval",
    );
    await expect(persona).toHaveAttribute(
      "data-persona-phase-10",
      "deferred",
    );
    await expect(persona.locator("canvas, img, picture, svg, video")).toHaveCount(
      0,
    );

    const services = page.locator('[data-professional-scene="services"]');
    await expect(services.locator("[data-service-module]")).toHaveCount(4);
    expect(
      await services.locator("[data-service-module] h3").allTextContents(),
    ).toEqual(["Sites", "Aplicações", "Integrações", "Soluções sob medida"]);
    expect(
      await services.locator("[data-service-module] a").evaluateAll((links) =>
        links.map((link) => link.getAttribute("href")),
      ),
    ).toEqual([
      "/servicos/criacao-de-sites",
      "/servicos/criacao-de-aplicacoes",
      "/servicos/integracoes",
      "/servicos/solucoes-sob-medida",
    ]);

    const process = page.locator('[data-professional-scene="process"]');
    await expect(process.locator("[data-process-stage]")).toHaveCount(4);
    expect(
      await process.locator("[data-process-stage] h3").allTextContents(),
    ).toEqual([
      "Descoberta e contexto",
      "Escopo e direção",
      "Implementação incremental",
      "Validação e evolução",
    ]);
    await expect(process.locator("button, input, select, textarea")).toHaveCount(
      0,
    );

    const projectLinks = page.locator("[data-project-card-link]");
    await expect(projectLinks).toHaveCount(3);
    for (const [title, destination] of PROJECT_DESTINATIONS) {
      await expect(
        page.getByRole("link", { name: `Conhecer o projeto ${title}` }),
      ).toHaveAttribute("href", destination);
    }

    const contact = page.locator('[data-professional-scene="contact"]');
    await expect(contact).toHaveAttribute(
      "data-persona-optional-appearance",
      "forbidden",
    );
    await expect(
      contact.getByRole("form", { name: "Formulário de contato" }),
    ).toHaveAttribute("data-contact-compact", "true");
  });

  test("keeps the desktop fan identifiable, focus-equivalent, and unclipped", async ({
    page,
  }) => {
    await openMotionLab(page, "#projetos");
    await positionImmediately(page, "professional-projects");
    await page.waitForTimeout(350);

    const stageBounds = await page.locator("[data-motion-stage]").evaluate(
      (stage): Bounds => {
        const rectangle = stage.getBoundingClientRect();
        return {
          bottom: rectangle.bottom,
          left: rectangle.left,
          right: rectangle.right,
          top: rectangle.top,
        };
      },
    );
    const items = page.locator("[data-project-card-item]");
    const restingBounds = await items.evaluateAll((cards) =>
      cards.map((card) => {
        const rectangle = card.getBoundingClientRect();
        const projectCard = card.querySelector<HTMLElement>(
          "[data-project-card]",
        );
        return {
          boxShadow:
            projectCard === null ? "missing" : getComputedStyle(projectCard).boxShadow,
          left: rectangle.left,
          right: rectangle.right,
          transform: getComputedStyle(card).transform,
        };
      }),
    );
    expect(restingBounds[1]?.left).toBeLessThan(restingBounds[0]?.right ?? 0);
    expect(restingBounds[2]?.left).toBeLessThan(restingBounds[1]?.right ?? 0);
    expect(new Set(restingBounds.map(({ transform }) => transform)).size).toBe(3);

    const firstItem = items.first();
    const firstLink = firstItem.locator("[data-project-card-link]");
    await firstLink.hover({ position: { x: 100, y: 200 } });
    await expect
      .poll(
        async () => {
          const state = await selectedCardBounds(firstItem);
          return {
            hovered: await firstItem.evaluate((element) =>
              element.matches(":hover"),
            ),
            raised: state.translateY < -17,
            scaled: state.scale > 1.024,
            straight: Math.abs(state.rotationDegrees) < 0.02,
            zIndex: state.zIndex,
          };
        },
        { timeout: 5_000 },
      )
      .toEqual({
        hovered: true,
        raised: true,
        scaled: true,
        straight: true,
        zIndex: 13,
      });
    const hoverState = await selectedCardBounds(firstItem);
    await page.mouse.move(1, 1);
    await firstLink.focus();
    await expect(firstLink).toBeFocused();
    await expect
      .poll(async () => {
        const state = await selectedCardBounds(firstItem);
        return {
          raised: state.translateY < -17,
          scaled: state.scale > 1.024,
          straight: Math.abs(state.rotationDegrees) < 0.02,
          zIndex: state.zIndex,
        };
      })
      .toEqual({ raised: true, scaled: true, straight: true, zIndex: 13 });
    const focusState = await selectedCardBounds(firstItem);
    expect(hoverState.cardBoxShadow).not.toBe("none");
    expect(hoverState.cardBoxShadow).not.toBe(restingBounds[0]?.boxShadow);
    expect(focusState.cardBoxShadow).not.toBe("none");
    expect(focusState.cardBoxShadow).not.toBe(restingBounds[0]?.boxShadow);
    expect(focusState.zIndex).toBe(hoverState.zIndex);
    expect(focusState.scale).toBeCloseTo(hoverState.scale, 2);
    expect(focusState.rotationDegrees).toBeCloseTo(0, 1);
    expect(hoverState.rotationDegrees).toBeCloseTo(0, 1);

    await page.addStyleTag({
      content:
        "[data-project-card-item], [data-project-card] { transition: none !important; }",
    });

    for (let index = 0; index < (await items.count()); index += 1) {
      const item = items.nth(index);
      const link = item.locator("[data-project-card-link]");
      await link.focus();
      await expect(link).toBeFocused();
      const selection = await selectedCardBounds(item);
      expect(selection.outlineStyle).not.toBe("none");
      expect(selection.outlineWidth).toBeGreaterThan(0);
      expect(selection.zIndex).toBeGreaterThan(3);
      expectContained(selection.bounds, stageBounds, `selected project ${index + 1}`);
    }
  });

  test("fits every scene at the minimum enhanced capacity, including verified Contact", async ({
    page,
  }) => {
    await mockTurnstile(page);
    await page.setViewportSize({ height: 640, width: 1100 });
    await openMotionLab(page);
    await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
      "data-projection-mode",
      "horizontal-enhanced",
    );

    for (const chapterId of PROFESSIONAL_CHAPTER_IDS) {
      await positionImmediately(page, chapterId);
      const initialBounds = await sceneAndStageBounds(page, chapterId);
      expectContained(initialBounds.scene, initialBounds.stage, chapterId);

      if (chapterId === "professional-contact") {
        const form = page.getByRole("form", { name: "Formulário de contato" });
        await form.getByLabel("Nome").focus();
        await expect(
          form.getByRole("button", {
            name: "Concluir verificação de teste",
          }),
        ).toBeVisible();
        const verifiedBounds = await sceneAndStageBounds(page, chapterId);
        expectContained(
          verifiedBounds.scene,
          verifiedBounds.stage,
          `${chapterId} after verification activation`,
        );
      }
    }
  });

  test("provides a staggered, non-carousel project stack with touch activation", async ({
    baseURL,
    browser,
  }) => {
    const context = await browser.newContext({
      ...(baseURL === undefined ? {} : { baseURL }),
      hasTouch: true,
      locale: "pt-BR",
      reducedMotion: "no-preference",
      viewport: { height: 844, width: 390 },
    });
    const page = await context.newPage();

    try {
      await openMotionLab(page, "#projetos");
      await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
        "data-projection-mode",
        "vertical-compact",
      );
      const items = page.locator("[data-project-card-item]");
      await expect(items).toHaveCount(3);
      const stack = await items.evaluateAll((cards) =>
        cards.map((card) => {
          const rectangle = card.getBoundingClientRect();
          return {
            bottom: rectangle.bottom,
            left: rectangle.left,
            right: rectangle.right,
            top: rectangle.top,
            transform: getComputedStyle(card).transform,
          };
        }),
      );
      expect(stack[1]?.top).toBeGreaterThan(stack[0]?.bottom ?? 0);
      expect(stack[2]?.top).toBeGreaterThan(stack[1]?.bottom ?? 0);
      expect(Math.abs((stack[0]?.left ?? 0) - (stack[1]?.left ?? 0))).toBeGreaterThan(
        5,
      );
      for (const card of stack) {
        expect(card.left).toBeGreaterThanOrEqual(-1);
        expect(card.right).toBeLessThanOrEqual(391);
        expect(card.transform).toBe("none");
      }
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      ).toBe(true);

      const firstLink = items.first().locator("[data-project-card-link]");
      await firstLink.scrollIntoViewIfNeeded();
      await page.evaluate(() => {
        const link = document.querySelector<HTMLAnchorElement>(
          "[data-project-card-link]",
        );
        link?.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            document.body.dataset.phase7TouchProject = "activated";
          },
          { once: true },
        );
      });
      await firstLink.tap();
      await expect(page.locator("body")).toHaveAttribute(
        "data-phase7-touch-project",
        "activated",
      );
    } finally {
      await context.close();
    }
  });

  test("keeps compact Contact controls and terminal boundaries inside the vertical document", async ({
    page,
  }) => {
    await mockTurnstile(page);
    await page.setViewportSize({ height: 844, width: 390 });
    await openMotionLab(page, "#contato");
    await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
      "data-projection-mode",
      "vertical-compact",
    );
    await positionImmediately(page, "professional-contact");

    const form = page.getByRole("form", { name: "Formulário de contato" });
    await form.getByLabel("Nome").focus();
    await expect(form).toHaveAttribute("data-contact-editing", "true");
    await expect(
      form.getByRole("button", { name: "Concluir verificação de teste" }),
    ).toBeVisible();

    const controls = form.locator(
      'input:not([name="website"]):not([type="checkbox"]), select, textarea, button',
    );
    for (let index = 0; index < (await controls.count()); index += 1) {
      const bounds = await controls.nth(index).boundingBox();
      expect(bounds, `compact Contact control ${index + 1}`).not.toBeNull();
      expect(bounds?.x ?? -1).toBeGreaterThanOrEqual(0);
      expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(390);
      expect(bounds?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
    expect(
      (await form
        .getByLabel(/Li a Política de Privacidade/u)
        .locator("..")
        .boundingBox())?.height ?? 0,
    ).toBeGreaterThanOrEqual(44);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);

    await positionImmediately(page, "professional-terminal");
    const terminalScene = page.locator('[data-professional-scene="terminal"]');
    await terminalScene.scrollIntoViewIfNeeded();
    await expect(
      terminalScene.locator(
        '[data-final-barline-before="professional-terminal"]',
      ),
    ).toBeVisible();
    await expect(
      terminalScene.locator('[data-branch-terminal="professional"]'),
    ).toBeVisible();
    await expect(terminalScene.locator("footer")).toHaveCount(0);
  });

  test("defers verification until Contact editing and excludes Persona appearances", async ({
    page,
  }) => {
    await mockTurnstile(page);
    await openMotionLab(page, "#contato");
    await positionImmediately(page, "professional-contact");
    const contact = page.locator('[data-professional-scene="contact"]');
    const form = contact.getByRole("form", { name: "Formulário de contato" });

    await expect(form).toHaveAttribute("data-contact-editing", "false");
    await expect(form.locator("[data-verification-state]")).toHaveAttribute(
      "data-verification-state",
      "deferred",
    );
    await expect(page.locator("#cloudflare-turnstile")).toHaveCount(0);
    await expect(form.locator("[data-turnstile-container]")).toHaveCount(0);

    await form.getByLabel("Nome").fill("Pessoa Visitante");
    await expect(form).toHaveAttribute("data-contact-editing", "true");
    await expect(page.locator("#cloudflare-turnstile")).toHaveCount(1);
    await expect(
      form.getByRole("button", { name: "Concluir verificação de teste" }),
    ).toBeVisible();
    await expect(form.locator("[data-verification-state]")).toHaveAttribute(
      "data-verification-state",
      "ready",
    );
    await expect(contact).toHaveAttribute(
      "data-persona-optional-appearance",
      "forbidden",
    );
    await expect(
      contact.locator(
        '[data-persona-easter-egg], [data-persona-slot], [data-persona-optional-appearance]:not([data-persona-optional-appearance="forbidden"])',
      ),
    ).toHaveCount(0);
    await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
      "data-motion-active-chapter",
      "professional-contact",
    );
  });

  test("places the structural final barline before the professional terminal", async ({
    page,
  }) => {
    await openMotionLab(page);
    await positionImmediately(page, "professional-terminal");
    const terminalScene = page.locator('[data-professional-scene="terminal"]');
    const barline = terminalScene.locator(
      '[data-final-barline-before="professional-terminal"]',
    );
    const terminal = terminalScene.locator(
      '[data-branch-terminal="professional"]',
    );

    await expect(barline).toHaveAttribute(
      "data-score-integration-status",
      "phase-9-pending",
    );
    await expect(barline).toHaveAttribute("aria-hidden", "true");
    const barlineGeometry = await barline.evaluate((element) => {
      const strokes = Array.from(element.children, (child) =>
        child.getBoundingClientRect().width,
      );
      return {
        gap: Number.parseFloat(getComputedStyle(element).gap),
        strokes,
      };
    });
    expect(barlineGeometry.strokes).toHaveLength(2);
    expect(barlineGeometry.strokes[0]).toBeLessThan(
      barlineGeometry.strokes[1] ?? 0,
    );
    expect(barlineGeometry.gap).toBeGreaterThan(0);
    expect(
      await terminalScene.evaluate((scene) => {
        const structuralBarline = scene.querySelector(
          '[data-final-barline-before="professional-terminal"]',
        );
        const branchTerminal = scene.querySelector(
          '[data-branch-terminal="professional"]',
        );
        if (structuralBarline === null || branchTerminal === null) return false;
        return Boolean(
          structuralBarline.compareDocumentPosition(branchTerminal) &
            Node.DOCUMENT_POSITION_FOLLOWING,
        );
      }),
    ).toBe(true);
    await expect(terminal).toBeInViewport();
    await expect(terminalScene.locator("footer")).toHaveCount(0);
    await expect(
      terminalScene.getByRole("navigation", {
        name: "Conclusão do percurso profissional",
      }),
    ).toBeVisible();
  });

  test("preserves professional content across resize, reduced motion, and driver failure", async ({
    page,
  }) => {
    await openMotionLab(page, "#projetos");
    await expect(page.locator("[data-project-card-link]")).toHaveCount(3);

    await page.setViewportSize({ height: 900, width: 700 });
    await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
      "data-projection-mode",
      "vertical-compact",
      { timeout: 5_000 },
    );
    await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
      "data-motion-active-chapter",
      "professional-projects",
    );

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
      "data-projection-mode",
      "static",
      { timeout: 5_000 },
    );
    await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
      "data-motion-active-chapter",
      "professional-projects",
    );
    await expect(page.locator("[data-project-card-link]")).toHaveCount(3);

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize({ height: 900, width: 1536 });
    await page.goto(`${MOTION_PATH}?scenario=motion-failure#contato`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator(BOOTSTRAP_ROOT)).toHaveAttribute(
      "data-bootstrap-state",
      "REVEALED",
      { timeout: 10_000 },
    );
    await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
      "data-projection-mode",
      "vertical-wide",
    );
    expect(
      await page.evaluate(() =>
        window.__WFLYER_PHASE5_MOTION__?.snapshot().projectionReason,
      ),
    ).toBe("driver-failure");
    await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
      "data-motion-active-chapter",
      "professional-contact",
    );
    await expect(
      page.getByRole("form", { name: "Formulário de contato" }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
  });

  test("passes axe for focused Projects and an actively edited Contact scene", async ({
    page,
  }) => {
    await page.addInitScript({ content: axe.source });
    await mockTurnstile(page);
    await openMotionLab(page, "#projetos");
    await positionImmediately(page, "professional-projects");
    await page.locator("[data-project-card-link]").first().focus();
    expect(
      await relevantFindings(
        page,
        '[data-chapter-id="professional-projects"]',
      ),
    ).toEqual([]);

    await positionImmediately(page, "professional-contact");
    const contactForm = page.getByRole("form", {
      name: "Formulário de contato",
    });
    await contactForm.getByLabel("Nome").fill("Pessoa Visitante");
    await expect(
      contactForm.getByRole("button", {
        name: "Concluir verificação de teste",
      }),
    ).toBeVisible();
    expect(
      await relevantFindings(page, '[data-chapter-id="professional-contact"]'),
    ).toEqual([]);
  });
});
