import { composeSegment } from "@/lib/music/composer/compose-segment";
import type {
  ComposedSegment,
  ReservedScoreZone,
  ReservedZoneReason,
  ScoreCompositionSlot,
} from "@/lib/music/composer/types";

import type { StoryChapterId } from "../types";

export const STORY_SCORE_SESSION_SEED = "phase-9-task-33-review-v1";

export const STORY_SCORE_BRANCHES = Object.freeze([
  "professional",
  "application",
] as const);
export type StoryScoreBranch = (typeof STORY_SCORE_BRANCHES)[number];

export const STORY_SCORE_BRANCH_CHAPTERS = Object.freeze({
  professional: Object.freeze([
    "home",
    "professional-about",
    "professional-services",
    "professional-process",
    "professional-projects",
    "professional-contact",
    "professional-terminal",
  ] as const satisfies readonly StoryChapterId[]),
  application: Object.freeze([
    "home",
    "application-overview",
    "application-how-it-works",
    "application-benefits",
    "application-demo",
    "application-access",
    "application-terminal",
  ] as const satisfies readonly StoryChapterId[]),
} satisfies Readonly<Record<StoryScoreBranch, readonly StoryChapterId[]>>);

const RESERVED_COMPOSER_REASON = Object.freeze({
  home: "headline",
  "professional-about": "persona",
  "professional-projects": "project-cards",
  "professional-contact": "form",
  "application-demo": "tablet",
} as const satisfies Partial<Record<StoryChapterId, ReservedZoneReason>>);

function buildCompositionSlots(branch: StoryScoreBranch): {
  readonly reservedZones: readonly ReservedScoreZone[];
  readonly slots: readonly ScoreCompositionSlot[];
} {
  const chapters = STORY_SCORE_BRANCH_CHAPTERS[branch];
  const slotIds = chapters.flatMap((chapterId) => [
    `${chapterId}:primary`,
    `${chapterId}:reserved`,
  ]);
  const slotCount = slotIds.length;
  const slots = slotIds.map((id, index) => {
    const start = (index + 0.14) / slotCount;
    const end = (index + 0.86) / slotCount;

    return Object.freeze({
      id,
      start,
      end,
      density: id.endsWith(":reserved") ? "sparse" : "normal",
      allowedMotifFamilies: Object.freeze(["quarter"] as const),
      ...(id.startsWith(`${chapters.at(-1)}:`)
        ? { role: "terminal" as const }
        : {}),
    });
  });
  const reservedZones = chapters.flatMap((chapterId, chapterIndex) => {
    const reason =
      RESERVED_COMPOSER_REASON[
        chapterId as keyof typeof RESERVED_COMPOSER_REASON
      ];

    if (!reason) return [];

    const slot = slots[chapterIndex * 2 + 1]!;
    return [Object.freeze({ start: slot.start, end: slot.end, reason })];
  });

  return Object.freeze({
    slots: Object.freeze(slots),
    reservedZones: Object.freeze(reservedZones),
  });
}

let composerInvocationCount = 0;

function composeApprovedBranch(branch: StoryScoreBranch): ComposedSegment {
  const { reservedZones, slots } = buildCompositionSlots(branch);
  composerInvocationCount += 1;

  return composeSegment({
    sessionSeed: STORY_SCORE_SESSION_SEED,
    branchId: `score-path-review:${branch}`,
    chapterId: `score-path-layout:${branch}`,
    profile: "CALM",
    slots,
    reservedZones,
  });
}

export const STORY_SCORE_COMPOSITIONS = Object.freeze({
  professional: composeApprovedBranch("professional"),
  application: composeApprovedBranch("application"),
} satisfies Readonly<Record<StoryScoreBranch, ComposedSegment>>);

function fnv1a(value: string): string {
  let hash = 0x811c9dc5;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function storyScoreSemanticFingerprint(
  composition: ComposedSegment,
): string {
  return fnv1a(
    JSON.stringify({
      composerVersion: composition.composerVersion,
      pitchContourTableVersion: composition.pitchContourTableVersion,
      seed: composition.seed,
      branchId: composition.branchId,
      chapterId: composition.chapterId,
      profile: composition.profile,
      motifs: composition.motifs.map((motif) => ({
        slotId: motif.slotId,
        motifId: motif.motifId,
        durations: motif.durations,
        staffSteps: motif.staffSteps,
        contourId: motif.contourId,
        contourTranslation: motif.contourTranslation,
      })),
      emptySlots: composition.emptySlots,
    }),
  );
}

export const STORY_SCORE_EXPECTED_FINGERPRINTS = Object.freeze({
  professional: "fnv1a32:039bce10",
  application: "fnv1a32:1fe3356b",
} as const satisfies Readonly<Record<StoryScoreBranch, string>>);

for (const branch of STORY_SCORE_BRANCHES) {
  const actual = storyScoreSemanticFingerprint(
    STORY_SCORE_COMPOSITIONS[branch],
  );
  const expected = STORY_SCORE_EXPECTED_FINGERPRINTS[branch];

  if (actual !== expected) {
    throw new Error(
      `Approved ${branch} score fingerprint changed: ${actual} !== ${expected}`,
    );
  }
}

export const STORY_SCORE_SEGMENTS = Object.freeze(
  STORY_SCORE_BRANCHES.flatMap((branch) =>
    STORY_SCORE_BRANCH_CHAPTERS[branch].slice(1).map((chapterId) =>
      Object.freeze({
        branch,
        chapterId,
        semanticSlotIds: Object.freeze([
          `${chapterId}:primary`,
          `${chapterId}:reserved`,
        ]),
      }),
    ),
  ),
);

export function storyScoreCompositionDiagnostics() {
  return Object.freeze({
    composerInvocationCount,
    sessionSeed: STORY_SCORE_SESSION_SEED,
    fingerprints: STORY_SCORE_EXPECTED_FINGERPRINTS,
  });
}
