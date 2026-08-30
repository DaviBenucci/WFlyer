import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { THEME_BROWSER_COLORS } from "@/components/theme/theme-constants";
import { describe, expect, it } from "vitest";

type ColorTriplet = readonly [number, number, number];

const tokensSource = readFileSync(
  resolve(process.cwd(), "src/styles/tokens.css"),
  "utf8",
);
const layoutSource = readFileSync(
  resolve(process.cwd(), "src/app/layout.tsx"),
  "utf8",
);
const iconSource = readFileSync(resolve(process.cwd(), "src/app/icon.svg"), "utf8");
const originReviewSource = readFileSync(
  resolve(
    process.cwd(),
    "src/app/%5F_visual-lab/story/score-paths/score-path-origin-review.module.css",
  ),
  "utf8",
);

const canonicalLightDeclarations = {
  "--wf-bg": "#f7f1e8",
  "--wf-surface": "#fffaf3",
  "--wf-surface-elevated": "#fffdf8",
  "--wf-surface-muted": "#eee2d4",
  "--wf-text": "#24180f",
  "--wf-text-muted": "#665548",
  "--wf-emphasis": "var(--wf-accent)",
  "--wf-emphasis-hover": "var(--wf-primary-hover)",
  "--wf-emphasis-active": "var(--wf-primary-active)",
  "--wf-emphasis-subtle":
    "color-mix(in srgb, var(--wf-emphasis) 18%, transparent)",
  "--wf-ui-ornament": "var(--wf-staff)",
  "--wf-home-atmosphere": "transparent",
  "--wf-primary": "#4d280d",
  "--wf-primary-hover": "#633612",
  "--wf-primary-active": "var(--wf-primary-hover)",
  "--wf-accent": "#9a6237",
  "--wf-staff": "#c9a17c",
  "--wf-note": "#70401f",
  "--wf-border": "#ddc9b5",
  "--wf-border-strong": "var(--wf-border)",
  "--wf-focus": "#75421f",
  "--wf-text-accent": "var(--wf-note)",
  "--wf-accent-text": "var(--wf-accent)",
  "--wf-primary-text": "var(--wf-primary)",
  "--wf-danger": "#a12b2b",
  "--wf-success": "#23623b",
  "--wf-link": "var(--wf-text)",
  "--wf-shadow-soft": "0 18px 50px rgb(58 32 17 / 0.12)",
  "--wf-glow-soft": "none",
  "--wf-tablet-edge": "#3a210f",
  "--wf-tablet-reflection": "rgb(255 255 255 / 0.28)",
  "--wf-on-primary": "var(--wf-surface-elevated)",
} as const;

const canonicalDarkDeclarations = {
  "--wf-bg": "#12100f",
  "--wf-surface": "rgb(29 26 24 / 92%)",
  "--wf-surface-elevated":
    "color-mix(in oklab, var(--wf-surface) 92%, var(--wf-text) 8%)",
  "--wf-surface-muted":
    "color-mix(in oklab, var(--wf-surface) 72%, var(--wf-bg) 28%)",
  "--wf-text": "#f4ecdf",
  "--wf-text-muted": "#c1b9ad",
  "--wf-emphasis": "#e79271",
  "--wf-emphasis-hover":
    "color-mix(in oklab, var(--wf-emphasis) 88%, var(--wf-text) 12%)",
  "--wf-emphasis-active":
    "color-mix(in oklab, var(--wf-emphasis) 88%, var(--wf-bg) 12%)",
  "--wf-emphasis-subtle":
    "color-mix(in srgb, var(--wf-emphasis) 20%, transparent)",
  "--wf-ui-ornament": "var(--wf-emphasis)",
  "--wf-home-atmosphere": "rgb(159 75 54 / 20%)",
  "--wf-primary": "var(--wf-emphasis)",
  "--wf-primary-hover": "var(--wf-emphasis-hover)",
  "--wf-primary-active": "var(--wf-emphasis-active)",
  "--wf-accent": "var(--wf-emphasis)",
  "--wf-staff": "#7b5dda",
  "--wf-note": "#933fff",
  "--wf-border": "rgb(245 235 218 / 20%)",
  "--wf-border-strong": "rgb(245 235 218 / 38%)",
  "--wf-focus": "var(--wf-emphasis-hover)",
  "--wf-text-accent": "var(--wf-emphasis)",
  "--wf-accent-text": "var(--wf-text-accent)",
  "--wf-primary-text": "var(--wf-text-accent)",
  "--wf-danger": "#d45c5c",
  "--wf-success": "#3f9e63",
  "--wf-link": "var(--wf-text-accent)",
  "--wf-shadow-soft": "0 22px 60px rgb(0 0 0 / 0.34)",
  "--wf-glow-soft": "none",
  "--wf-tablet-edge":
    "color-mix(in oklab, var(--wf-surface) 82%, var(--wf-bg) 18%)",
  "--wf-tablet-reflection":
    "color-mix(in srgb, var(--wf-text) 18%, transparent)",
  "--wf-on-primary": "var(--wf-bg)",
} as const;

