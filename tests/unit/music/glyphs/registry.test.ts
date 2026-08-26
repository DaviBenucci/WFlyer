import { describe, expect, it } from "vitest";

import {
  getMusicGlyph,
  MUSIC_GLYPH_REGISTRY,
} from "@/lib/music/glyphs/registry";
import { MUSIC_GLYPH_KEYS } from "@/lib/music/glyphs/types";

const EXPECTED_APPROVED_REGISTRY = {
  "wf-music-treble-clef": {
    metrics: { nominalWidthSp: 2.614, nominalHeightSp: 6.4 },
    anchors: { gLine: { x: 0.5, y: 0.62 } },
    sha256: {
      sourceMaster:
        "4d88345cb486a5f5aa5012adfa5b8ff5b373f30d5e51ce74c3236ac770e66f17",
      runtimeCandidate:
        "44a96b7cdcf968cf02c4f12673ed848fff387836f56e1fcb9a74070ae4c9064d",
    },
  },
  "wf-music-notehead-filled": {
    metrics: { nominalWidthSp: 1.248, nominalHeightSp: 0.9 },
    anchors: {
      opticalCenter: { x: 0.5, y: 0.5 },
      stemUp: { x: 0.925, y: 0.34 },
      stemDown: { x: 0.075, y: 0.66 },
    },
    sha256: {
      sourceMaster:
        "37f888799e03c4f2274b02275a7e742b69ef228683bdabbc142ca5485d82b8c1",
      runtimeCandidate:
        "026c358f82ef3e1f4c8532584570e7c9756748d823a02c6d03c8b0c437e0421f",
    },
  },
  "wf-music-notehead-open": {
    metrics: { nominalWidthSp: 1.248, nominalHeightSp: 0.9 },
    anchors: {
      opticalCenter: { x: 0.5, y: 0.5 },
      stemUp: { x: 0.925, y: 0.34 },
      stemDown: { x: 0.075, y: 0.66 },
    },
    sha256: {
      sourceMaster:
        "c0a69eba08fa256883469c96c63abede90074b0afa4cc613eb4ee8fb0578cc50",
      runtimeCandidate:
        "2655c9bfb810b223431aa2bf74e17902f223da24d1034c7708836d7b07693e1c",
    },
  },
  "wf-music-accidental-sharp": {
    metrics: { nominalWidthSp: 1.164, nominalHeightSp: 2 },
    anchors: { pitchCenter: { x: 0.5, y: 0.515 } },
    sha256: {
      sourceMaster:
        "1306551170b06814ae1874cfa7b759c1f3269878bd46516f0d1d4852e0f75227",
      runtimeCandidate:
        "63108db9625ded7c712c8a6cfca9ee644d166a2ab81ad62ea478ea89b1ac8222",
    },
  },
  "wf-music-accidental-flat": {
    metrics: { nominalWidthSp: 0.869, nominalHeightSp: 2.4 },
    anchors: { pitchCenter: { x: 0.5, y: 0.68 } },
    sha256: {
      sourceMaster:
        "2ac206d58b2c90709595653e79f56a5acb558f9e8379ec2db81f9c16909823ff",
      runtimeCandidate:
        "005894cfdc22e462302ec142dbb1b7fd6641f2e714e47481fcdcbfddf241cfcb",
    },
  },
  "wf-music-accidental-natural": {
    metrics: { nominalWidthSp: 0.835, nominalHeightSp: 2.2 },
    anchors: { pitchCenter: { x: 0.5, y: 0.5 } },
    sha256: {
      sourceMaster:
        "77ea774437b79958a86e61eddd98912cd4c350a2dab7015ce63329669750cb05",
      runtimeCandidate:
        "8e316378a06088afb4bd528b2b64f31424abc2282d60a632cdccd2b1d0d463af",
    },
  },
  "wf-music-eighth-flag": {
    metrics: { nominalWidthSp: 1.431, nominalHeightSp: 2.25 },
    anchors: { stemAttachment: { x: 0.105, y: 0.125 } },
    sha256: {
      sourceMaster:
        "ca10cf10414caf67584de93ab91b42b125f45848fe9d09beeb6491d0b74a04f3",
      runtimeCandidate:
        "b57a19e3a299abde7f300f5a32ed91bedf86d530cc7528eaef965394809e0bad",
    },
  },
  "wf-music-sixteenth-double-flag": {
    metrics: { nominalWidthSp: 1.538, nominalHeightSp: 2.5 },
    anchors: { stemAttachment: { x: 0.105, y: 0.125 } },
    sha256: {
      sourceMaster:
        "e69df994c6ec4369f80f57a08cb686cac8838f417a13798123d114cb650a7446",
      runtimeCandidate:
        "59df5110560ec9f8542c38cc4c7e2b84d11a9353f284958a45fa4d6674dd682f",
    },
  },
} as const;

describe("music glyph registry", () => {
  it("registers every normalized glyph exactly once", () => {
    expect(MUSIC_GLYPH_REGISTRY).toHaveLength(8);
    expect(MUSIC_GLYPH_REGISTRY.map(({ assetKey }) => assetKey)).toEqual(
      MUSIC_GLYPH_KEYS,
    );
    expect(new Set(MUSIC_GLYPH_REGISTRY.map(({ id }) => id)).size).toBe(8);
  });

  it("registers the exact human-approved metrics and anchors", () => {
    for (const entry of MUSIC_GLYPH_REGISTRY) {
      const expected = EXPECTED_APPROVED_REGISTRY[entry.assetKey];

      expect(entry.runtimeStatus).toBe("approved");
      expect(entry.metrics).toEqual(expected.metrics);
      expect(entry.requiredAnchors).toEqual(expected.anchors);
      expect(entry.sha256).toEqual(expected.sha256);
    }
  });

  it("retains checksum and immutable-path traceability", () => {
    expect(getMusicGlyph("wf-music-treble-clef").sha256).toEqual(
      EXPECTED_APPROVED_REGISTRY["wf-music-treble-clef"].sha256,
    );

    for (const entry of MUSIC_GLYPH_REGISTRY) {
      expect(entry.geometryPolicy).toBe(
        "immutable-without-explicit-human-reapproval",
      );
      expect(entry.sourceMaster).toMatch(
        /^docs\/design-reference\/visual-library\/musical\/glyphs\/source\//,
      );
      expect(entry.runtimeCandidate).toMatch(
        /^src\/assets\/visuals\/musical\//,
      );
      expect(entry.sha256.sourceMaster).toMatch(/^[a-f0-9]{64}$/);
      expect(entry.sha256.runtimeCandidate).toMatch(/^[a-f0-9]{64}$/);
    }
  });
});
