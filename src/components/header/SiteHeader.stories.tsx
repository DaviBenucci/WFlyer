import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";

import { ThemeProvider, ThemeToggle } from "@/components/theme";

import { SiteHeader } from "./SiteHeader";

const meta = {
  title: "Navigation/Site header",
  component: SiteHeader,
  args: {
    pathname: "/",
    themeControl: <ThemeToggle />,
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
  tags: ["test"],
} satisfies Meta<typeof SiteHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Home: Story = {};

export const ApplicationChapter: Story = {
  args: {
    pathname: "/aplicacao-wflyer/como-funciona",
  },
};

export const ProcessSubmeasure: Story = {
  args: {
    pathname: "/processo",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const servicesLink = canvas.getByRole("link", {
      name: /Serviços.*Processo — etapa atual/u,
    });
    const marker = servicesLink.querySelector<HTMLElement>(
      "[data-process-marker]",
    );

    await waitFor(() => {
      const linkBox = servicesLink.getBoundingClientRect();
      const markerBox = marker?.getBoundingClientRect();

      expect(markerBox).toBeDefined();
      expect(
        Math.abs(
          (markerBox?.left ?? 0) +
            (markerBox?.width ?? 0) / 2 -
            linkBox.right,
        ),
      ).toBeLessThanOrEqual(1);
    });
  },
};

export const Dark: Story = {
  globals: {
    theme: "dark",
  },
};

export const MobileMenuOpen: Story = {
  args: {
    defaultMenuOpen: true,
    pathname: "/processo",
  },
  globals: {
    theme: "dark",
    viewport: { value: "wf-mobile", isRotated: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const applicationLink = canvas.getByRole("link", {
      name: "Aplicação",
    });

    await expect(
      canvas.getByRole("dialog", { name: "Navegação W_Flyer" }),
    ).toBeVisible();
    await expect(document.documentElement).toHaveAttribute(
      "data-theme",
      "dark",
    );
    await waitFor(() => {
      const rootStyles = getComputedStyle(document.documentElement);
      const manropeFamily = rootStyles
        .getPropertyValue("--wf-font-manrope")
        .replaceAll(/['"]/gu, "")
        .trim();

      expect(manropeFamily).toMatch(/^font-/u);
      expect(getComputedStyle(applicationLink).fontFamily).toContain(
        manropeFamily,
      );
    });
  },
};
