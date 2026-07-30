import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ChapterScore } from "./ChapterScore";
import { NarrativeClef } from "./NarrativeClef";
import { OriginScore } from "./OriginScore";

const meta = {
  title: "Music/Score system",
  component: OriginScore,
  decorators: [
    (Story) => (
      <div
        style={{
          inlineSize: "min(90rem, 94vw)",
          margin: "3rem auto",
          minBlockSize: "20rem",
        }}
      >
        <Story />
      </div>
    ),
  ],
  tags: ["test"],
} satisfies Meta<typeof OriginScore>;

export default meta;

type Story = StoryObj<typeof meta>;

export const HomeOrigin: Story = {};

export const HomeOriginDark: Story = {
  globals: {
    theme: "dark",
  },
};

export const Clef: Story = {
  render: () => (
    <div style={{ inlineSize: "14rem", marginInline: "auto" }}>
      <NarrativeClef />
    </div>
  ),
};

export const InstitutionalChapter: Story = {
  render: () => (
    <ChapterScore
      branch="institutional"
      entryAnchorY={0.46}
      entryEdge="left"
      exitAnchorY={0.68}
      exitEdge="right"
    />
  ),
};

export const ApplicationTerminal: Story = {
  render: () => (
    <ChapterScore
      branch="application"
      entryAnchorY={0.56}
      entryEdge="right"
      exitAnchorY={0.64}
      exitEdge="left"
      terminal
    />
  ),
};
