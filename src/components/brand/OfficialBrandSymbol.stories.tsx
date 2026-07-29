import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { OfficialBrandSymbol } from "./OfficialBrandSymbol";

const meta = {
  title: "Brand/Official symbol",
  component: OfficialBrandSymbol,
  args: {
    decorative: false,
    title: "W_Flyer",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          inlineSize: "min(18rem, 70vw)",
          margin: "4rem auto",
          padding: "2rem",
        }}
      >
        <Story />
      </div>
    ),
  ],
  tags: ["test"],
} satisfies Meta<typeof OfficialBrandSymbol>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Informative: Story = {};

export const Decorative: Story = {
  args: {
    decorative: true,
  },
};

export const Dark: Story = {
  globals: {
    theme: "dark",
  },
};
