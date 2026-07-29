import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { NavigationMeasure } from "./NavigationMeasure";
import { APPLICATION_NAVIGATION } from "./navigation";

const applicationItem = APPLICATION_NAVIGATION[0]!;
const externalItem = APPLICATION_NAVIGATION[3]!;

const meta = {
  title: "Navigation/Navigation measure",
  component: NavigationMeasure,
  args: {
    item: applicationItem,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          inlineSize: "min(22rem, 90vw)",
          margin: "4rem auto",
        }}
      >
        <Story />
      </div>
    ),
  ],
  tags: ["test"],
} satisfies Meta<typeof NavigationMeasure>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  args: {
    active: true,
  },
};

export const Hover: Story = {
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", {
      name: "Aplicação",
    });

    await userEvent.hover(link);
    await expect(link).toBeVisible();
  },
};

export const Focus: Story = {
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", {
      name: "Aplicação",
    });

    link.focus();
    await expect(document.activeElement).toBe(link);
  },
};

export const External: Story = {
  args: {
    item: externalItem,
  },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", {
      name: /Acessar app.*abre em nova aba/u,
    });

    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  },
};
