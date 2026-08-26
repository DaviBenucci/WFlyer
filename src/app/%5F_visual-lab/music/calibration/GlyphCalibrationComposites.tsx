import { ScoreGlyph } from "@/components/score/ScoreGlyph";
import type { MusicGlyphKey } from "@/lib/music/glyphs/types";
import type { GlyphRenderPrimitive } from "@/lib/music/renderer/types";

import type {
  EditableCalibrationPoint,
  EditableGlyphCalibration,
  EditableGlyphCalibrationSet,
} from "../_fixtures/calibration-export";
import { APPROVED_RENDERER_TOKENS } from "../_fixtures/draft-calibration";
import styles from "../music-lab.module.css";

const STAFF_SPACE = 32;
const MASTER_STAFF_STEP = 4;
const ANCHOR_COLOR = "#ff4d6d";
const GUIDE_COLOR = "#8064e8";

type CalibrationTheme = "dark" | "light";
type NoteheadKey = "wf-music-notehead-filled" | "wf-music-notehead-open";
type AccidentalKey =
  | "wf-music-accidental-flat"
  | "wf-music-accidental-natural"
  | "wf-music-accidental-sharp";
type FlagKey = "wf-music-eighth-flag" | "wf-music-sixteenth-double-flag";
type StemDirection = "down" | "up";
type StaffPosition = "line" | "space";

interface Vec2 {
  readonly x: number;
  readonly y: number;
}

interface GlyphPlacement {
  readonly calibration: EditableGlyphCalibration;
  readonly primitive: GlyphRenderPrimitive;
}

function roleFor(assetKey: MusicGlyphKey): GlyphRenderPrimitive["role"] {
  if (assetKey === "wf-music-treble-clef") return "clef";
  if (assetKey.startsWith("wf-music-notehead")) return "notehead";
  if (assetKey.includes("flag")) return "flag";
  return "accidental";
}

function requiredAnchor(
  calibration: EditableGlyphCalibration,
  anchorName: string,
): EditableCalibrationPoint {
  const anchor = calibration.anchors[anchorName];

  if (!anchor) {
    throw new Error(
      `Missing ${anchorName} draft anchor for ${calibration.assetKey}`,
    );
  }

  return anchor;
}

function placeGlyph({
  anchorName,
  assetKey,
  calibrations,
  id,
  mirrorY = false,
  target,
}: {
  readonly anchorName: string;
  readonly assetKey: MusicGlyphKey;
  readonly calibrations: EditableGlyphCalibrationSet;
  readonly id: string;
  readonly mirrorY?: boolean;
  readonly target: Vec2;
}): GlyphPlacement {
  const calibration = calibrations[assetKey];
  const anchor = requiredAnchor(calibration, anchorName);

  return {
    calibration,
    primitive: {
      anchorInGlyph: anchor,
      anchorTarget: target,
      assetKey,
      height: calibration.nominalHeightSp * STAFF_SPACE,
      id,
      kind: "glyph",
      layer: "notes",
      mirrorX: false,
      mirrorY,
      role: roleFor(assetKey),
      rotationRadians: 0,
      width: calibration.nominalWidthSp * STAFF_SPACE,
    },
  };
}

function pointInWorld(
  point: EditableCalibrationPoint,
  primitive: GlyphRenderPrimitive,
): Vec2 {
  const mirrorX = primitive.mirrorX ? -1 : 1;
  const mirrorY = primitive.mirrorY ? -1 : 1;
  const localX =
    (point.x - primitive.anchorInGlyph.x) * primitive.width * mirrorX;
  const localY =
    (point.y - primitive.anchorInGlyph.y) * primitive.height * mirrorY;
  const cosine = Math.cos(primitive.rotationRadians);
  const sine = Math.sin(primitive.rotationRadians);

  return {
    x: primitive.anchorTarget.x + localX * cosine - localY * sine,
    y: primitive.anchorTarget.y + localX * sine + localY * cosine,
  };
}

function glyphCorners(primitive: GlyphRenderPrimitive): readonly Vec2[] {
  return [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
  ].map((point) => pointInWorld(point, primitive));
}

