import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import HomePage from "@/app/page";

const meta = {
  title: "Foundation/Home",
  component: HomePage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["test"],
} satisfies Meta<typeof HomePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
