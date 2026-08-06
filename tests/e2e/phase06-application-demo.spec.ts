import { expect, test } from "@playwright/test";

test("tablet completes the local deterministic journey and restores defaults", async ({
  page,
}) => {
  await page.goto("/aplicacao-wflyer");

  const demo = page.locator("[data-application-demo]");
  const destinationKey = demo.getByLabel("Tom de destino");
  const action = demo.getByRole("button", { name: "Transpor" });

  await destinationKey.selectOption("g-major");
  await expect(demo).toHaveAttribute("data-demo-state", "configured");
  await action.click();
  await expect(demo).toHaveAttribute("data-demo-state", "result");
  await expect(demo.getByRole("status")).toContainText(
    "Trompete em Si bemol, Sol maior (G)",
  );
  await expect(demo.locator('[data-demo-score="result"]')).toBeVisible();

  const restore = demo.getByRole("button", {
    name: "Restaurar demonstração",
  });
  await expect(restore).toBeFocused();
  await restore.click();
  await expect(demo).toHaveAttribute("data-demo-state", "reset");
  await expect(demo.getByLabel("Instrumento de origem")).toHaveValue("piano");
  await expect(demo.getByLabel("Tom de origem")).toHaveValue("c-major");
  await expect(demo.getByLabel("Instrumento de destino")).toHaveValue(
    "trumpet-bb",
  );
  await expect(destinationKey).toHaveValue("bb-major");
});

test("native selects retain keyboard-visible focus", async ({ page }) => {
  await page.goto("/aplicacao-wflyer");

  const demo = page.locator("[data-application-demo]");
  const originInstrument = demo.getByLabel("Instrumento de origem");
  const originKey = demo.getByLabel("Tom de origem");

  await originInstrument.focus();
  await page.keyboard.press("Tab");
  await expect(originKey).toBeFocused();

  const focusPresentation = await originKey.evaluate((element) => {
    const style = getComputedStyle(element);

    return {
      directImplicitLabel: element.parentElement?.tagName === "LABEL",
      focusVisible: element.matches(":focus-visible"),
      outlineOffset: Number.parseFloat(style.outlineOffset),
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
      tagName: element.tagName,
    };
  });

  expect(focusPresentation).toMatchObject({
    directImplicitLabel: true,
    focusVisible: true,
    outlineStyle: "solid",
    tagName: "SELECT",
  });
  expect(focusPresentation.outlineWidth).toBeGreaterThanOrEqual(3);
  expect(focusPresentation.outlineOffset).toBeGreaterThanOrEqual(2);
});

