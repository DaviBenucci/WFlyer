import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ScoreSvg } from "@/components/score/ScoreSvg";
import type {
  ScoreRenderModel,
  TupletRenderPrimitive,
} from "@/lib/music/renderer/types";

const model: ScoreRenderModel = {
  id: "presentation-fixture",
  staff: {
    masterGuideStaffStep: 4,
    lines: [
      {
        id: "staff-4",
        kind: "polyline",
        layer: "staff",
        points: [
          { x: 0, y: 20 },
          { x: 100, y: 20 },
        ],
        role: "staff-line",
        thickness: 1,
      },
    ],
  },
  motifs: [],
  layers: [
    {
      id: "staff",
      primitives: [
        {
          id: "staff-4",
          kind: "polyline",
          layer: "staff",
          points: [
            { x: 0, y: 20 },
            { x: 100, y: 20 },
          ],
          role: "staff-line",
          thickness: 1,
        },
      ],
    },
    {
      id: "notes",
      primitives: [
        {
          anchorInGlyph: { x: 0.5, y: 0.5 },
          anchorTarget: { x: 50, y: 20 },
          assetKey: "wf-music-notehead-filled",
          height: 9,
          id: "notehead",
          kind: "glyph",
          layer: "notes",
          mirrorX: false,
          mirrorY: false,
          role: "notehead",
          rotationRadians: 0,
          width: 12.48,
        },
      ],
    },
  ],
  primitives: [
    {
      id: "staff-4",
      kind: "polyline",
      layer: "staff",
      points: [
        { x: 0, y: 20 },
        { x: 100, y: 20 },
      ],
      role: "staff-line",
      thickness: 1,
    },
    {
      anchorInGlyph: { x: 0.5, y: 0.5 },
      anchorTarget: { x: 50, y: 20 },
      assetKey: "wf-music-notehead-filled",
      height: 9,
      id: "notehead",
      kind: "glyph",
      layer: "notes",
      mirrorX: false,
      mirrorY: false,
      role: "notehead",
      rotationRadians: 0,
      width: 12.48,
    },
  ],
};

const debugModel: ScoreRenderModel = {
  ...model,
  motifs: [
    {
      id: "opening-slot",
      motifId: "Q1",
      beams: [],
      notes: [
        {
          id: "opening-slot:note:0",
          center: { x: 50, y: 20 },
          duration: "quarter",
          ledgerLines: [],
          notehead: model.layers[1]?.primitives[0] as Extract<
            (typeof model.primitives)[number],
            { kind: "glyph" }
          >,
          primitives: [],
          staffStep: 3,
          stemDirection: "up",
          t: 0.5,
        },
      ],
      primitives: [],
    },
  ],
};

const tupletPrimitive: TupletRenderPrimitive = {
  id: "triplet:tuplet",
  kind: "tuplet",
  layer: "annotations",
  role: "tuplet",
  label: "3",
  labelPosition: { x: 50, y: 8 },
  numeralSize: 8.5,
  numeralWidth: 8.5,
  numeralSideGap: 1.8,
  numeralRotationRadians: Math.PI / 12,
  centralGap: 12.1,
  bracket: [
    {
      role: "span-before-numeral",
      start: { x: 20, y: 8 },
      end: { x: 43.95, y: 8 },
    },
    {
      role: "span-after-numeral",
      start: { x: 56.05, y: 8 },
      end: { x: 80, y: 8 },
    },
    {
      role: "end-cap-start",
      start: { x: 20, y: 8 },
      end: { x: 20, y: 11 },
    },
    {
      role: "end-cap-end",
      start: { x: 80, y: 8 },
      end: { x: 80, y: 11 },
    },
  ],
  thickness: 0.7,
};

const tupletModel: ScoreRenderModel = {
  ...model,
  layers: [
    ...model.layers,
    { id: "annotations", primitives: [tupletPrimitive] },
  ],
  primitives: [...model.primitives, tupletPrimitive],
};

describe("ScoreSvg presentation", () => {
  it("is decorative and unfocusable by default", () => {
    const { container } = render(
      <ScoreSvg model={model} viewBox="0 0 100 40" />,
    );
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
    expect(svg).toHaveAttribute("role", "presentation");
    expect(svg?.querySelector('[data-score-layer="staff"]')).not.toBeNull();
    expect(svg?.querySelector('[data-score-glyph="wf-music-notehead-filled"]')).not.toBeNull();
    expect(svg?.querySelector("path")).toBeNull();
  });

  it("becomes a labelled image only when explicitly requested", () => {
    render(
      <ScoreSvg
        ariaLabel="Calibration score"
        model={model}
        viewBox="0 0 100 40"
      />,
    );

    expect(screen.getByRole("img", { name: "Calibration score" })).toBeVisible();
  });

  it("exposes semantic motif, slot, group, pitch, and stem debug labels", () => {
    const { container } = render(
      <ScoreSvg debug model={debugModel} viewBox="0 0 100 40" />,
    );

    expect(
      container.querySelector(
        '[data-debug-motif-id="Q1"][data-debug-slot-id="opening-slot"]',
      ),
    ).not.toBeNull();
    expect(
      container.querySelector(
        '[data-debug-staff-step="3"][data-debug-stem-direction="up"]',
      ),
    ).toHaveTextContent("step=3 stem=up");
    expect(container).toHaveTextContent(
      "slot=opening-slot motif=Q1 group=0",
    );
  });

  it.each([
    ["light", "#111827"],
    ["dark", "#f9fafb"],
  ] as const)(
    "renders the deterministic split triplet gap and exact currentColor numeral in %s",
    (theme, color) => {
      const { container } = render(
        <div data-theme={theme} style={{ color }}>
          <ScoreSvg model={tupletModel} viewBox="0 0 100 40" />
        </div>,
      );
      const group = container.querySelector('[data-score-role="tuplet"]');
      const numeral = group?.querySelector('[data-tuplet-numeral="3"]');

      expect(container.querySelector(`[data-theme="${theme}"]`)).toHaveStyle({
        color,
      });
      expect(group).toHaveAttribute("data-tuplet-numeral-size", "8.5");
      expect(group).toHaveAttribute("data-tuplet-numeral-width", "8.5");
      expect(group).toHaveAttribute("data-tuplet-numeral-side-gap", "1.8");
      expect(group).toHaveAttribute(
        "data-tuplet-numeral-rotation-radians",
        String(Math.PI / 12),
      );
      expect(group).toHaveAttribute("data-tuplet-central-gap", "12.1");
      expect(
        Array.from(
          group?.querySelectorAll("[data-tuplet-bracket-segment]") ?? [],
          (element) => element.getAttribute("data-tuplet-bracket-segment"),
        ),
      ).toEqual([
        "span-before-numeral",
        "span-after-numeral",
        "end-cap-start",
        "end-cap-end",
      ]);
      expect(numeral).toHaveTextContent("3");
      expect(numeral).toHaveAttribute("fill", "currentColor");
      expect(numeral).toHaveAttribute("font-size", "8.5");
      expect(numeral).toHaveAttribute("textLength", "8.5");
      expect(numeral).toHaveAttribute("lengthAdjust", "spacingAndGlyphs");
      expect(numeral).toHaveAttribute(
        "transform",
        `rotate(${(Math.PI / 12) * (180 / Math.PI)} 50 8)`,
      );
    },
  );
});