function CalibratedGlyph({
  anchorNames,
  placement,
}: {
  readonly anchorNames: readonly string[];
  readonly placement: GlyphPlacement;
}) {
  const corners = glyphCorners(placement.primitive);

  return (
    <g data-calibrated-glyph={placement.primitive.assetKey}>
      <ScoreGlyph primitive={placement.primitive} />
      <polygon
        data-glyph-bounds={placement.primitive.assetKey}
        fill="none"
        points={corners.map(({ x, y }) => `${x},${y}`).join(" ")}
        stroke={ANCHOR_COLOR}
        strokeDasharray="5 4"
        strokeWidth="1.5"
      />
      {anchorNames.map((anchorName, index) => {
        const anchor = requiredAnchor(placement.calibration, anchorName);
        const point = pointInWorld(anchor, placement.primitive);
        const labelPlacement =
          anchorName === "opticalCenter"
            ? { dx: 8, dy: -10, textAnchor: "start" as const }
            : anchorName === "stemUp"
              ? { dx: 8, dy: 18, textAnchor: "start" as const }
              : anchorName === "stemDown"
                ? { dx: -8, dy: 18, textAnchor: "end" as const }
                : anchorName === "pitchCenter"
                  ? { dx: -8, dy: -10, textAnchor: "end" as const }
                  : anchorName === "gLine"
                    ? { dx: -50, dy: 18, textAnchor: "end" as const }
                    : anchorName === "stemAttachment" &&
                        placement.primitive.mirrorY
                      ? { dx: 0, dy: 18, textAnchor: "middle" as const }
                      : {
                          dx: 0,
                          dy: index % 2 === 0 ? -10 : 18,
                          textAnchor: "middle" as const,
                        };

        return (
          <g data-calibration-anchor={anchorName} key={anchorName}>
            <circle
              cx={point.x}
              cy={point.y}
              fill={ANCHOR_COLOR}
              r="4.5"
              stroke="white"
              strokeWidth="1"
            />
            <text
              data-calibration-anchor-label={anchorName}
              fill={ANCHOR_COLOR}
              fontSize="11"
              fontWeight="700"
              textAnchor={labelPlacement.textAnchor}
              x={point.x + labelPlacement.dx}
              y={point.y + labelPlacement.dy}
            >
              {anchorName}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function staffY(masterGuideY: number, staffStep: number): number {
  return masterGuideY - ((staffStep - MASTER_STAFF_STEP) * STAFF_SPACE) / 2;
}

function Staff({
  highlightStep,
  masterGuideY,
  x1,
  x2,
}: {
  readonly highlightStep?: number;
  readonly masterGuideY: number;
  readonly x1: number;
  readonly x2: number;
}) {
  return (
    <g data-composite-staff="five-line">
      {[0, 2, 4, 6, 8].map((staffStep) => {
        const y = staffY(masterGuideY, staffStep);
        const highlighted = highlightStep === staffStep;

        return (
          <line
            data-composite-staff-step={staffStep}
            key={staffStep}
            opacity={highlighted ? 1 : 0.48}
            stroke={highlighted ? GUIDE_COLOR : "currentColor"}
            strokeWidth={highlighted ? 3 : 1.25}
            x1={x1}
            x2={x2}
            y1={y}
            y2={y}
          />
        );
      })}
    </g>
  );
}

function SectionFrame({
  height,
  title,
  y,
}: {
  readonly height: number;
  readonly title: string;
  readonly y: number;
}) {
  return (
    <g>
      <rect
        fill="none"
        height={height}
        opacity="0.24"
        rx="14"
        stroke="currentColor"
        width="1232"
        x="24"
        y={y}
      />
      <text
        fill="currentColor"
        fontSize="18"
        fontWeight="700"
        x="48"
        y={y + 30}
      >
        {title}
      </text>
    </g>
  );
}

function ClefCalibration({
  calibrations,
}: {
  readonly calibrations: EditableGlyphCalibrationSet;
}) {
  const masterGuideY = 195;
  const gLineY = staffY(masterGuideY, 2);
  const placement = placeGlyph({
    anchorName: "gLine",
    assetKey: "wf-music-treble-clef",
    calibrations,
    id: "gate-b-clef-g-line",
    target: { x: 250, y: gLineY },
  });

  return (
    <g data-composite-case="treble-clef-g-line">
      <Staff highlightStep={2} masterGuideY={masterGuideY} x1={88} x2={1190} />
      <line
        data-g-line-alignment-guide="true"
        stroke={ANCHOR_COLOR}
        strokeDasharray="7 5"
        strokeWidth="1.5"
        x1="68"
        x2="1210"
        y1={gLineY}
        y2={gLineY}
      />
      <CalibratedGlyph anchorNames={["gLine"]} placement={placement} />
      <text
        fill={GUIDE_COLOR}
        fontSize="14"
        fontWeight="700"
        x="370"
        y={gLineY - 10}
      >
        G4 · staffStep 2 · second line
      </text>
      <text
        fill="currentColor"
        fontSize="13"
        opacity="0.75"
        x="370"
        y={gLineY + 24}
      >
        gLine anchor and G4 line share the same world-space y-coordinate
      </text>
    </g>
  );
}

function NoteheadExample({
  assetKey,
  calibrations,
  direction,
  position,
  x,
  y,
}: {
  readonly assetKey: NoteheadKey;
  readonly calibrations: EditableGlyphCalibrationSet;
  readonly direction: StemDirection;
  readonly position: StaffPosition;
  readonly x: number;
  readonly y: number;
}) {
  const staffStep = position === "line" ? 4 : 5;
  const target = { x, y: staffY(y, staffStep) };
  const placement = placeGlyph({
    anchorName: "opticalCenter",
    assetKey,
    calibrations,
    id: `${assetKey}-${position}-${direction}`,
    target,
  });
  const stemAnchorName = direction === "up" ? "stemUp" : "stemDown";
  const stemStart = pointInWorld(
    requiredAnchor(placement.calibration, stemAnchorName),
    placement.primitive,
  );
  const stemLength = APPROVED_RENDERER_TOKENS.note.stemLengthSp * STAFF_SPACE;
  const stemEnd = {
    x: stemStart.x,
    y: stemStart.y + (direction === "up" ? -stemLength : stemLength),
  };

  return (
    <g
      data-composite-notehead={assetKey}
      data-staff-position={position}
      data-stem-direction={direction}
    >
      <Staff masterGuideY={y} x1={x - 94} x2={x + 94} />
      <line
        data-composite-stem-connection={stemAnchorName}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3.2"
        x1={stemStart.x}
        x2={stemEnd.x}
        y1={stemStart.y}
        y2={stemEnd.y}
      />
      <CalibratedGlyph
        anchorNames={["opticalCenter", stemAnchorName]}
        placement={placement}
      />
      <text
        fill="currentColor"
        fontSize="12"
        fontWeight="700"
        textAnchor="middle"
        x={x}
        y={y + 142}
      >
        {position} · stem {direction}
      </text>
    </g>
  );
}

function NoteheadCalibrations({
  calibrations,
}: {
  readonly calibrations: EditableGlyphCalibrationSet;
}) {
  const examples = [
    { direction: "up", position: "line", x: 190 },
    { direction: "down", position: "line", x: 490 },
    { direction: "up", position: "space", x: 790 },
    { direction: "down", position: "space", x: 1090 },
  ] as const;

  return (
    <g data-composite-case="notehead-stem-connections">
      <text fill="currentColor" fontSize="14" fontWeight="700" x="54" y="395">
        Filled notehead · line and space · both stem directions
      </text>
      {examples.map((example) => (
        <NoteheadExample
          assetKey="wf-music-notehead-filled"
          calibrations={calibrations}
          direction={example.direction}
          key={`filled-${example.position}-${example.direction}`}
          position={example.position}
          x={example.x}
          y={480}
        />
      ))}
      <text fill="currentColor" fontSize="14" fontWeight="700" x="54" y="610">
        Open notehead · line and space · both stem directions
      </text>
      {examples.map((example) => (
        <NoteheadExample
          assetKey="wf-music-notehead-open"
          calibrations={calibrations}
          direction={example.direction}
          key={`open-${example.position}-${example.direction}`}
          position={example.position}
          x={example.x}
          y={695}
        />
      ))}
    </g>
  );
}

function AccidentalExample({
  assetKey,
  calibrations,
  position,
  x,
  y,
}: {
  readonly assetKey: AccidentalKey;
  readonly calibrations: EditableGlyphCalibrationSet;
  readonly position: StaffPosition;
  readonly x: number;
  readonly y: number;
}) {
  const staffStep = position === "line" ? 4 : 5;
  const pitchY = staffY(y, staffStep);
  const accidental = placeGlyph({
    anchorName: "pitchCenter",
    assetKey,
    calibrations,
    id: `${assetKey}-${position}`,
    target: { x: x - 54, y: pitchY },
  });
  const notehead = placeGlyph({
    anchorName: "opticalCenter",
    assetKey: "wf-music-notehead-filled",
    calibrations,
    id: `${assetKey}-${position}-adjacent-notehead`,
    target: { x: x + 22, y: pitchY },
  });

  return (
    <g data-composite-accidental={assetKey} data-staff-position={position}>
      <Staff masterGuideY={y} x1={x - 128} x2={x + 128} />
      <CalibratedGlyph anchorNames={["pitchCenter"]} placement={accidental} />
      <CalibratedGlyph anchorNames={["opticalCenter"]} placement={notehead} />
      <line
        stroke={ANCHOR_COLOR}
        strokeDasharray="4 4"
        x1={x - 118}
        x2={x + 112}
        y1={pitchY}
        y2={pitchY}
      />
      <text
        fill="currentColor"
        fontSize="12"
        fontWeight="700"
        textAnchor="middle"
        x={x}
        y={y + 96}
      >
        {assetKey.replace("wf-music-accidental-", "")} · {position}
      </text>
    </g>
  );
}

function AccidentalCalibrations({
  calibrations,
}: {
  readonly calibrations: EditableGlyphCalibrationSet;
}) {
  const accidentalKeys = [
    "wf-music-accidental-sharp",
    "wf-music-accidental-flat",
    "wf-music-accidental-natural",
  ] as const satisfies readonly AccidentalKey[];
  const xPositions = [240, 640, 1040] as const;

  return (
    <g data-composite-case="accidental-pitch-centers">
      {accidentalKeys.map((assetKey, index) => (
        <AccidentalExample
          assetKey={assetKey}
          calibrations={calibrations}
          key={`${assetKey}-line`}
          position="line"
          x={xPositions[index]!}
          y={965}
        />
      ))}
      {accidentalKeys.map((assetKey, index) => (
        <AccidentalExample
          assetKey={assetKey}
          calibrations={calibrations}
          key={`${assetKey}-space`}
          position="space"
          x={xPositions[index]!}
          y={1125}
        />
      ))}
    </g>
  );
}

function FlagExample({
  assetKey,
  calibrations,
  direction,
  x,
  y,
}: {
  readonly assetKey: FlagKey;
  readonly calibrations: EditableGlyphCalibrationSet;
  readonly direction: StemDirection;
  readonly x: number;
  readonly y: number;
}) {
  const position: StaffPosition = direction === "up" ? "line" : "space";
  const staffStep = position === "line" ? 4 : 5;
  const noteTarget = { x, y: staffY(y, staffStep) };
  const notehead = placeGlyph({
    anchorName: "opticalCenter",
    assetKey: "wf-music-notehead-filled",
    calibrations,
    id: `${assetKey}-${direction}-notehead`,
    target: noteTarget,
  });
  const stemAnchorName = direction === "up" ? "stemUp" : "stemDown";
  const stemStart = pointInWorld(
    requiredAnchor(notehead.calibration, stemAnchorName),
    notehead.primitive,
  );
  const stemLength = APPROVED_RENDERER_TOKENS.note.stemLengthSp * STAFF_SPACE;
  const stemEnd = {
    x: stemStart.x,
    y: stemStart.y + (direction === "up" ? -stemLength : stemLength),
  };
  const transform = APPROVED_RENDERER_TOKENS.note.flagTransform[direction];
  const flag = placeGlyph({
    anchorName: "stemAttachment",
    assetKey,
    calibrations,
    id: `${assetKey}-${direction}`,
    mirrorY: transform.mirrorY,
    target: stemEnd,
  });

  return (
    <g data-composite-flag={assetKey} data-stem-direction={direction}>
      <Staff masterGuideY={y} x1={x - 105} x2={x + 105} />
      <line
        data-composite-flag-stem={direction}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3.2"
        x1={stemStart.x}
        x2={stemEnd.x}
        y1={stemStart.y}
        y2={stemEnd.y}
      />
      <CalibratedGlyph anchorNames={[stemAnchorName]} placement={notehead} />
      <CalibratedGlyph anchorNames={["stemAttachment"]} placement={flag} />
      <text
        fill="currentColor"
        fontSize="12"
        fontWeight="700"
        textAnchor="middle"
        x={x}
        y={y + 154}
      >
        {assetKey === "wf-music-eighth-flag" ? "eighth" : "sixteenth"} ·{" "}
        {direction}
      </text>
    </g>
  );
}

function FlagCalibrations({
  calibrations,
}: {
  readonly calibrations: EditableGlyphCalibrationSet;
}) {
  return (
    <g data-composite-case="flag-stem-attachments">
      <FlagExample
        assetKey="wf-music-eighth-flag"
        calibrations={calibrations}
        direction="up"
        x={190}
        y={1400}
      />
      <FlagExample
        assetKey="wf-music-eighth-flag"
        calibrations={calibrations}
        direction="down"
        x={490}
        y={1400}
      />
      <FlagExample
        assetKey="wf-music-sixteenth-double-flag"
        calibrations={calibrations}
        direction="up"
        x={790}
        y={1400}
      />
      <FlagExample
        assetKey="wf-music-sixteenth-double-flag"
        calibrations={calibrations}
        direction="down"
        x={1090}
        y={1400}
      />
    </g>
  );
}

function CalibrationComposite({
  calibrations,
  theme,
}: {
  readonly calibrations: EditableGlyphCalibrationSet;
  readonly theme: CalibrationTheme;
}) {
  return (
    <figure
      className={`${styles.fixture} ${styles.calibrationComposite}`}
      data-accidental-context-cases="6"
      data-calibration-composite-theme={theme}
      data-clef-g-line-aligned="true"
      data-fixture="glyph-calibration-composite"
      data-flag-attachment-cases="4"
      data-notehead-connection-cases="8"
      data-runtime-status="draft-calibration"
      data-theme={theme}
    >
      <svg
        aria-label={`Gate B glyph calibration composites in ${theme} theme`}
        role="img"
        viewBox="0 0 1280 1580"
      >
        <text fill="currentColor" fontSize="24" fontWeight="800" x="24" y="34">
          Gate B · immutable glyph paths · draft anchors and bounds
        </text>
        <SectionFrame
          height={260}
          title="1. Treble clef · gLine alignment"
          y={55}
        />
        <SectionFrame
          height={510}
          title="2. Noteheads · optical center and stem connections"
          y={330}
        />
        <SectionFrame
          height={350}
          title="3. Accidentals · pitchCenter beside notehead"
          y={855}
        />
        <SectionFrame
          height={340}
          title="4. Flags · stemAttachment on up/down stems"
          y={1220}
        />
        <ClefCalibration calibrations={calibrations} />
        <NoteheadCalibrations calibrations={calibrations} />
        <AccidentalCalibrations calibrations={calibrations} />
        <FlagCalibrations calibrations={calibrations} />
      </svg>
      <figcaption className={styles.fixtureLabel}>
        {theme} · all metrics and anchors are draft-calibration; SVG source
        paths are unchanged
      </figcaption>
    </figure>
  );
}

export function GlyphCalibrationComposites({
  calibrations,
}: {
  readonly calibrations: EditableGlyphCalibrationSet;
}) {
  return (
    <section
      className={styles.fixtureSection}
      data-fixture-section="glyph-calibration-composites"
    >
      <h3>Gate-B calibration composites</h3>
      <p>
        Each theme repeats the same composite proof: five-line clef alignment,
        line/space notehead connections, accidental pitch centers beside a
        notehead, and flag attachments in both stem directions.
      </p>
      <div className={styles.calibrationCompositeGrid}>
        <CalibrationComposite calibrations={calibrations} theme="light" />
        <CalibrationComposite calibrations={calibrations} theme="dark" />
      </div>
    </section>
  );
}