test("tablet interaction emits no demo network, file, storage, or visitor logs", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const audit = {
      active: false,
      fileReads: 0,
      frameworkNetwork: [] as string[],
      logs: [] as string[],
      network: [] as string[],
      storage: [] as string[],
    };
    Object.defineProperty(window, "__wfDemoAudit", { value: audit });

    const originalFetch = window.fetch.bind(window);
    window.fetch = (...args) => {
      if (audit.active) {
        const input = args[0];
        const requestUrl = input instanceof Request ? input.url : String(input);
        const requestMethod =
          args[1]?.method ?? (input instanceof Request ? input.method : "GET");
        const url = new URL(requestUrl, window.location.href);
        const entry = `fetch:${url.href}`;
        const isRootRscPrefetch =
          requestMethod.toUpperCase() === "GET" &&
          url.origin === window.location.origin &&
          url.pathname === "/" &&
          url.searchParams.has("_rsc");

        // Next.js production prefetch is shell traffic, not tablet I/O.
        (isRootRscPrefetch
          ? audit.frameworkNetwork
          : audit.network
        ).push(entry);
      }
      return originalFetch(...args);
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string | URL,
      async?: boolean,
      username?: string | null,
      password?: string | null,
    ) {
      if (audit.active) audit.network.push(`xhr:${method}:${String(url)}`);
      if (async === undefined) {
        return (
          originalOpen as (
            this: XMLHttpRequest,
            method: string,
            url: string | URL,
          ) => void
        ).call(this, method, url);
      }
      return originalOpen.call(
        this,
        method,
        url,
        async,
        username,
        password,
      );
    };

    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = new Proxy(OriginalWebSocket, {
      construct(Target, args) {
        if (audit.active) audit.network.push(`websocket:${String(args[0])}`);
        return Reflect.construct(Target, args);
      },
    });

    const originalRead = FileReader.prototype.readAsArrayBuffer;
    FileReader.prototype.readAsArrayBuffer = function (...args) {
      if (audit.active) audit.fileReads += 1;
      return originalRead.apply(this, args);
    };

    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (audit.active) audit.storage.push(`${key}:${value}`);
      return originalSetItem.call(this, key, value);
    };

    const originalLog = console.log;
    console.log = (...args) => {
      if (audit.active) audit.logs.push(args.map(String).join(" "));
      originalLog(...args);
    };
  });

  await page.goto("/aplicacao-wflyer");
  await page.evaluate(() => {
    (window as typeof window & { __wfDemoAudit: { active: boolean } })
      .__wfDemoAudit.active = true;
  });

  const demo = page.locator("[data-application-demo]");
  await demo.getByLabel("Instrumento de origem").selectOption("violin");
  await demo.getByLabel("Tom de destino").selectOption("f-major");
  await demo.getByRole("button", { name: "Transpor" }).click();
  await expect(demo).toHaveAttribute("data-demo-state", "result");
  await demo
    .getByRole("button", { name: "Restaurar demonstração" })
    .click();

  const audit = await page.evaluate(() => {
    const audit = (
      window as typeof window & {
        __wfDemoAudit: {
          active: boolean;
          fileReads: number;
          frameworkNetwork: string[];
          logs: string[];
          network: string[];
          storage: string[];
        };
      }
    ).__wfDemoAudit;
    return {
      fileReads: audit.fileReads,
      frameworkNetwork: audit.frameworkNetwork,
      logs: audit.logs,
      network: audit.network,
      storage: audit.storage,
    };
  });
  expect(audit.fileReads).toBe(0);
  for (const request of audit.frameworkNetwork) {
    const url = new URL(request.slice("fetch:".length));
    expect(url.origin).toBe("http://127.0.0.1:3000");
    expect(url.pathname).toBe("/");
    expect(url.searchParams.has("_rsc")).toBe(true);
  }
  expect(audit.network).toEqual([]);
  expect(audit.storage).toEqual([]);
  expect(audit.logs.join(" ")).not.toMatch(
    /violin|f-major|Trompete em Si bemol|Fá maior/iu,
  );
});

test("reduced motion keeps the full result flow and removes tilt", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/aplicacao-wflyer");

  const demo = page.locator("[data-application-demo]");
  await demo.getByRole("button", { name: "Transpor" }).click();

  await expect(demo).toHaveAttribute("data-demo-state", "result");
  await expect(page.locator("[data-tablet-shell]")).toHaveCSS(
    "transform",
    "none",
  );
});

test("mobile tablet preserves 44px controls and prevents horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 320 });
  await page.goto("/aplicacao-wflyer");

  const demo = page.locator("[data-application-demo]");
  await expect(demo).toBeVisible();

  for (const control of await demo.locator("select, button").all()) {
    expect((await control.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  }

  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await expect(page.locator("[data-tablet-shell]")).toHaveCSS(
    "transform",
    "none",
  );
});

test("precise pointer tilt responds and returns to rest", async ({ page }) => {
  await page.setViewportSize({ height: 1024, width: 1536 });
  await page.goto("/aplicacao-wflyer");

  const demo = page.locator("[data-application-demo]");
  const shell = page.locator("[data-tablet-shell]");
  const precisePointer = await page.evaluate(
    () => matchMedia("(hover: hover) and (pointer: fine)").matches,
  );
  test.skip(!precisePointer, "Browser profile does not expose a precise pointer");
  await expect(demo).toHaveAttribute("data-tilt-active", "true");
  const box = await demo.boundingBox();
  expect(box).not.toBeNull();

  await page.mouse.move(box!.x + box!.width - 4, box!.y + 4);
  await page.waitForTimeout(350);
  const tilted = await shell.evaluate((element) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    return { x: matrix.m23, y: matrix.m13 };
  });
  expect(Math.abs(tilted.x) + Math.abs(tilted.y)).toBeGreaterThan(0.01);

  await page.mouse.move(0, 0);
  await page.waitForTimeout(700);
  const resting = await shell.evaluate((element) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    return { x: matrix.m23, y: matrix.m13 };
  });
  expect(Math.abs(resting.x)).toBeLessThan(0.001);
  expect(Math.abs(resting.y)).toBeLessThan(0.001);
});