function normalizeCssValue(value: string): string {
  return value
    .replace(/\s+/gu, " ")
    .replace(/\(\s+/gu, "(")
    .replace(/\s+\)/gu, ")")
    .trim();
}

function extractCssBlock(source: string, selector: string): string {
  const selectorIndex = source.indexOf(selector);
  const openingBraceIndex = source.indexOf("{", selectorIndex);

  if (selectorIndex < 0 || openingBraceIndex < 0) {
    throw new Error(`Missing CSS block: ${selector}`);
  }

  let depth = 0;

  for (let index = openingBraceIndex; index < source.length; index += 1) {
    const character = source[index];

    if (character === "{") depth += 1;
    if (character !== "}") continue;

    depth -= 1;
    if (depth === 0) {
      return source.slice(openingBraceIndex + 1, index);
    }
  }

  throw new Error(`Unclosed CSS block: ${selector}`);
}

function customProperties(block: string): Record<string, string> {
  return Object.fromEntries(
    Array.from(
      block.matchAll(/(?<name>--[a-z0-9-]+)\s*:\s*(?<value>[^;]+);/giu),
      (match) => {
        const name = match.groups?.name;
        const value = match.groups?.value;

        if (name === undefined || value === undefined) {
          throw new Error("Unable to parse a CSS custom property declaration.");
        }

        return [name, normalizeCssValue(value)];
      },
    ),
  );
}

function hexToRgb(value: string): ColorTriplet {
  if (!/^#[0-9a-f]{6}$/iu.test(value)) {
    throw new Error(`Expected a six-digit hexadecimal color, received ${value}.`);
  }

  return [
    Number.parseInt(value.slice(1, 3), 16),
    Number.parseInt(value.slice(3, 5), 16),
    Number.parseInt(value.slice(5, 7), 16),
  ];
}

