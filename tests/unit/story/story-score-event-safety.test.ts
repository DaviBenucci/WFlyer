import { describe, expect, it } from "vitest";

import { STORY_SCORE_COMPOSITIONS, storyScoreSemanticFingerprint, STORY_SCORE_EXPECTED_FINGERPRINTS } from "@/lib/story/score/composition";
import { allocateEventSafePlacements, eventPrimitiveFootprintPoints, EVENT_SAFE_GEOMETRY, EventSafePlacementError } from "@/lib/story/score/event-safe-placement";
import { buildStoryScoreProjection } from "@/lib/story/score/projection";
import { StraightScorePath } from "@/lib/music/geometry/straight-score-path";
import type { ScorePathReviewZone } from "@/lib/story/score/organic-flowing";

function isolatedShelf(length: number, angle = 0) {
  const composition = { ...STORY_SCORE_COMPOSITIONS.professional, motifs: [STORY_SCORE_COMPOSITIONS.professional.motifs[0]!] };
  const zone: ScorePathReviewZone = {
    id: "test-shelf", startT: 0, endT: 1, arcLength: length,
    barlineAfter: false, chapterId: "professional-terminal", descendingArcLength: 0,
    eventCount: composition.motifs[0]!.notes.length, interactionId: null, interactionProfile: null,
    kind: "notation-safe", maximumTangentAngleDeg: Math.abs(angle), maximumTangentT: 0,
    points: [], projectVisit: null, semanticSlotIds: [composition.motifs[0]!.slotId], verticalBudget: null,
  };
  return { composition, staffSpace: 12, zones: [zone], path: new StraightScorePath(
    { x: 0, y: 0 }, { x: length * Math.cos(angle * Math.PI / 180), y: length * Math.sin(angle * Math.PI / 180) },
    { at: 0.5, towardIncreasingPitch: { x: 0, y: -1 } },
  ) };
}

