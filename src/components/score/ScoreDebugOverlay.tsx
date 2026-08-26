import type {
  GlyphRenderPrimitive,
  ScoreRenderModel,
  ScoreRenderPrimitive,
} from "@/lib/music/renderer/types";

function primitiveReferencePoint(primitive: ScoreRenderPrimitive) {
  switch (primitive.kind) {
    case "glyph":
      return primitive.anchorTarget;
    case "tuplet":
      return primitive.labelPosition;
    case "beam":
    case "line":
      return {
        x: (primitive.start.x + primitive.end.x) / 2,
        y: (primitive.start.y + primitive.end.y) / 2,
      };
    case "polyline":
      return primitive.points[Math.floor(primitive.points.length / 2)] ?? null;
  }
}

function GlyphAnchor({ primitive }: { readonly primitive: GlyphRenderPrimitive }) {
  return (
    <circle
      cx={primitive.anchorTarget.x}
      cy={primitive.anchorTarget.y}
      data-debug-anchor={primitive.id}
      r={2.4}
    />
  );
}

export interface ScoreDebugOverlayProps {
  readonly model: ScoreRenderModel;
  readonly showIds?: boolean;
}

export function ScoreDebugOverlay({
  model,
  showIds = true,
}: ScoreDebugOverlayProps) {
  return (
    <g aria-hidden="true" data-score-debug-overlay="true">
      {model.motifs.map((motif, groupIndex) => {
        const firstNote = motif.notes[0];

        if (!firstNote) return null;

        return (
          <g
            data-debug-group-index={groupIndex}
            data-debug-motif-id={motif.motifId}
            data-debug-slot-id={motif.id}
            key={`debug-motif-${motif.id}`}
          >
            <text x={firstNote.center.x} y={firstNote.center.y - 18}>
              {`slot=${motif.id} motif=${motif.motifId} group=${groupIndex}`}
            </text>
            {motif.notes.map((note) => (
              <text
                data-debug-staff-step={note.staffStep}
                data-debug-stem-direction={note.stemDirection ?? "none"}
                key={`debug-note-${note.id}`}
                x={note.center.x + 4}
                y={note.center.y + 10}
              >
                {`step=${note.staffStep} stem=${note.stemDirection ?? "none"}`}
              </text>
            ))}
          </g>
        );
      })}
      {model.primitives.map((primitive) => {
        const point = primitiveReferencePoint(primitive);

        return (
          <g key={`debug-${primitive.id}`}>
            {primitive.kind === "glyph" ? (
              <GlyphAnchor primitive={primitive} />
            ) : point ? (
              <circle cx={point.x} cy={point.y} r={1.5} />
            ) : null}
            {showIds && point ? (
              <text x={point.x + 4} y={point.y - 4}>
                {primitive.id}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}
