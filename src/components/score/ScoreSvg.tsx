import type { CSSProperties, SVGProps } from "react";

import type {
  ScoreRenderModel,
  ScoreRenderPrimitive,
} from "@/lib/music/renderer/types";

import { ScoreDebugOverlay } from "./ScoreDebugOverlay";
import { ScoreGlyph } from "./ScoreGlyph";
import styles from "./score.module.css";

function svgRotationTransform(
  radians: number,
  center: { readonly x: number; readonly y: number },
): string {
  return `rotate(${radians * (180 / Math.PI)} ${center.x} ${center.y})`;
}

function renderPrimitive(primitive: ScoreRenderPrimitive) {
  switch (primitive.kind) {
    case "glyph":
      return <ScoreGlyph key={primitive.id} primitive={primitive} />;
    case "line":
    case "beam":
      return (
        <line
          className={styles.stroke}
          data-score-primitive-id={primitive.id}
          data-score-role={primitive.role}
          key={primitive.id}
          strokeWidth={primitive.thickness}
          x1={primitive.start.x}
          x2={primitive.end.x}
          y1={primitive.start.y}
          y2={primitive.end.y}
        />
      );
    case "polyline":
      return (
        <polyline
          className={styles.stroke}
          data-score-primitive-id={primitive.id}
          data-score-role={primitive.role}
          key={primitive.id}
          points={primitive.points.map(({ x, y }) => `${x},${y}`).join(" ")}
          strokeWidth={primitive.thickness}
        />
      );
    case "tuplet":
      return (
        <g
          data-score-primitive-id={primitive.id}
          data-score-role={primitive.role}
          data-tuplet-central-gap={primitive.centralGap}
          data-tuplet-numeral-rotation-radians={
            primitive.numeralRotationRadians
          }
          data-tuplet-numeral-side-gap={primitive.numeralSideGap}
          data-tuplet-numeral-size={primitive.numeralSize}
          data-tuplet-numeral-width={primitive.numeralWidth}
          key={primitive.id}
        >
          {primitive.bracket.map((segment, index) => (
            <line
              className={styles.stroke}
              data-tuplet-bracket-segment={segment.role}
              key={`${primitive.id}-bracket-${index}`}
              strokeWidth={primitive.thickness}
              x1={segment.start.x}
              x2={segment.end.x}
              y1={segment.start.y}
              y2={segment.end.y}
            />
          ))}
          <text
            className={styles.tupletLabel}
            data-tuplet-numeral="3"
            dominantBaseline="central"
            fill="currentColor"
            fontSize={primitive.numeralSize}
            lengthAdjust="spacingAndGlyphs"
            textAnchor="middle"
            textLength={primitive.numeralWidth}
            transform={svgRotationTransform(
              primitive.numeralRotationRadians,
              primitive.labelPosition,
            )}
            x={primitive.labelPosition.x}
            y={primitive.labelPosition.y}
          >
            {primitive.label}
          </text>
        </g>
      );
  }
}

export interface ScoreSvgProps
  extends Omit<SVGProps<SVGSVGElement>, "aria-label" | "children"> {
  readonly ariaLabel?: string;
  readonly debug?: boolean;
  readonly model: ScoreRenderModel;
  readonly viewBox: string;
}

export function ScoreSvg({
  ariaLabel,
  className,
  debug = false,
  model,
  style,
  viewBox,
  ...svgProps
}: ScoreSvgProps) {
  const accessibilityProps = ariaLabel
    ? ({ "aria-label": ariaLabel, role: "img" } as const)
    : ({ "aria-hidden": true, role: "presentation" } as const);
  const mergedStyle = {
    "--score-color": "currentColor",
    ...style,
  } as CSSProperties;

  return (
    <svg
      {...svgProps}
      {...accessibilityProps}
      className={[styles.score, className].filter(Boolean).join(" ")}
      data-score-model={model.id}
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      style={mergedStyle}
      viewBox={viewBox}
    >
      {model.layers.map((layer) => (
        <g data-score-layer={layer.id} key={layer.id}>
          {layer.primitives.map(renderPrimitive)}
        </g>
      ))}
      {debug ? <ScoreDebugOverlay model={model} /> : null}
    </svg>
  );
}