describe("Stage-1 whole-group event placement", () => {
  it.each(["horizontal-enhanced", "vertical-wide", "vertical-compact", "static"] as const)(
    "renders every original group once with its complete footprint and unchanged fingerprints in %s", (mode) => {
      const projection = buildStoryScoreProjection(mode);
      for (const branch of Object.values(projection.branches)) {
        const diagnostics = branch.eventSafety;
        expect(branch.model.motifs.map(({ id }) => id)).toEqual(branch.composition.motifs.map(({ slotId }) => slotId));
        expect(storyScoreSemanticFingerprint(branch.composition)).toBe(STORY_SCORE_EXPECTED_FINGERPRINTS[branch.branch]);
        expect(diagnostics.forbiddenEventCount).toBe(0);
        expect(diagnostics.maximumTangentAngleDeg).toBeLessThanOrEqual(18);
        expect(diagnostics.maximumTangentVariationDeg).toBeLessThanOrEqual(6);
        for (const [index, motif] of branch.model.motifs.entries()) {
          const group = diagnostics.groups[index]!;
          const shelf = diagnostics.shelves[group.shelfIndex]!;
          const minimumX = branch.path.pointAt(shelf.startT).x;
          const maximumX = branch.path.pointAt(shelf.endT).x;
          expect(group.slotId).toBe(motif.id);
          for (const point of motif.primitives.flatMap(eventPrimitiveFootprintPoints)) {
            expect(point.x).toBeGreaterThanOrEqual(minimumX + 1.5 * branch.staffSpace * Math.cos(18 * Math.PI / 180) - 1e-7);
            expect(point.x).toBeLessThanOrEqual(maximumX - 1.5 * branch.staffSpace * Math.cos(18 * Math.PI / 180) + 1e-7);
          }
          if (index > 0) expect(group.marginStartT).toBeGreaterThanOrEqual(diagnostics.groups[index - 1]!.marginEndT - 1e-7);
        }
        expect(diagnostics.relocations.every(({ semanticOrderPreserved }) => semanticOrderPreserved)).toBe(true);
      }
    },
  );

  it("uses both halves of long Professional shelves when multiple assigned groups allow it", () => {
    const branch = buildStoryScoreProjection("horizontal-enhanced").branches.professional;
    const longShelves = branch.eventSafety.shelves.filter(({ classification, length }) => classification === "EVENT_SAFE_STRAIGHT" && length >= 40 * branch.staffSpace);
    let reviewed = 0;
    for (const shelf of longShelves) {
      const groups = branch.eventSafety.groups.filter(({ shelfIndex }) => branch.eventSafety.shelves[shelfIndex] === shelf);
      if (groups.length < 2) continue;
      const midpoint = (branch.path.pointAt(shelf.startT).x + branch.path.pointAt(shelf.endT).x) / 2;
      expect(branch.path.pointAt(groups[0]!.footprintStartT).x).toBeLessThan(midpoint);
      expect(branch.path.pointAt(groups.at(-1)!.footprintEndT).x).toBeGreaterThan(midpoint);
      reviewed += 1;
    }
    expect(reviewed).toBeGreaterThan(0);
  });
  it.each(["horizontal-enhanced", "vertical-wide", "vertical-compact", "static"] as const)(
    "places the unchanged Professional sequence safely in %s", (mode) => {
      const branch = buildStoryScoreProjection(mode).branches.professional;
      const result = allocateEventSafePlacements(branch);
      expect(result.motifs.map(({ motif }) => motif)).toEqual(branch.composition.motifs);
      result.motifs.forEach(({ motif }, index) => expect(motif).toBe(branch.composition.motifs[index]));
      expect(new Set(result.motifs.map(({ motif }) => motif.slotId)).size).toBe(branch.composition.motifs.length);
      expect(result.diagnostics.forbiddenEventCount).toBe(0);
      expect(result.diagnostics.maximumTangentAngleDeg).toBeLessThanOrEqual(18);
      expect(result.diagnostics.maximumTangentVariationDeg).toBeLessThanOrEqual(6);
      result.diagnostics.groups.forEach((group, index) => {
        const shelf = result.diagnostics.shelves[group.shelfIndex]!;
        expect(shelf.classification).toBe("EVENT_SAFE_STRAIGHT");
        expect(group.marginStartT).toBeGreaterThanOrEqual(shelf.startT);
        expect(group.marginEndT).toBeLessThanOrEqual(shelf.endT);
        expect(group.clearanceBefore).toBeGreaterThanOrEqual(EVENT_SAFE_GEOMETRY.marginSp * branch.staffSpace - 1e-7);
        expect(group.clearanceAfter).toBeGreaterThanOrEqual(EVENT_SAFE_GEOMETRY.marginSp * branch.staffSpace - 1e-7);
        if (index > 0) expect(group.marginStartT).toBeGreaterThanOrEqual(result.diagnostics.groups[index - 1]!.marginEndT - 1e-7);
        for (const zone of branch.zones.filter(({ kind }) => kind === "connector")) {
          expect(group.marginEndT <= zone.startT || group.marginStartT >= zone.endT).toBe(true);
        }
      });
      expect(storyScoreSemanticFingerprint(STORY_SCORE_COMPOSITIONS.professional)).toBe(STORY_SCORE_EXPECTED_FINGERPRINTS.professional);
    },
  );

  it.each([[36, 0], [1000, 19], [1000, 180]])(
    "rejects a shelf with insufficient whole-footprint capacity or invalid LTR tangent (%s, %s)", (length, angle) => {
      const input = isolatedShelf(length, angle);
      expect(() => allocateEventSafePlacements(input)).toThrow(EventSafePlacementError);
      try { allocateEventSafePlacements(input); } catch (error) {
        expect((error as EventSafePlacementError).diagnostic).toMatchObject({
          reason: "INSUFFICIENT_EVENT_SAFE_CAPACITY", zoneId: "test-shelf", slotIds: [input.composition.motifs[0]!.slotId],
        });
      }
    },
  );

  it("rejects invalid geometry and duplicate ownership rather than dropping a group", () => {
    const input = isolatedShelf(500);
    expect(() => allocateEventSafePlacements({ ...input, staffSpace: Number.NaN })).toThrow(EventSafePlacementError);
    expect(() => allocateEventSafePlacements({ ...input, path: { ...input.path,
      pointAt: () => ({ x: Number.NaN, y: 0 }), tangentAt: () => ({ x: 1, y: 0 }), normalAt: () => ({ x: 0, y: -1 }),
    } })).toThrow(EventSafePlacementError);
    expect(() => allocateEventSafePlacements({ ...input, composition: { ...input.composition,
      motifs: [...input.composition.motifs, ...input.composition.motifs],
    } })).toThrow(EventSafePlacementError);
  });

  it("keeps accidentals, stems and ledger lines inside the shelf with both margins", () => {
    const input = isolatedShelf(200);
    const motif = input.composition.motifs[0]!;
    const attached = { ...motif, staffSteps: motif.notes.map(() => 14),
      notes: motif.notes.map((note) => ({ ...note, accidental: "sharp" as const, staffStep: 14 })) };
    const result = allocateEventSafePlacements({ ...input, composition: { ...input.composition, motifs: [attached] } });
    const group = result.diagnostics.groups[0]!;
    expect(group.footprintStartT * 200).toBeGreaterThanOrEqual(18);
    expect(group.footprintEndT * 200).toBeLessThanOrEqual(182);
    expect(result.motifs[0]!.motif).toBe(attached);
    expect(allocateEventSafePlacements(input)).toEqual(allocateEventSafePlacements(input));
  });
});
