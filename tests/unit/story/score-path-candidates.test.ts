import { describe, expect, it } from "vitest";

import {
  buildScorePathReviewTrack,
  resolveScorePathReviewSelection,
  SCORE_PATH_REVIEW_BRANCHES,
  SCORE_PATH_REVIEW_CANDIDATES,
  SCORE_PATH_REVIEW_CANDIDATE_IDS,
  SCORE_PATH_REVIEW_COMPACT_RESPONSIVE_BASELINE_METRICS,
  SCORE_PATH_REVIEW_FLOWING_BASELINE_METRICS,
  SCORE_PATH_REVIEW_FLOWING_STATUS,
  SCORE_PATH_REVIEW_GEOMETRY_EPSILON,
  SCORE_PATH_REVIEW_MAX_NOTATION_TANGENT_ANGLE_DEG,
  SCORE_PATH_REVIEW_MODES,
  scorePathReviewCompactTrackWidth,
  scorePathReviewDescendingPolylineArcLength,
  scorePathReviewEventPlacements,
  scorePathReviewFrameAt,
  scorePathReviewSemanticFingerprint,
  scorePathReviewStaffPoint,
  scorePathReviewUrl,
} from "@/app/%5F_visual-lab/story/score-paths/_fixtures/score-path-candidates";

