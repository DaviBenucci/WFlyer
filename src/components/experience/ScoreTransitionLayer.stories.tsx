import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor } from "storybook/test";

import {
  ScoreTransitionLayer,
  type ScoreTransitionGeometry,
} from "./ScoreTransitionLayer";

const geometry = {
  height: 844,
  pivot: { x: 720, y: 108 },
  source: { x: 96, y: 380 },
  target: { x: 1_344, y: 516 },
  width: 1_440,
} satisfies ScoreTransitionGeometry;

const meta = {
  title: "Experience/Score transition layer",
  component: ScoreTransitionLayer,
  args: {
    active: true,
    checkpoint: null,
    direction: "right",
    geometry,
    mode: "adjacent-score",
    reducedMotion: false,
  },
  parameters: {
    layout: "fullscreen",
  },
  tags: ["test"],
} satisfies Meta<typeof ScoreTransitionLayer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: {
    active: false,
    direction: "none",
    geometry: null,
    mode: "neutral",
  },
};

export const Adjacent: Story = {
  play: async ({ canvasElement }) => {
    const layer = canvasElement.querySelector<HTMLElement>(
      "[data-score-transition-layer]",
    );

    await expect(layer).toHaveAttribute("aria-hidden", "true");
    await expect(layer).toHaveAttribute("inert");
    await expect(layer).toHaveAttribute(
      "data-transition-mode",
      "adjacent-score",
    );
    await expect(
      canvasElement.querySelectorAll("[data-transition-segment]"),
    ).toHaveLength(1);
    await waitFor(() => {
      expect(getComputedStyle(layer!).pointerEvents).toBe("none");
    });
  },
};

export const Compressed: Story = {
  args: {
    direction: "left",
    mode: "compressed-score-jump",
  },
};

export const HomePivot: Story = {
  args: {
    mode: "home-pivot",
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelectorAll("[data-transition-segment]"),
    ).toHaveLength(2);
    await expect(
      canvasElement.querySelectorAll("[data-transition-note]"),
    ).toHaveLength(6);
  },
};

export const ReducedMotion: Story = {
  args: {
    reducedMotion: true,
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelectorAll("[data-transition-segment]"),
    ).toHaveLength(0);
  },
};

export const Dark: Story = {
  args: {
    mode: "home-pivot",
  },
  globals: {
    theme: "dark",
  },
};

export const ErrorFallback: Story = {
  args: {
    active: false,
    direction: "none",
    geometry: null,
    mode: "neutral",
  },
  play: async ({ canvasElement }) => {
    const layer = canvasElement.querySelector(
      "[data-score-transition-layer]",
    );

    await expect(layer).toHaveAttribute("data-active", "false");
    await expect(
      canvasElement.querySelectorAll("[data-transition-segment]"),
    ).toHaveLength(0);
  },
};

export const StartCheckpoint: Story = {
  args: {
    checkpoint: "start",
  },
};

export const MidpointCheckpoint: Story = {
  args: {
    checkpoint: "midpoint",
    mode: "home-pivot",
  },
};

export const CompletionCheckpoint: Story = {
  args: {
    checkpoint: "completion",
  },
};

export const MobileScoreSuppressed: Story = {
  globals: {
    viewport: { value: "wf-mobile", isRotated: false },
  },
  play: async ({ canvasElement }) => {
    const layer = canvasElement.querySelector<HTMLElement>(
      "[data-score-transition-layer]",
    );

    await waitFor(() => {
      expect(getComputedStyle(layer!).display).toBe("none");
    });
  },
};
