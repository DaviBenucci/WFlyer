import type { Preview } from "@storybook/nextjs-vite";
import { createElement, useLayoutEffect } from "react";

import "../src/app/globals.css";
import { cormorantGaramond, manrope } from "../src/app/fonts";
import { THEME_STORAGE_KEY } from "../src/components/theme/theme-constants";

type StoryRenderer = Parameters<
  NonNullable<Preview["decorators"]>[number]
>[0];

interface StorybookFrameProps {
  readonly Story: StoryRenderer;
  readonly storyId: string;
  readonly theme: "dark" | "light";
}

const fontVariableClassName =
  `${cormorantGaramond.variable} ${manrope.variable}`;
const fontVariableClasses = fontVariableClassName.split(/\s+/u);

function StorybookFrame({ Story, storyId, theme }: StorybookFrameProps) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute("data-theme");
    const previousColorScheme = root.style.colorScheme;
    let previousStoredTheme: string | null = null;
    const addedFontClasses = fontVariableClasses.filter(
      (className) => !root.classList.contains(className),
    );

    try {
      previousStoredTheme = localStorage.getItem(THEME_STORAGE_KEY);
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // O iframe continua usando o atributo mesmo sem storage disponível.
    }

    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    root.classList.add(...addedFontClasses);

    return () => {
      if (previousTheme === null) {
        root.removeAttribute("data-theme");
      } else {
        root.dataset.theme = previousTheme;
      }

      root.style.colorScheme = previousColorScheme;
      root.classList.remove(...addedFontClasses);

      try {
        if (previousStoredTheme === null) {
          localStorage.removeItem(THEME_STORAGE_KEY);
        } else {
          localStorage.setItem(THEME_STORAGE_KEY, previousStoredTheme);
        }
      } catch {
        // Sem efeito fora do iframe quando storage está indisponível.
      }
    };
  }, [storyId, theme]);

  return createElement(
    "div",
    {
      className: fontVariableClassName,
      style: {
        minHeight: "100vh",
        background: "var(--wf-bg)",
        color: "var(--wf-text)",
      },
    },
    createElement(Story),
  );
}

const preview: Preview = {
  decorators: [
    (Story, context) =>
      createElement(StorybookFrame, {
        Story,
        storyId: context.id,
        theme: context.globals.theme === "dark" ? "dark" : "light",
      }),
  ],
  initialGlobals: {
    theme: "light",
  },
  globalTypes: {
    theme: {
      description: "Tema visual",
      toolbar: {
        icon: "contrast",
        items: [
          { title: "Claro", value: "light" },
          { title: "Escuro", value: "dark" },
        ],
      },
    },
  },
  parameters: {
    a11y: {
      test: "error",
    },
    controls: {
      matchers: {
        color: /(background|color)$/iu,
        date: /Date$/u,
      },
    },
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
    viewport: {
      options: {
        "wf-mobile": {
          name: "W_Flyer mobile (390 × 844)",
          styles: {
            width: "390px",
            height: "844px",
          },
        },
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;
