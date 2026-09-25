import {
  SCORE_REVIEW_SVG_PRECISION,
  serializeSvgNumber,
} from "@/components/score/svg-number";
import type { EventSafePlacementDiagnostics } from "@/lib/story/score/event-safe-placement";

/** ASM-IMP-DEC-010: presentation only, after full-precision safety validation. */
export function serializeStoryScoreGeometry(value: unknown): string {
  return JSON.stringify(value, (_key, item: unknown) =>
    typeof item === "number"
      ? Number(serializeSvgNumber(item, SCORE_REVIEW_SVG_PRECISION))
      : item,
  );
}

export function serializeStoryScoreEventSafety(diagnostics: EventSafePlacementDiagnostics): string {
  // Search effort is engine-specific telemetry. It is neither an allocation
  // decision nor geometry; the complete raw diagnostics remain in Projection.
  const { candidateCount, ...canonical } = diagnostics;
  void candidateCount;
  return serializeStoryScoreGeometry(canonical);
}
