import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Staff } from "./Staff";

const meta = {
  title: "Music/Staff",
  component: Staff,
  decorators: [
    (Story) => (
      <div style={{ margin: "4rem auto", inlineSize: "min(64rem, 90vw)" }}>
        <Story />
      </div>
    ),
  ],
  tags: ["test"],
} satisfies Meta<typeof Staff>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Institutional: Story = {
  args: {
    direction: "right",
  },
};

export const Application: Story = {
  args: {
    direction: "left",
  },
};

export const Terminal: Story = {
  args: {
    direction: "right",
    terminal: true,
  },
};

export const Quiet: Story = {
  args: {
    density: "quiet",
  },
};

export const Dark: Story = {
  args: {
    direction: "right",
  },
  globals: {
    theme: "dark",
  },
};
