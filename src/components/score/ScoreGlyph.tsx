import { useId } from "react";

import accidentalFlat from "@/assets/visuals/musical/wf-music-accidental-flat.svg";
import accidentalNatural from "@/assets/visuals/musical/wf-music-accidental-natural.svg";
import accidentalSharp from "@/assets/visuals/musical/wf-music-accidental-sharp.svg";
import eighthFlag from "@/assets/visuals/musical/wf-music-eighth-flag.svg";
import noteheadFilled from "@/assets/visuals/musical/wf-music-notehead-filled.svg";
import noteheadOpen from "@/assets/visuals/musical/wf-music-notehead-open.svg";
import sixteenthDoubleFlag from "@/assets/visuals/musical/wf-music-sixteenth-double-flag.svg";
import trebleClef from "@/assets/visuals/musical/wf-music-treble-clef.svg";
import type { MusicGlyphKey } from "@/lib/music/glyphs/types";
import type { GlyphRenderPrimitive } from "@/lib/music/renderer/types";

import { serializeSvgNumber } from "./svg-number";

type StaticAsset = string | { readonly src: string };

const GLYPH_ASSETS = {
  "wf-music-accidental-flat": accidentalFlat,
  "wf-music-accidental-natural": accidentalNatural,
  "wf-music-accidental-sharp": accidentalSharp,
  "wf-music-eighth-flag": eighthFlag,
  "wf-music-notehead-filled": noteheadFilled,
  "wf-music-notehead-open": noteheadOpen,
  "wf-music-sixteenth-double-flag": sixteenthDoubleFlag,
  "wf-music-treble-clef": trebleClef,
} as const satisfies Record<MusicGlyphKey, StaticAsset>;

function assetSource(asset: StaticAsset): string {
  return typeof asset === "string" ? asset : asset.src;
}

export interface ScoreGlyphProps {
  readonly numericPrecision?: number;
  readonly primitive: GlyphRenderPrimitive;
}

/**
 * Places an immutable approved SVG asset. Only the containing transform changes;
 * the source path data is never copied, redrawn, or mutated here.
 */
export function ScoreGlyph({ numericPrecision, primitive }: ScoreGlyphProps) {
  const maskId = `score-glyph-${useId().replaceAll(":", "")}`;
  const {
    anchorInGlyph,
    anchorTarget,
    assetKey,
    height,
    id,
    mirrorX,
    mirrorY,
    role,
    rotationRadians,
    width,
  } = primitive;
  const rotationDegrees = (rotationRadians * 180) / Math.PI;
  const serializedHeight = serializeSvgNumber(height, numericPrecision);
  const serializedWidth = serializeSvgNumber(width, numericPrecision);
  const transform = [
    `translate(${serializeSvgNumber(anchorTarget.x, numericPrecision)} ${serializeSvgNumber(anchorTarget.y, numericPrecision)})`,
    `rotate(${serializeSvgNumber(rotationDegrees, numericPrecision)})`,
    `scale(${mirrorX ? -1 : 1} ${mirrorY ? -1 : 1})`,
    `translate(${serializeSvgNumber(-anchorInGlyph.x * width, numericPrecision)} ${serializeSvgNumber(-anchorInGlyph.y * height, numericPrecision)})`,
  ].join(" ");

  return (
    <g
      data-score-glyph={assetKey}
      data-score-primitive-id={id}
      data-score-role={role}
      transform={transform}
    >
      <defs>
        <mask
          height={serializedHeight}
          id={maskId}
          maskUnits="userSpaceOnUse"
          style={{ maskType: "alpha" }}
          width={serializedWidth}
          x={0}
          y={0}
        >
          <image
            height={serializedHeight}
            href={assetSource(GLYPH_ASSETS[assetKey])}
            preserveAspectRatio="none"
            width={serializedWidth}
            x={0}
            y={0}
          />
        </mask>
      </defs>
      <rect
        fill="currentColor"
        height={serializedHeight}
        mask={`url(#${maskId})`}
        width={serializedWidth}
        x={0}
        y={0}
      />
    </g>
  );
}
