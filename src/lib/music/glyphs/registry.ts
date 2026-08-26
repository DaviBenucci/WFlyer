import type {
  AccidentalAnchors,
  FlagAnchors,
  GlyphRegistryEntry,
  MusicGlyphEntryFor,
  MusicGlyphKey,
  MusicGlyphRegistryEntry,
  NoteheadAnchors,
  TrebleClefAnchors,
} from "./types";

const common = {
  runtimeStatus: "approved",
  geometryPolicy: "immutable-without-explicit-human-reapproval",
} as const;

export const MUSIC_GLYPH_REGISTRY = [
  {
    ...common,
    id: "MUS-GLYPH-001",
    assetKey: "wf-music-treble-clef",
    name: "Treble Clef",
    sourceMaster:
      "docs/design-reference/visual-library/musical/glyphs/source/wf-music-treble-clef-master.svg",
    runtimeCandidate:
      "src/assets/visuals/musical/wf-music-treble-clef.svg",
    viewBox: { minX: 0, minY: 0, width: 611.628, height: 1497.326 },
    requiredAnchors: { gLine: { x: 0.5, y: 0.62 } },
    metrics: { nominalWidthSp: 2.614, nominalHeightSp: 6.4 },
    sha256: {
      sourceMaster:
        "4d88345cb486a5f5aa5012adfa5b8ff5b373f30d5e51ce74c3236ac770e66f17",
      runtimeCandidate:
        "44a96b7cdcf968cf02c4f12673ed848fff387836f56e1fcb9a74070ae4c9064d",
    },
  } satisfies GlyphRegistryEntry<"wf-music-treble-clef", TrebleClefAnchors>,
  {
    ...common,
    id: "MUS-GLYPH-002",
    assetKey: "wf-music-notehead-filled",
    name: "Filled Notehead",
    sourceMaster:
      "docs/design-reference/visual-library/musical/glyphs/source/wf-music-notehead-filled-master.svg",
    runtimeCandidate:
      "src/assets/visuals/musical/wf-music-notehead-filled.svg",
    viewBox: { minX: 0, minY: 0, width: 541.593, height: 390.605 },
    requiredAnchors: {
      opticalCenter: { x: 0.5, y: 0.5 },
      stemUp: { x: 0.925, y: 0.34 },
      stemDown: { x: 0.075, y: 0.66 },
    },
    metrics: { nominalWidthSp: 1.248, nominalHeightSp: 0.9 },
    sha256: {
      sourceMaster:
        "37f888799e03c4f2274b02275a7e742b69ef228683bdabbc142ca5485d82b8c1",
      runtimeCandidate:
        "026c358f82ef3e1f4c8532584570e7c9756748d823a02c6d03c8b0c437e0421f",
    },
  } satisfies GlyphRegistryEntry<"wf-music-notehead-filled", NoteheadAnchors>,
  {
    ...common,
    id: "MUS-GLYPH-003",
    assetKey: "wf-music-notehead-open",
    name: "Open Notehead",
    sourceMaster:
      "docs/design-reference/visual-library/musical/glyphs/source/wf-music-notehead-open-master.svg",
    runtimeCandidate: "src/assets/visuals/musical/wf-music-notehead-open.svg",
    viewBox: { minX: 0, minY: 0, width: 766.593, height: 552.582 },
    requiredAnchors: {
      opticalCenter: { x: 0.5, y: 0.5 },
      stemUp: { x: 0.925, y: 0.34 },
      stemDown: { x: 0.075, y: 0.66 },
    },
    metrics: { nominalWidthSp: 1.248, nominalHeightSp: 0.9 },
    sha256: {
      sourceMaster:
        "c0a69eba08fa256883469c96c63abede90074b0afa4cc613eb4ee8fb0578cc50",
      runtimeCandidate:
        "2655c9bfb810b223431aa2bf74e17902f223da24d1034c7708836d7b07693e1c",
    },
  } satisfies GlyphRegistryEntry<"wf-music-notehead-open", NoteheadAnchors>,
  {
    ...common,
    id: "MUS-GLYPH-004",
    assetKey: "wf-music-accidental-sharp",
    name: "Sharp Accidental",
    sourceMaster:
      "docs/design-reference/visual-library/musical/glyphs/source/wf-music-accidental-sharp-master.svg",
    runtimeCandidate:
      "src/assets/visuals/musical/wf-music-accidental-sharp.svg",
    viewBox: { minX: 0, minY: 0, width: 525.113, height: 902.359 },
    requiredAnchors: { pitchCenter: { x: 0.5, y: 0.515 } },
    metrics: { nominalWidthSp: 1.164, nominalHeightSp: 2 },
    sha256: {
      sourceMaster:
        "1306551170b06814ae1874cfa7b759c1f3269878bd46516f0d1d4852e0f75227",
      runtimeCandidate:
        "63108db9625ded7c712c8a6cfca9ee644d166a2ab81ad62ea478ea89b1ac8222",
    },
  } satisfies GlyphRegistryEntry<"wf-music-accidental-sharp", AccidentalAnchors>,
  {
    ...common,
    id: "MUS-GLYPH-005",
    assetKey: "wf-music-accidental-flat",
    name: "Flat Accidental",
    sourceMaster:
      "docs/design-reference/visual-library/musical/glyphs/source/wf-music-accidental-flat-master.svg",
    runtimeCandidate:
      "src/assets/visuals/musical/wf-music-accidental-flat.svg",
    viewBox: { minX: 0, minY: 0, width: 418.175, height: 1154.599 },
    requiredAnchors: { pitchCenter: { x: 0.5, y: 0.68 } },
    metrics: { nominalWidthSp: 0.869, nominalHeightSp: 2.4 },
    sha256: {
      sourceMaster:
        "2ac206d58b2c90709595653e79f56a5acb558f9e8379ec2db81f9c16909823ff",
      runtimeCandidate:
        "005894cfdc22e462302ec142dbb1b7fd6641f2e714e47481fcdcbfddf241cfcb",
    },
  } satisfies GlyphRegistryEntry<"wf-music-accidental-flat", AccidentalAnchors>,
  {
    ...common,
    id: "MUS-GLYPH-006",
    assetKey: "wf-music-accidental-natural",
    name: "Natural Accidental",
    sourceMaster:
      "docs/design-reference/visual-library/musical/glyphs/source/wf-music-accidental-natural-master.svg",
    runtimeCandidate:
      "src/assets/visuals/musical/wf-music-accidental-natural.svg",
    viewBox: { minX: 0, minY: 0, width: 418.038, height: 1101.737 },
    requiredAnchors: { pitchCenter: { x: 0.5, y: 0.5 } },
    metrics: { nominalWidthSp: 0.835, nominalHeightSp: 2.2 },
    sha256: {
      sourceMaster:
        "77ea774437b79958a86e61eddd98912cd4c350a2dab7015ce63329669750cb05",
      runtimeCandidate:
        "8e316378a06088afb4bd528b2b64f31424abc2282d60a632cdccd2b1d0d463af",
    },
  } satisfies GlyphRegistryEntry<"wf-music-accidental-natural", AccidentalAnchors>,
  {
    ...common,
    id: "MUS-GLYPH-007",
    assetKey: "wf-music-eighth-flag",
    name: "Eighth Flag (Up Master)",
    sourceMaster:
      "docs/design-reference/visual-library/musical/glyphs/source/wf-music-eighth-flag-master.svg",
    runtimeCandidate: "src/assets/visuals/musical/wf-music-eighth-flag.svg",
    viewBox: { minX: 0, minY: 0, width: 526.696, height: 828.126 },
    requiredAnchors: { stemAttachment: { x: 0.105, y: 0.125 } },
    metrics: { nominalWidthSp: 1.431, nominalHeightSp: 2.25 },
    sha256: {
      sourceMaster:
        "ca10cf10414caf67584de93ab91b42b125f45848fe9d09beeb6491d0b74a04f3",
      runtimeCandidate:
        "b57a19e3a299abde7f300f5a32ed91bedf86d530cc7528eaef965394809e0bad",
    },
  } satisfies GlyphRegistryEntry<"wf-music-eighth-flag", FlagAnchors>,
  {
    ...common,
    id: "MUS-GLYPH-008",
    assetKey: "wf-music-sixteenth-double-flag",
    name: "Sixteenth Double Flag (Up Master)",
    sourceMaster:
      "docs/design-reference/visual-library/musical/glyphs/source/wf-music-sixteenth-double-flag-master.svg",
    runtimeCandidate:
      "src/assets/visuals/musical/wf-music-sixteenth-double-flag.svg",
    viewBox: { minX: 0, minY: 0, width: 535.696, height: 870.796 },
    requiredAnchors: { stemAttachment: { x: 0.105, y: 0.125 } },
    metrics: { nominalWidthSp: 1.538, nominalHeightSp: 2.5 },
    sha256: {
      sourceMaster:
        "e69df994c6ec4369f80f57a08cb686cac8838f417a13798123d114cb650a7446",
      runtimeCandidate:
        "59df5110560ec9f8542c38cc4c7e2b84d11a9353f284958a45fa4d6674dd682f",
    },
  } satisfies GlyphRegistryEntry<
    "wf-music-sixteenth-double-flag",
    FlagAnchors
  >,
] as const satisfies readonly MusicGlyphRegistryEntry[];

const registryByKey = new Map<MusicGlyphKey, MusicGlyphRegistryEntry>(
  MUSIC_GLYPH_REGISTRY.map((entry) => [entry.assetKey, entry]),
);

export function getMusicGlyph<TKey extends MusicGlyphKey>(
  assetKey: TKey,
): MusicGlyphEntryFor<TKey> {
  const entry = registryByKey.get(assetKey);

  if (!entry) {
    throw new RangeError(`Unknown music glyph: ${assetKey}`);
  }

  return entry as MusicGlyphEntryFor<TKey>;
}
