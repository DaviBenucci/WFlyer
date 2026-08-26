"use client";

import { useMemo, useState } from "react";

import { ScoreGlyph } from "@/components/score/ScoreGlyph";
import { MUSIC_GLYPH_REGISTRY } from "@/lib/music/glyphs/registry";
import type { MusicGlyphKey } from "@/lib/music/glyphs/types";
import type {
  GlyphRenderPrimitive,
  RendererGlyphCalibrations,
} from "@/lib/music/renderer/types";

import {
  createDraftCalibrationExport,
  createEditableGlyphCalibrations,
  type EditableCalibrationPoint,
  type EditableGlyphCalibration,
} from "../_fixtures/calibration-export";
import styles from "../music-lab.module.css";
import { GlyphCalibrationComposites } from "./GlyphCalibrationComposites";

const ACCIDENTAL_KEYS = [
  "wf-music-accidental-sharp",
  "wf-music-accidental-flat",
  "wf-music-accidental-natural",
] as const satisfies readonly MusicGlyphKey[];

function roleFor(assetKey: MusicGlyphKey): GlyphRenderPrimitive["role"] {
  if (assetKey === "wf-music-treble-clef") return "clef";
  if (assetKey.startsWith("wf-music-notehead")) return "notehead";
  if (assetKey.includes("flag")) return "flag";
  return "accidental";
}