describe("Phase-9 task-33 ScorePath candidates", () => {
  it("treats sub-epsilon shelf noise as level in descent evidence", () => {
    const levelNoise = SCORE_PATH_REVIEW_GEOMETRY_EPSILON / 2;
    const realDescent = SCORE_PATH_REVIEW_GEOMETRY_EPSILON * 2;

    expect(
      scorePathReviewDescendingPolylineArcLength([
        { x: 0, y: 0 },
        { x: 3, y: levelNoise },
      ]),
    ).toBe(0);
    expect(
      scorePathReviewDescendingPolylineArcLength([
        { x: 0, y: 0 },
        { x: 3, y: realDescent },
      ]),
    ).toBeCloseTo(Math.hypot(3, realDescent), 12);
  });

  it("builds Organic Soft and Organic Flowing for both required vertical modes", () => {
    expect(SCORE_PATH_REVIEW_CANDIDATE_IDS).toEqual([
      "organic-soft",
      "organic-flowing",
    ]);
    expect(SCORE_PATH_REVIEW_MODES).toEqual([
      "vertical-wide",
      "vertical-compact",
    ]);

    for (const candidateId of SCORE_PATH_REVIEW_CANDIDATE_IDS) {
      for (const mode of SCORE_PATH_REVIEW_MODES) {
        for (const branch of SCORE_PATH_REVIEW_BRANCHES) {
          const track = buildScorePathReviewTrack(candidateId, mode, branch);

          expect(track.chapters).toHaveLength(7);
          expect(track.chapters[0]?.chapterId).toBe("home");
          expect(track.chapters.at(-1)?.chapterId).toBe(
            `${branch}-terminal`,
          );
          expect(track.zones.filter(({ kind }) => kind === "notation-safe"))
            .toHaveLength(7);
          expect(track.model.staff.lines).toHaveLength(5);
          expect(track.evidence.fiveLineContinuity).toBe(true);
        }
      }
    }
  });

  it("fits Organic Flowing to every required compact viewport without stretched compact geometry", () => {
    const viewportMatrix = [360, 375, 390, 412, 414, 430] as const;
    const expectedTrackWidths = [344, 359, 374, 396, 398, 414] as const;

    expect(
      viewportMatrix.map((viewportWidth) =>
        scorePathReviewCompactTrackWidth(viewportWidth),
      ),
    ).toEqual(expectedTrackWidths);
    expect(scorePathReviewCompactTrackWidth(768)).toBe(414);

    for (const [index, compactTrackWidth] of expectedTrackWidths.entries()) {
      for (const branch of SCORE_PATH_REVIEW_BRANCHES) {
        const track = buildScorePathReviewTrack(
          "organic-flowing",
          "vertical-compact",
          branch,
          { compactTrackWidth },
        );
        const connectorDirections = track.zones
          .filter(({ kind }) => kind === "connector")
          .map(({ points }) =>
            Math.sign(points.at(-1)!.x - points[0]!.x),
          );

        expect(track.width).toBe(compactTrackWidth);
        expect(track.evidence.boundsViolations).toBe(0);
        expect(track.evidence.reservedContentCollisions).toBe(0);
        expect(track.evidence.maximumNotationTangentAngleDeg).toBeLessThanOrEqual(
          SCORE_PATH_REVIEW_MAX_NOTATION_TANGENT_ANGLE_DEG,
        );
        expect(track.evidence.minimumCurvatureRadius).toBeGreaterThan(
          track.staffSpace * 2,
        );
        expect(
          connectorDirections.every(
            (direction, connectorIndex) =>
              direction !== 0 &&
              (connectorIndex === 0 ||
                direction === -connectorDirections[connectorIndex - 1]!),
          ),
        ).toBe(true);
        expect(track.evidence.semanticFingerprint).toBe(
          buildScorePathReviewTrack(
            "organic-flowing",
            "vertical-wide",
            branch,
          ).evidence.semanticFingerprint,
        );
      }

      expect(scorePathReviewCompactTrackWidth(viewportMatrix[index]!)).toBe(
        compactTrackWidth,
      );
    }
  });

  it("reserves the measured compact About line-wrap allowance for Organic Soft", () => {
    const track = buildScorePathReviewTrack(
      "organic-soft",
      "vertical-compact",
      "professional",
      { compactTrackWidth: 414 },
    );
    const about = track.chapters.find(
      ({ chapterId }) => chapterId === "professional-about",
    );

    expect(about?.contentRect.height).toBe(1460);
    expect(track.height).toBe(12998);
    expect(track.evidence.reservedContentCollisions).toBe(0);
  });

  it("uses measured scene envelopes and the shortest valid compact transition interval", () => {
    const expected = {
      professional: {
        chapterHeights: [380, 1380, 1500, 1220, 1880, 1400, 500],
        contentOwnedHeight: 8260,
        totalTrackHeight: 9898,
      },
      application: {
        chapterHeights: [380, 1140, 1140, 980, 780, 500, 470],
        contentOwnedHeight: 5390,
        totalTrackHeight: 7028,
      },
    } as const;

    for (const branch of SCORE_PATH_REVIEW_BRANCHES) {
      const track = buildScorePathReviewTrack(
        "organic-flowing",
        "vertical-compact",
        branch,
        { compactTrackWidth: 414 },
      );
      const baseline =
        SCORE_PATH_REVIEW_COMPACT_RESPONSIVE_BASELINE_METRICS[branch];
      const metrics = track.evidence.flowMetrics;

      expect(track.chapters.map(({ contentRect }) => contentRect.height)).toEqual(
        expected[branch].chapterHeights,
      );
      expect(metrics.contentOwnedHeight).toBe(
        expected[branch].contentOwnedHeight,
      );
      expect(metrics.totalTrackHeight).toBe(expected[branch].totalTrackHeight);
      expect(metrics.transitionOnlyHeight).toBe(1638);
      expect(metrics.largestContentFreeVerticalInterval).toBe(234);
      expect(metrics.totalTrackHeight).toBeLessThan(baseline.totalTrackHeight);
      expect(metrics.transitionOnlyHeight).toBeLessThan(
        baseline.transitionOnlyHeight,
      );
      expect(metrics.largestContentFreeVerticalInterval).toBeLessThan(
        baseline.largestContentFreeVerticalInterval,
      );
    }
  });

  it("proves continuous C2 geometry, clear staff offsets, and event-free connectors", () => {
    for (const candidateId of SCORE_PATH_REVIEW_CANDIDATE_IDS) {
      for (const mode of SCORE_PATH_REVIEW_MODES) {
        for (const branch of SCORE_PATH_REVIEW_BRANCHES) {
          const track = buildScorePathReviewTrack(candidateId, mode, branch);
          const { evidence } = track;

          expect(evidence.continuity.maximumPointGap).toBeLessThanOrEqual(1e-7);
          expect(evidence.continuity.minimumTangentAlignment).toBeGreaterThanOrEqual(
            1 - 1e-7,
          );
          expect(evidence.continuity.maximumCurvatureDelta).toBeLessThanOrEqual(
            1e-7,
          );
          expect(evidence.connectorEventCount).toBe(0);
          expect(evidence.pathSelfIntersections).toBe(0);
          expect(evidence.staffLineSelfIntersections).toBe(0);
          expect(evidence.minimumAdjacentStaffLineDistance).toBeCloseTo(
            track.staffSpace,
            6,
          );
          expect(evidence.minimumCurvatureRadius).toBeGreaterThan(
            track.staffSpace * 2,
          );

          for (const zone of track.zones.filter(
            ({ kind }) => kind === "connector",
          )) {
            expect(zone.semanticSlotIds).toEqual([]);
            expect(zone.eventCount).toBe(0);
          }
        }
      }
    }
  });

  it("keeps every event inside a left-to-right notation zone at or below 18 degrees", () => {
    for (const candidateId of SCORE_PATH_REVIEW_CANDIDATE_IDS) {
      for (const mode of SCORE_PATH_REVIEW_MODES) {
        for (const branch of SCORE_PATH_REVIEW_BRANCHES) {
          const track = buildScorePathReviewTrack(candidateId, mode, branch);
          const placements = scorePathReviewEventPlacements(track);

          expect(track.evidence.maximumNotationTangentAngleDeg).toBeLessThanOrEqual(
            SCORE_PATH_REVIEW_MAX_NOTATION_TANGENT_ANGLE_DEG,
          );
          expect(placements.length).toBeGreaterThan(0);
          for (const placement of placements) {
            expect(placement.zoneId).toMatch(/^notation:/u);
            expect(placement.tangentAngleDeg).toBeLessThanOrEqual(
              SCORE_PATH_REVIEW_MAX_NOTATION_TANGENT_ANGLE_DEG,
            );
            expect(scorePathReviewFrameAt(track, placement.t).tangent.x).toBeGreaterThan(
              0,
            );
          }
        }
      }
    }
  });

  it("keeps clefs unmirrored, final barlines conventional, and pitch offsets coherent", () => {
    for (const candidateId of SCORE_PATH_REVIEW_CANDIDATE_IDS) {
      for (const mode of SCORE_PATH_REVIEW_MODES) {
        for (const branch of SCORE_PATH_REVIEW_BRANCHES) {
          const track = buildScorePathReviewTrack(candidateId, mode, branch);
          const clef = track.model.primitives.find(
            (primitive) => primitive.kind === "glyph" && primitive.role === "clef",
          );
          const final = track.model.primitives.filter(
            ({ role }) =>
              role === "final-barline-thin" || role === "final-barline-thick",
          );
          const firstEvent = scorePathReviewEventPlacements(track)[0]!;
          const low = scorePathReviewStaffPoint(track, firstEvent.t, 0);
          const high = scorePathReviewStaffPoint(track, firstEvent.t, 8);

          expect(clef).toMatchObject({
            kind: "glyph",
            role: "clef",
            mirrorX: false,
            mirrorY: false,
          });
          expect(Math.abs(track.evidence.clef.rotationDegrees)).toBeLessThanOrEqual(
            SCORE_PATH_REVIEW_MAX_NOTATION_TANGENT_ANGLE_DEG,
          );
          expect(final.map(({ role }) => role)).toEqual([
            "final-barline-thin",
            "final-barline-thick",
          ]);
          expect(track.evidence.finalBarline).toBe(
            "thin-gap-thick-conventional",
          );
          expect(high.y).toBeLessThan(low.y);
        }
      }
    }
  });

  it("clears every authored Phase-7/8 content envelope and names all required reserved areas", () => {
    const requiredReasons = new Set([
      "heading-and-body",
      "persona-slot",
      "services-modules",
      "process-stages",
      "project-card-fan",
      "contact-form",
      "application-overview",
      "application-benefits",
      "application-tablet-demo",
      "access-action",
      "terminal-content",
    ]);
    const observedReasons = new Set<string>();

    for (const branch of SCORE_PATH_REVIEW_BRANCHES) {
      const track = buildScorePathReviewTrack(
        "organic-soft",
        "vertical-wide",
        branch,
      );

      expect(track.evidence.reservedContentCollisions).toBe(0);
      expect(track.evidence.boundsViolations).toBe(0);
      for (const chapter of track.chapters) {
        chapter.reservedReasons.forEach((reason) => observedReasons.add(reason));
      }
    }

    expect(observedReasons).toEqual(requiredReasons);
  });

  it("preserves semantic composition across candidates and responsive geometry", () => {
    for (const branch of SCORE_PATH_REVIEW_BRANCHES) {
      const fingerprints = SCORE_PATH_REVIEW_CANDIDATE_IDS.flatMap(
        (candidateId) =>
          SCORE_PATH_REVIEW_MODES.map((mode) => {
            const track = buildScorePathReviewTrack(candidateId, mode, branch);

            expect(track.composition.emptySlots.length).toBeGreaterThan(0);
            return scorePathReviewSemanticFingerprint(track.composition);
          }),
      );

      expect(new Set(fingerprints).size).toBe(1);
    }
  });

  it("keeps the two directions geometrically distinct without theme-dependent geometry", () => {
    for (const mode of SCORE_PATH_REVIEW_MODES) {
      for (const branch of SCORE_PATH_REVIEW_BRANCHES) {
        const soft = buildScorePathReviewTrack("organic-soft", mode, branch);
        const flowing = buildScorePathReviewTrack(
          "organic-flowing",
          mode,
          branch,
        );

        expect(soft.path.pointAt(0.5)).not.toEqual(flowing.path.pointAt(0.5));
        expect(soft.evidence.semanticFingerprint).toBe(
          flowing.evidence.semanticFingerprint,
        );
      }
    }
  });

  it("records Organic Flowing as selected for revision and materially reduces its scroll budgets", () => {
    expect(SCORE_PATH_REVIEW_FLOWING_STATUS).toBe("SELECTED_FOR_REVISION");
    expect(SCORE_PATH_REVIEW_CANDIDATES["organic-flowing"].status).toBe(
      "SELECTED_FOR_REVISION",
    );

    for (const mode of SCORE_PATH_REVIEW_MODES) {
      for (const branch of SCORE_PATH_REVIEW_BRANCHES) {
        const track = buildScorePathReviewTrack(
          "organic-flowing",
          mode,
          branch,
        );
        const baseline = SCORE_PATH_REVIEW_FLOWING_BASELINE_METRICS[mode][branch];
        const { flowMetrics } = track.evidence;

        expect(flowMetrics.totalTrackHeight).toBeLessThanOrEqual(
          baseline.totalTrackHeight * 0.95,
        );
        expect(flowMetrics.transitionOnlyVerticalDistance).toBeLessThanOrEqual(
          baseline.transitionOnlyVerticalDistance * 0.95,
        );
        expect(flowMetrics.longestConnectorArcLength).toBeLessThan(
          baseline.longestConnectorArcLength,
        );
      }
    }
  });

  it("uses alternating single-crossing connectors and carries events on shallow descents", () => {
    for (const mode of SCORE_PATH_REVIEW_MODES) {
      for (const branch of SCORE_PATH_REVIEW_BRANCHES) {
        const track = buildScorePathReviewTrack(
          "organic-flowing",
          mode,
          branch,
        );
        const connectors = track.zones.filter(({ kind }) => kind === "connector");
        const directions = connectors.map((zone) =>
          Math.sign(zone.points.at(-1)!.x - zone.points[0]!.x),
        );
        const placements = scorePathReviewEventPlacements(track);

        expect(connectors).toHaveLength(6);
        expect(directions.every((direction) => direction !== 0)).toBe(true);
        expect(
          directions.every(
            (direction, index) => index === 0 || direction === -directions[index - 1]!,
          ),
        ).toBe(true);

        for (const connector of connectors) {
          const netLateralTravel = Math.abs(
            connector.points.at(-1)!.x - connector.points[0]!.x,
          );
          const totalLateralTravel = connector.points.slice(1).reduce(
            (total, point, index) =>
              total + Math.abs(point.x - connector.points[index]!.x),
            0,
          );

          expect(netLateralTravel).toBeGreaterThan(track.width * 0.18);
          expect(totalLateralTravel).toBeLessThan(
            netLateralTravel * 1.45 + track.width * 0.08,
          );
        }

        expect(
          placements.filter(
            (placement) =>
              scorePathReviewFrameAt(track, placement.t).tangent.y > 1e-7,
          ).length,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("bounds every beam/stem to its rhythmic group and terminates at the final barline", () => {
    for (const mode of SCORE_PATH_REVIEW_MODES) {
      for (const branch of SCORE_PATH_REVIEW_BRANCHES) {
        const track = buildScorePathReviewTrack(
          "organic-flowing",
          mode,
          branch,
        );
        const { primitiveSpans, terminal } = track.evidence;

        expect(track.evidence.primitiveSpanViolations).toEqual([]);
        expect(primitiveSpans.length).toBeGreaterThan(0);
        expect(
          primitiveSpans.every(
            ({ length, maximumAllowedLength, rhythmicGroup, semanticSlotId }) =>
              length <= maximumAllowedLength + 1e-7 &&
              rhythmicGroup.length > 0 &&
              semanticSlotId.length > 0,
          ),
        ).toBe(true);
        expect(terminal).toEqual({
          finalBarlineT: 1,
          maximumPrimitiveProgressAfterThickBar: 0,
          maximumStaffContinuationPastThinBar: expect.closeTo(0, 7),
          staffTerminatesAtFinalBarline: true,
          terminalTailConnectorCount: 0,
        });
        expect(track.zones.at(-1)?.kind).toBe("notation-safe");
        expect(track.zones.at(-1)?.endT).toBe(1);
      }
    }
  });

  it("preserves the accepted branch semantic fingerprints exactly", () => {
    expect(
      buildScorePathReviewTrack(
        "organic-flowing",
        "vertical-wide",
        "professional",
      ).evidence.semanticFingerprint,
    ).toBe("fnv1a32:039bce10");
    expect(
      buildScorePathReviewTrack(
        "organic-flowing",
        "vertical-wide",
        "application",
      ).evidence.semanticFingerprint,
    ).toBe("fnv1a32:1fe3356b");
  });

  it("resolves deterministic review URLs and fails unknown query values to safe defaults", () => {
    expect(
      resolveScorePathReviewSelection({
        candidate: "organic-flowing",
        mode: "vertical-compact",
        theme: "dark",
      }),
    ).toEqual({
      candidateId: "organic-flowing",
      mode: "vertical-compact",
      theme: "dark",
    });
    expect(
      resolveScorePathReviewSelection({
        candidate: "unknown",
        mode: "horizontal-enhanced",
        theme: "system",
      }),
    ).toEqual({
      candidateId: "organic-flowing",
      mode: "vertical-wide",
      theme: "light",
    });
    expect(
      scorePathReviewUrl(
        "organic-flowing",
        "vertical-compact",
        "dark",
      ),
    ).toBe(
      "/__visual-lab/story/score-paths?candidate=organic-flowing&mode=vertical-compact&theme=dark",
    );
  });
});