function srgbChannelToLinear(channel: number): number {
  const normalized = channel / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function linearChannelToSrgb(channel: number): number {
  const normalized =
    channel <= 0.0031308
      ? 12.92 * channel
      : 1.055 * channel ** (1 / 2.4) - 0.055;

  return Math.max(0, Math.min(1, normalized)) * 255;
}

function srgbToOklab(color: ColorTriplet): ColorTriplet {
  const red = srgbChannelToLinear(color[0]);
  const green = srgbChannelToLinear(color[1]);
  const blue = srgbChannelToLinear(color[2]);
  const l = Math.cbrt(
    0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue,
  );
  const m = Math.cbrt(
    0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue,
  );
  const s = Math.cbrt(
    0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue,
  );

  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToSrgb(color: ColorTriplet): ColorTriplet {
  const l = (color[0] + 0.3963377774 * color[1] + 0.2158037573 * color[2]) ** 3;
  const m = (color[0] - 0.1055613458 * color[1] - 0.0638541728 * color[2]) ** 3;
  const s = (color[0] - 0.0894841775 * color[1] - 1.291485548 * color[2]) ** 3;

  return [
    linearChannelToSrgb(
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    ),
    linearChannelToSrgb(
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    ),
    linearChannelToSrgb(
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ),
  ];
}

function mixOklab(
  first: ColorTriplet,
  firstWeight: number,
  second: ColorTriplet,
  secondWeight: number,
): ColorTriplet {
  const totalWeight = firstWeight + secondWeight;

  if (totalWeight <= 0) throw new Error("Color-mix weights must be positive.");

  const firstOklab = srgbToOklab(first);
  const secondOklab = srgbToOklab(second);
  const firstShare = firstWeight / totalWeight;
  const secondShare = secondWeight / totalWeight;

  return oklabToSrgb([
    firstOklab[0] * firstShare + secondOklab[0] * secondShare,
    firstOklab[1] * firstShare + secondOklab[1] * secondShare,
    firstOklab[2] * firstShare + secondOklab[2] * secondShare,
  ]);
}

function composite(
  foreground: ColorTriplet,
  alpha: number,
  background: ColorTriplet,
): ColorTriplet {
  return [
    foreground[0] * alpha + background[0] * (1 - alpha),
    foreground[1] * alpha + background[1] * (1 - alpha),
    foreground[2] * alpha + background[2] * (1 - alpha),
  ];
}

function relativeLuminance(color: ColorTriplet): number {
  return (
    0.2126 * srgbChannelToLinear(color[0]) +
    0.7152 * srgbChannelToLinear(color[1]) +
    0.0722 * srgbChannelToLinear(color[2])
  );
}

function contrastRatio(first: ColorTriplet, second: ColorTriplet): number {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function expectMinimumContrast(
  label: string,
  foreground: ColorTriplet,
  background: ColorTriplet,
  minimum: number,
): void {
  expect(contrastRatio(foreground, background), label).toBeGreaterThanOrEqual(
    minimum,
  );
}

describe("canonical W_Flyer theme tokens", () => {
  it("keeps light colors unchanged and mirrors the complete dark palette in the no-JS fallback", () => {
    const rootBlock = extractCssBlock(tokensSource, ":root");
    const lightBlock = extractCssBlock(tokensSource, '[data-theme="light"]');
    const darkBlock = extractCssBlock(tokensSource, '[data-theme="dark"]');
    const noJavaScriptDarkBlock = extractCssBlock(
      tokensSource,
      ":root:not([data-theme])",
    );
    const rootDeclarations = customProperties(rootBlock);
    const lightDeclarations = customProperties(lightBlock);
    const darkDeclarations = customProperties(darkBlock);
    const noJavaScriptDarkDeclarations = customProperties(noJavaScriptDarkBlock);

    expect(normalizeCssValue(rootBlock)).toContain("color-scheme: light;");
    expect(normalizeCssValue(lightBlock)).toContain("color-scheme: light;");
    expect(rootDeclarations).toMatchObject(canonicalLightDeclarations);
    expect(lightDeclarations).toMatchObject(canonicalLightDeclarations);

    expect(normalizeCssValue(darkBlock)).toContain("color-scheme: dark;");
    expect(normalizeCssValue(noJavaScriptDarkBlock)).toContain(
      "color-scheme: dark;",
    );
    expect(darkDeclarations).toEqual(canonicalDarkDeclarations);
    expect(noJavaScriptDarkDeclarations).toEqual(canonicalDarkDeclarations);
  });

  it("keeps browser chrome synchronized and exports every semantic color alias", () => {
    const tailwindDeclarations = customProperties(
      extractCssBlock(tokensSource, "@theme inline"),
    );

    expect(THEME_BROWSER_COLORS).toEqual({
      dark: "#12100f",
      light: "#f7f1e8",
    });
    expect(
      layoutSource.match(/THEME_BROWSER_COLORS\.(?:light|dark)/gu),
    ).toEqual(["THEME_BROWSER_COLORS.light", "THEME_BROWSER_COLORS.dark"]);
    expect(layoutSource).not.toContain("#12100f");
    expect(layoutSource).not.toContain("#f7f1e8");
    expect(iconSource).toContain("path { fill: #f4ecdf; }");
    expect(iconSource).not.toContain("#f7f4ff");
    expect(tailwindDeclarations).toMatchObject({
      "--color-emphasis": "var(--wf-emphasis)",
      "--color-emphasis-hover": "var(--wf-emphasis-hover)",
      "--color-emphasis-active": "var(--wf-emphasis-active)",
      "--color-emphasis-subtle": "var(--wf-emphasis-subtle)",
      "--color-ui-ornament": "var(--wf-ui-ornament)",
      "--color-primary-active": "var(--wf-primary-active)",
      "--color-border-strong": "var(--wf-border-strong)",
      "--color-text-accent": "var(--wf-text-accent)",
      "--color-accent-text": "var(--wf-accent-text)",
      "--color-primary-text": "var(--wf-primary-text)",
      "--color-danger": "var(--wf-danger)",
      "--color-success": "var(--wf-success)",
      "--color-link": "var(--wf-link)",
    });
  });

  it("keeps Task-33 review diagnostics local while consuming the promoted dark neutrals", () => {
    const originDarkDeclarations = customProperties(
      extractCssBlock(
        originReviewSource,
        ':global([data-theme="dark"]) .root',
      ),
    );

    expect(originDarkDeclarations).toMatchObject({
      "--origin-bg": "var(--wf-bg)",
      "--origin-panel": "var(--wf-surface)",
      "--origin-border": "var(--wf-border)",
      "--origin-border-strong": "var(--wf-border-strong)",
      "--origin-muted": "var(--wf-text-muted)",
      "--origin-score": "var(--wf-text)",
      "--origin-accent": "#e79271",
      "--origin-connector": "#7fc5d7",
    });
    expect(originReviewSource).toContain("rgb(159 75 54 / 20%)");
  });

  it("excludes superseded dark neutrals and unpromoted Task-33 diagnostics from global tokens", () => {
    const forbiddenGlobalLiterals = [
      "#020b22",
      "#07132e",
      "#0b193a",
      "#111f43",
      "#f7f4ff",
      "#c5c5dc",
      "#5834bd",
      "#2b3167",
      "#10153a",
      "#915eff",
      "#9f4b36",
      "#295f73",
      "#7fc5d7",
      "rgb(171 132 255 / 0.18)",
    ] as const;
    const normalizedSource = tokensSource.toLowerCase();

    for (const literal of forbiddenGlobalLiterals) {
      expect(normalizedSource, literal).not.toContain(literal);
    }
  });

  it("meets AA text and non-text contrast on the page and actual composited dark surface", () => {
    const pageBackground = hexToRgb("#12100f");
    const surface = composite(hexToRgb("#1d1a18"), 0.92, pageBackground);
    const text = hexToRgb("#f4ecdf");
    const mutedText = hexToRgb("#c1b9ad");
    const emphasis = hexToRgb("#e79271");
    const emphasisHover = mixOklab(emphasis, 0.88, text, 0.12);
    const emphasisActive = mixOklab(emphasis, 0.88, pageBackground, 0.12);
    const strongBorderSource = hexToRgb("#f5ebda");
    const danger = hexToRgb("#d45c5c");
    const success = hexToRgb("#3f9e63");

    for (const [backgroundName, background] of [
      ["page", pageBackground],
      ["surface", surface],
    ] as const) {
      expectMinimumContrast(`${backgroundName}: body`, text, background, 4.5);
      expectMinimumContrast(
        `${backgroundName}: muted`,
        mutedText,
        background,
        4.5,
      );
      expectMinimumContrast(
        `${backgroundName}: text accent`,
        emphasis,
        background,
        4.5,
      );
      expectMinimumContrast(
        `${backgroundName}: focus`,
        emphasisHover,
        background,
        3,
      );
      expectMinimumContrast(
        `${backgroundName}: UI ornament`,
        emphasis,
        background,
        3,
      );
      expectMinimumContrast(`${backgroundName}: danger`, danger, background, 4.5);
      expectMinimumContrast(`${backgroundName}: success`, success, background, 4.5);
      expectMinimumContrast(
        `${backgroundName}: strong border`,
        composite(strongBorderSource, 0.38, background),
        background,
        3,
      );
    }

    expectMinimumContrast("primary button", pageBackground, emphasis, 4.5);
    expectMinimumContrast(
      "primary button hover",
      pageBackground,
      emphasisHover,
      4.5,
    );
    expectMinimumContrast(
      "primary button active",
      pageBackground,
      emphasisActive,
      4.5,
    );
  });
});
