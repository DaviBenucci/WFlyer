import { expect, type Locator, type Page } from "@playwright/test";

type VisualColorScheme = "dark" | "light";
type VisualReducedMotion = "no-preference" | "reduce";

export async function prepareVisualCapture(
  page: Page,
  options: {
    readonly colorScheme?: VisualColorScheme;
    readonly reducedMotion?: VisualReducedMotion;
    readonly theme?: VisualColorScheme;
    readonly viewport?: { readonly height: number; readonly width: number };
  } = {},
): Promise<void> {
  if (options.viewport) {
    await page.setViewportSize(options.viewport);
  }

  if (options.colorScheme || options.reducedMotion) {
    await page.emulateMedia({
      ...(options.colorScheme ? { colorScheme: options.colorScheme } : {}),
      ...(options.reducedMotion
        ? { reducedMotion: options.reducedMotion }
        : {}),
    });
  }

  if (options.theme) {
    await page.addInitScript((theme) => {
      window.localStorage.setItem("wf-theme", theme);
    }, options.theme);
  }
}

export async function waitForVisualDocument(page: Page): Promise<void> {
  await expect
    .poll(() => page.evaluate(() => document.readyState), {
      message: "document.readyState should be complete before capture",
    })
    .toBe("complete");

  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await expect
    .poll(() => page.evaluate(() => document.fonts.status), {
      message: "document fonts should be loaded before capture",
    })
    .toBe("loaded");
}

export async function waitForStableFrames(page: Page): Promise<void> {
  await page.evaluate(
    () =>
      new Promise<void>((resolveFrames) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolveFrames());
        });
      }),
  );
}

export async function stabilizeVisualCapture(
  page: Page,
  options: {
    readonly readyAttribute?: {
      readonly name: string;
      readonly value: string;
    };
    readonly stateLocator?: Locator;
  } = {},
): Promise<void> {
  await waitForVisualDocument(page);

  if (options.stateLocator) {
    await expect(options.stateLocator).toBeVisible();
    if (options.readyAttribute) {
      await expect(options.stateLocator).toHaveAttribute(
        options.readyAttribute.name,
        options.readyAttribute.value,
      );
    }
  }

  await waitForStableFrames(page);

  if (options.stateLocator) {
    await expect(options.stateLocator).toBeVisible();
    if (options.readyAttribute) {
      await expect(options.stateLocator).toHaveAttribute(
        options.readyAttribute.name,
        options.readyAttribute.value,
      );
    }
  }
}
