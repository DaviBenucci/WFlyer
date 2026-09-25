import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { NavigationMeasure } from "./NavigationMeasure";
import { INSTITUTIONAL_NAVIGATION } from "./navigation";

const professionalItem = INSTITUTIONAL_NAVIGATION[0]!;
const contactItem = INSTITUTIONAL_NAVIGATION[2]!;

const meta = {
  title: "Navigation/Navigation measure",
  component: NavigationMeasure,
  args: {
    item: professionalItem,
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
      name: "Sobre",
    });

    await userEvent.hover(link);
    await expect(link).toBeVisible();
  },
};

export const Focus: Story = {
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", {
      name: "Sobre",
    });

    link.focus();
    await expect(document.activeElement).toBe(link);
  },
};

export const Contact: Story = {
  args: {
    item: contactItem,
  },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", {
      name: "Contato",
    });

    await expect(link).toHaveAttribute(
      "href",
      "/contato",
    );
  },
};
