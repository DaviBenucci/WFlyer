import { ComposerConfigurationError, COMPOSER_VERSION } from "./types";

const FNV1A_OFFSET_BASIS = 0x81_1c_9d_c5;
const FNV1A_PRIME = 0x01_00_01_93;
const UINT32_RANGE = 0x1_0000_0000;
const textEncoder = new TextEncoder();

export type SeedPart = number | string;

function updateFnv1a(hash: number, byte: number): number {
  return Math.imul((hash ^ byte) >>> 0, FNV1A_PRIME) >>> 0;
}

function encodeLength(length: number): readonly number[] {
  return [
    (length >>> 24) & 0xff,
    (length >>> 16) & 0xff,
    (length >>> 8) & 0xff,
    length & 0xff,
  ];
}

function seedPartToString(part: SeedPart): string {
  if (typeof part === "number") {
    if (!Number.isSafeInteger(part)) {
      throw new ComposerConfigurationError(
        `Numeric seed parts must be safe integers; received ${String(part)}.`,
      );
    }

    return String(part);
  }

  return part;
}

/** FNV-1a over length-prefixed UTF-8 parts, avoiding concatenation collisions. */
export function hashSeedParts(parts: readonly SeedPart[]): number {
  let hash = FNV1A_OFFSET_BASIS;

  for (const part of parts) {
    const bytes = textEncoder.encode(seedPartToString(part));

    for (const byte of encodeLength(bytes.length)) {
      hash = updateFnv1a(hash, byte);
    }

    for (const byte of bytes) {
      hash = updateFnv1a(hash, byte);
    }
  }

  return hash >>> 0;
}

export function deriveChapterSeed(
  sessionSeed: string,
  chapterId: string,
  composerVersion: number = COMPOSER_VERSION,
): number {
  if (sessionSeed.length === 0 || chapterId.length === 0) {
    throw new ComposerConfigurationError(
      "Session seed and chapter ID must both be non-empty.",
    );
  }

  return hashSeedParts([
    "wflyer-music-composer",
    composerVersion,
    sessionSeed,
    chapterId,
  ]);
}

export function formatVersionedChapterSeed(
  derivedSeed: number,
  composerVersion: number = COMPOSER_VERSION,
): string {
  if (
    !Number.isSafeInteger(derivedSeed) ||
    derivedSeed < 0 ||
    derivedSeed > 0xffff_ffff ||
    !Number.isSafeInteger(composerVersion) ||
    composerVersion <= 0
  ) {
    throw new ComposerConfigurationError(
      "Versioned chapter seeds require a uint32 seed and positive integer version.",
    );
  }

  return `wf-chapter-seed-v${composerVersion}-${derivedSeed
    .toString(16)
    .padStart(8, "0")}`;
}

export class Mulberry32 {
  private state: number;

  constructor(seed: number) {
    if (!Number.isSafeInteger(seed)) {
      throw new ComposerConfigurationError(
        `PRNG seed must be a safe integer; received ${String(seed)}.`,
      );
    }

    this.state = seed >>> 0;
  }

  nextUint32(): number {
    this.state = (this.state + 0x6d_2b_79_f5) >>> 0;

    let value = this.state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return (value ^ (value >>> 14)) >>> 0;
  }

  nextFloat(): number {
    return this.nextUint32() / UINT32_RANGE;
  }

  nextInt(exclusiveMaximum: number): number {
    if (!Number.isSafeInteger(exclusiveMaximum) || exclusiveMaximum <= 0) {
      throw new ComposerConfigurationError(
        "PRNG integer bounds must be positive safe integers.",
      );
    }

    return Math.floor(this.nextFloat() * exclusiveMaximum);
  }
}

export interface WeightedCandidate<T> {
  readonly value: T;
  readonly weight: number;
}

function assertWeight(weight: number): void {
  if (!Number.isFinite(weight) || weight < 0) {
    throw new ComposerConfigurationError(
      `Candidate weights must be finite and non-negative; received ${String(weight)}.`,
    );
  }
}

/**
 * Returns a deterministic weighted schedule without replacement. Rejecting one
 * item therefore advances to a stable next candidate instead of altering it.
 */
export function weightedCandidateSchedule<T>(
  candidates: readonly WeightedCandidate<T>[],
  prng: Mulberry32,
): readonly T[] {
  const remaining = candidates
    .map((candidate) => {
      assertWeight(candidate.weight);
      return candidate;
    })
    .filter(({ weight }) => weight > 0);
  const schedule: T[] = [];

  while (remaining.length > 0) {
    const totalWeight = remaining.reduce(
      (total, candidate) => total + candidate.weight,
      0,
    );

    if (!Number.isFinite(totalWeight) || totalWeight <= 0) {
      throw new ComposerConfigurationError(
        "The remaining deterministic candidate weight must be positive and finite.",
      );
    }

    const threshold = prng.nextFloat() * totalWeight;
    let cumulative = 0;
    let selectedIndex = remaining.length - 1;

    for (const [index, candidate] of remaining.entries()) {
      cumulative += candidate.weight;

      if (threshold < cumulative) {
        selectedIndex = index;
        break;
      }
    }

    const [selected] = remaining.splice(selectedIndex, 1);

    if (!selected) {
      throw new ComposerConfigurationError(
        "The deterministic candidate schedule entered an invalid state.",
      );
    }

    schedule.push(selected.value);
  }

  return Object.freeze(schedule);
}
