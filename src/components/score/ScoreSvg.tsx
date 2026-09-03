import type { CSSProperties, SVGProps } from "react";

import type {
  ScoreRenderModel,
  ScoreRenderPrimitive,
} from "@/lib/music/renderer/types";

import { ScoreDebugOverlay } from "./ScoreDebugOverlay";
import { ScoreGlyph } from "./ScoreGlyph";
import styles from "./score.module.css";
import { serializeSvgNumber, serializeSvgPoints } from "./svg-number";

function svgRotationTransform(
  radians: number,
  center: { readonly x: number; readonly y: number },
  numericPrecision?: number,
): string {
  return `rotate(${serializeSvgNumber(radians * (180 / Math.PI), numericPrecision)} ${serializeSvgNumber(center.x, numericPrecision)} ${serializeSvgNumber(center.y, numericPrecision)})`;
}

function renderPrimitive(
  primitive: ScoreRenderPrimitive,
  numericPrecision: number | undefined,
) {
  switch (primitive.kind) {
    case "glyph":
      return (
        <ScoreGlyph
          key={primitive.id}
          {...(numericPrecision === undefined ? {} : { numericPrecision })}
          primitive={primitive}
        />
      );
    case "line":
    case "beam":
      return (
        <line
          className={styles.stroke}
          data-score-primitive-id={primitive.id}
          data-score-role={primitive.role}
          key={primitive.id}
          strokeWidth={serializeSvgNumber(primitive.thickness, numericPrecision)}
          x1={serializeSvgNumber(primitive.start.x, numericPrecision)}
          x2={serializeSvgNumber(primitive.end.x, numericPrecision)}
          y1={serializeSvgNumber(primitive.start.y, numericPrecision)}
          y2={serializeSvgNumber(primitive.end.y, numericPrecision)}
        />
      );
    case "polyline":
      return (
        <polyline
          className={styles.stroke}
          data-score-primitive-id={primitive.id}
          data-score-role={primitive.role}
          key={primitive.id}
          opacity={
            primitive.opacity === undefined
              ? undefined
              : serializeSvgNumber(primitive.opacity, numericPrecision)
          }
          points={serializeSvgPoints(primitive.points, numericPrecision)}
          strokeWidth={serializeSvgNumber(primitive.thickness, numericPrecision)}
        />
      );
    case "tuplet":
      return (
        <g
          data-score-primitive-id={primitive.id}
          data-score-role={primitive.role}
          data-tuplet-central-gap={serializeSvgNumber(
            primitive.centralGap,
            numericPrecision,
          )}
          data-tuplet-numeral-rotation-radians={
            serializeSvgNumber(
              primitive.numeralRotationRadians,
              numericPrecision,
            )
          }
          data-tuplet-numeral-side-gap={serializeSvgNumber(
            primitive.numeralSideGap,
            numericPrecision,
          )}
          data-tuplet-numeral-size={serializeSvgNumber(
            primitive.numeralSize,
            numericPrecision,
          )}
          data-tuplet-numeral-width={serializeSvgNumber(
            primitive.numeralWidth,
            numericPrecision,
          )}
          key={primitive.id}
        >
          {primitive.bracket.map((segment, index) => (
            <line
              className={styles.stroke}
              data-tuplet-bracket-segment={segment.role}
              key={`${primitive.id}-bracket-${index}`}
              strokeWidth={serializeSvgNumber(
                primitive.thickness,
                numericPrecision,
              )}
              x1={serializeSvgNumber(segment.start.x, numericPrecision)}
              x2={serializeSvgNumber(segment.end.x, numericPrecision)}
              y1={serializeSvgNumber(segment.start.y, numericPrecision)}
              y2={serializeSvgNumber(segment.end.y, numericPrecision)}
            />
          ))}
          <text
            className={styles.tupletLabel}
            data-tuplet-numeral="3"
            dominantBaseline="central"
            fill="currentColor"
            fontSize={serializeSvgNumber(
              primitive.numeralSize,
              numericPrecision,
            )}
            lengthAdjust="spacingAndGlyphs"
            textAnchor="middle"
            textLength={serializeSvgNumber(
              primitive.numeralWidth,
              numericPrecision,
            )}
            transform={svgRotationTransform(
              primitive.numeralRotationRadians,
              primitive.labelPosition,
              numericPrecision,
            )}
            x={serializeSvgNumber(
              primitive.labelPosition.x,
              numericPrecision,
            )}
            y={serializeSvgNumber(
              primitive.labelPosition.y,
              numericPrecision,
            )}
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
  /** Optional review-only serialization precision for cross-runtime hydration. */
  readonly numericPrecision?: number;
  readonly viewBox: string;
}

export function ScoreSvg({
  ariaLabel,
  className,
  debug = false,
  model,
  numericPrecision,
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
          {layer.primitives.map((primitive) =>
            renderPrimitive(primitive, numericPrecision),
          )}
        </g>
      ))}
      {debug ? <ScoreDebugOverlay model={model} /> : null}
    </svg>
  );
}
