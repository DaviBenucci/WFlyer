import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, type ReactNode } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { type ThemeName } from "./theme-constants";
import { ThemeProvider, useTheme } from "./theme-provider";
import styles from "./theme-stories.module.css";
import { ThemeToggle } from "./theme-toggle";

interface ThemePreviewProps {
  children: ReactNode;
  initialTheme: ThemeName;
}

function ThemePreview({ children, initialTheme }: ThemePreviewProps) {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setTheme(initialTheme);
  }, [initialTheme, setTheme]);

  return (
    <section className={styles.canvas}>
      <div className={styles.content}>
        <h2 className={styles.title}>Partitura editorial contemporânea</h2>
        <p className={styles.description}>
          Tema aplicado: <strong>{theme === "dark" ? "escuro" : "claro"}</strong>
        </p>
        {children}
      </div>
    </section>
  );
}

const meta = {
  title: "Sistema visual/ThemeToggle",
  component: ThemeToggle,
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
} satisfies Meta<typeof ThemeToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Claro: Story = {
  globals: {
    theme: "light",
  },
  render: (args) => (
    <ThemePreview initialTheme="light">
      <ThemeToggle {...args} />
    </ThemePreview>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: "Tema escuro" });

    await waitFor(() => expect(toggle).toHaveAttribute("aria-pressed", "false"));
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
  },
};

export const Escuro: Story = {
  globals: {
    theme: "dark",
  },
  render: (args) => (
    <ThemePreview initialTheme="dark">
      <ThemeToggle {...args} />
    </ThemePreview>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: "Tema escuro" });

    await waitFor(() => expect(toggle).toHaveAttribute("aria-pressed", "true"));
    await waitFor(() =>
      expect(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--wf-bg")
          .trim(),
      )
        .toBe("#12100f"),
    );
  },
};

export const ComRotulo: Story = {
  args: {
    showLabel: true,
  },
  globals: {
    theme: "light",
  },
  render: (args) => (
    <ThemePreview initialTheme="light">
      <ThemeToggle {...args} />
    </ThemePreview>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: "Tema escuro" });

    await expect(toggle).toHaveTextContent("Tema escuro");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
  },
};
