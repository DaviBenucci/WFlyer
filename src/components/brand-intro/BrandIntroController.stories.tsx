import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BrandIntroController } from "./BrandIntroController";

const meta = {
  title: "Experience/Brand intro",
  component: BrandIntroController,
  args: { force: true },
  parameters: { layout: "fullscreen" },
  tags: ["test"],
} satisfies Meta<typeof BrandIntroController>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FullTimeline: Story = {};
