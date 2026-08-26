import { describe, expect, it } from "vitest";

import {
  deriveChapterSeed,
  formatVersionedChapterSeed,
  hashSeedParts,
  Mulberry32,
  weightedCandidateSchedule,
} from "@/lib/music/composer/prng";

describe("composer seed hashing", () => {
  it("matches the version-1 length-prefixed FNV-1a golden outputs", () => {
    expect(hashSeedParts([])).toBe(2_166_136_261);
    expect(hashSeedParts(["abc"])).toBe(1_235_115_924);
    expect(hashSeedParts(["ab", "c"])).toBe(3_213_635_320);
    expect(hashSeedParts(["a", "bc"])).toBe(770_207_536);
    expect(hashSeedParts(["wflyer", 1, "session", "chapter"])).toBe(
      3_441_893_583,
    );
  });

  it("uses length prefixes so partitioned seed material cannot collide", () => {
    expect(hashSeedParts(["ab", "c"])).not.toBe(
      hashSeedParts(["a", "bc"]),
    );
  });

  it("derives stable, versioned, chapter-specific sub-seeds", () => {
    expect(deriveChapterSeed("fixed-seed", "chapter-a")).toBe(3_729_220_224);
    expect(deriveChapterSeed("fixed-seed", "chapter-a")).not.toBe(
      deriveChapterSeed("fixed-seed", "chapter-b"),
    );
    expect(deriveChapterSeed("fixed-seed", "chapter-a", 1)).not.toBe(
      deriveChapterSeed("fixed-seed", "chapter-a", 2),
    );
    expect(
      formatVersionedChapterSeed(
        deriveChapterSeed("fixed-seed", "chapter-a"),
      ),
    ).toBe("wf-chapter-seed-v1-de476280");
  });

  it("rejects invalid formatted chapter-seed inputs", () => {
    expect(() => formatVersionedChapterSeed(-1)).toThrow(/uint32/u);
    expect(() => formatVersionedChapterSeed(0, 0)).toThrow(/positive/u);
  });
});

describe("Mulberry32", () => {
  it("matches the version-1 unsigned integer golden sequence", () => {
    const prng = new Mulberry32(0);

    expect(Array.from({ length: 6 }, () => prng.nextUint32())).toEqual([
      1_144_304_738, 1_416_247, 958_946_056, 627_933_444, 2_007_157_716,
      2_340_967_985,
    ]);
  });

  it("creates a deterministic weighted rejection schedule without replacement", () => {
    const candidates = [
      { value: "a", weight: 1 },
      { value: "b", weight: 4 },
      { value: "disabled", weight: 0 },
      { value: "c", weight: 2 },
    ] as const;

    const first = weightedCandidateSchedule(candidates, new Mulberry32(42));
    const second = weightedCandidateSchedule(candidates, new Mulberry32(42));

    expect(first).toEqual(second);
    expect(first).toHaveLength(3);
    expect(new Set(first)).toEqual(new Set(["a", "b", "c"]));
    expect(first).not.toContain("disabled");
  });

  it("rejects invalid seeds, bounds, and candidate weights", () => {
    expect(() => new Mulberry32(Number.NaN)).toThrow(/safe integer/u);
    expect(() => new Mulberry32(1).nextInt(0)).toThrow(/positive/u);
    expect(() =>
      weightedCandidateSchedule(
        [{ value: "invalid", weight: Number.POSITIVE_INFINITY }],
        new Mulberry32(1),
      ),
    ).toThrow(/finite/u);
  });
});