function CalibrationPreview({
  calibration,
  contextPosition,
  referenceStaffStep,
  theme,
}: {
  readonly calibration: EditableGlyphCalibration;
  readonly contextPosition?: "line" | "space";
  readonly referenceStaffStep: number;
  readonly theme: "dark" | "light";
}) {
  const firstAnchor = Object.values(calibration.anchors)[0] ?? {
    x: 0.5,
    y: 0.5,
  };
  const staffSpace = 42;
  const masterGuideY = 210;
  const width = calibration.nominalWidthSp * staffSpace;
  const height = calibration.nominalHeightSp * staffSpace;
  const target = {
    x: 220,
    y: masterGuideY - ((referenceStaffStep - 4) * staffSpace) / 2,
  };
  const primitive: GlyphRenderPrimitive = {
    anchorInGlyph: firstAnchor,
    anchorTarget: target,
    assetKey: calibration.assetKey,
    height,
    id: `${calibration.assetKey}-${theme}-calibration-preview`,
    kind: "glyph",
    layer: "notes",
    mirrorX: false,
    mirrorY: false,
    role: roleFor(calibration.assetKey),
    rotationRadians: 0,
    width,
  };
  const x = target.x - firstAnchor.x * width;
  const y = target.y - firstAnchor.y * height;

  return (
    <figure
      className={styles.fixture}
      data-accidental-context={
        contextPosition ? calibration.assetKey : undefined
      }
      data-runtime-status="draft-calibration"
      data-staff-position={contextPosition}
      data-staff-step={contextPosition ? referenceStaffStep : undefined}
      data-theme={theme}
    >
      <svg
        aria-label={`${calibration.assetKey} draft anchors in ${theme}`}
        data-calibration-preview={calibration.assetKey}
        role="img"
        viewBox="0 0 440 420"
      >
        {[0, 2, 4, 6, 8].map((staffStep) => {
          const y = masterGuideY - ((staffStep - 4) * staffSpace) / 2;

          return (
            <line
              data-context-staff-step={staffStep}
              key={staffStep}
              opacity={staffStep === 4 ? 0.7 : 0.42}
              stroke="currentColor"
              strokeWidth={staffStep === 4 ? 1.5 : 1}
              x1="42"
              x2="398"
              y1={y}
              y2={y}
            />
          );
        })}
        {calibration.assetKey.includes("flag") ? (
          <line
            data-context-stem="up"
            stroke="currentColor"
            strokeWidth="2"
            x1={target.x}
            x2={target.x}
            y1={target.y}
            y2={masterGuideY}
          />
        ) : null}
        <line
          stroke="#ff4d6d"
          strokeDasharray="4 4"
          x1="20"
          x2="420"
          y1={target.y}
          y2={target.y}
        />
        <line
          stroke="#ff4d6d"
          strokeDasharray="4 4"
          x1={target.x}
          x2={target.x}
          y1="20"
          y2="400"
        />
        <ScoreGlyph primitive={primitive} />
        <rect
          fill="none"
          height={height}
          stroke="currentColor"
          strokeDasharray="5 4"
          width={width}
          x={x}
          y={y}
        />
        {Object.entries(calibration.anchors).map(([name, anchor]) => (
          <g key={name}>
            <circle
              cx={x + anchor.x * width}
              cy={y + anchor.y * height}
              data-anchor-name={name}
              fill="#ff4d6d"
              r="4"
            />
            <text
              fill="currentColor"
              fontSize="10"
              x={x + anchor.x * width + 7}
              y={y + anchor.y * height - 7}
            >
              {name}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className={styles.fixtureLabel}>
        {theme} · first anchor aligned at staffStep {referenceStaffStep}
        {contextPosition ? ` (${contextPosition})` : ""}
      </figcaption>
    </figure>
  );
}

export function CalibrationWorkbench({
  initialCalibrations,
}: {
  readonly initialCalibrations: RendererGlyphCalibrations;
}) {
  const [calibrations, setCalibrations] = useState(() =>
    createEditableGlyphCalibrations(initialCalibrations),
  );
  const [selectedKey, setSelectedKey] = useState<MusicGlyphKey>(
    "wf-music-treble-clef",
  );
  const selected = calibrations[selectedKey];
  const exportPayload = useMemo(
    () => createDraftCalibrationExport(calibrations),
    [calibrations],
  );
  const serializedPayload = JSON.stringify(exportPayload, null, 2);

  function updateMetric(
    name: "nominalHeightSp" | "nominalWidthSp",
    value: number,
  ) {
    setCalibrations((current) => ({
      ...current,
      [selectedKey]: { ...current[selectedKey], [name]: value },
    }));
  }

  function updateAnchor(
    name: string,
    axis: keyof EditableCalibrationPoint,
    value: number,
  ) {
    setCalibrations((current) => {
      const currentGlyph = current[selectedKey];
      const currentAnchor = currentGlyph.anchors[name];

      if (!currentAnchor) return current;

      return {
        ...current,
        [selectedKey]: {
          ...currentGlyph,
          anchors: {
            ...currentGlyph.anchors,
            [name]: { ...currentAnchor, [axis]: value },
          },
        },
      };
    });
  }

  const selectedReferenceStaffStep =
    selected.assetKey === "wf-music-treble-clef"
      ? 2
      : selected.assetKey.includes("flag")
        ? 8
        : 4;

  function downloadDraft() {
    const url = URL.createObjectURL(
      new Blob([serializedPayload], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.download = "wflyer-music-glyph-calibration-draft-v1.json";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      data-calibration-status="draft-calibration"
      data-fixture-component="calibration-workbench"
    >
      <div className={styles.fixtureGrid}>
        <section className={styles.fixture}>
          <h3>Draft controls</h3>
          <label>
            Glyph
            <select
              onChange={(event) =>
                setSelectedKey(event.target.value as MusicGlyphKey)
              }
              value={selectedKey}
            >
              {MUSIC_GLYPH_REGISTRY.map((entry) => (
                <option key={entry.assetKey} value={entry.assetKey}>
                  {entry.name}
                </option>
              ))}
            </select>
          </label>
          {(["nominalWidthSp", "nominalHeightSp"] as const).map((metric) => (
            <label key={metric}>
              {metric}: {selected[metric].toFixed(3)} staffSpaces
              <input
                max="8"
                min="0.1"
                onChange={(event) =>
                  updateMetric(metric, Number(event.target.value))
                }
                step="0.001"
                type="range"
                value={selected[metric]}
              />
            </label>
          ))}
          {Object.entries(selected.anchors).flatMap(([name, point]) =>
            (["x", "y"] as const).map((axis) => (
              <label key={`${name}-${axis}`}>
                {name}.{axis}: {point[axis].toFixed(3)}
                <input
                  max="1"
                  min="0"
                  onChange={(event) =>
                    updateAnchor(name, axis, Number(event.target.value))
                  }
                  step="0.001"
                  type="range"
                  value={point[axis]}
                />
              </label>
            )),
          )}
        </section>
        <CalibrationPreview
          calibration={selected}
          referenceStaffStep={selectedReferenceStaffStep}
          theme="light"
        />
        <CalibrationPreview
          calibration={selected}
          referenceStaffStep={selectedReferenceStaffStep}
          theme="dark"
        />
      </div>
      <GlyphCalibrationComposites calibrations={calibrations} />
      <section
        className={styles.fixtureSection}
        data-fixture="accidental-line-space-calibration"
      >
        <h3>Accidentals on line and space</h3>
        <p>
          Sharp, flat, and natural pitch-center anchors are shown on both a
          staff line and an adjacent space. All six contexts remain draft.
        </p>
        <div className={styles.fixtureGrid}>
          {ACCIDENTAL_KEYS.flatMap((assetKey) =>
            (
              [
                { contextPosition: "line", staffStep: 4 },
                { contextPosition: "space", staffStep: 5 },
              ] as const
            ).map(({ contextPosition, staffStep }) => (
              <CalibrationPreview
                calibration={calibrations[assetKey]}
                contextPosition={contextPosition}
                key={`${assetKey}-${contextPosition}`}
                referenceStaffStep={staffStep}
                theme="light"
              />
            )),
          )}
        </div>
      </section>
      <section className={styles.fixtureSection}>
        <h3>Exportable draft JSON</h3>
        <p>
          Export changes metadata only. Approved SVG files and registry runtime
          status remain untouched.
        </p>
        <button onClick={downloadDraft} type="button">
          Download draft JSON
        </button>
        <textarea
          aria-label="Draft calibration JSON"
          readOnly
          rows={24}
          value={serializedPayload}
        />
      </section>
    </div>
  );
}
