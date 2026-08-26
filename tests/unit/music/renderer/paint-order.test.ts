import { describe, expect, it } from "vitest";

import { buildNoteModel } from "@/lib/music/renderer/build-note-model";
import { sortPrimitivesByPaintOrder } from "@/lib/music/renderer/paint-order";

import {
  TEST_CALIBRATION,
  TEST_PATH,
  TEST_STAFF_SPACE,
  TEST_TOKENS,
} from "./fixtures";

describe("canonical primitive paint order", () => {
  it("places every ledger before accidentals and note glyph/stem/flag data", () => {
    const note = buildNoteModel({
      id: "paint-note",
      accidental: "sharp",
      beamed: false,
      calibration: TEST_CALIBRATION,
      duration: "eighth",
      path: TEST_PATH,
      staffSpace: TEST_STAFF_SPACE,
      staffStep: -4,
      t: 0.5,
      tokens: TEST_TOKENS.note,
    });
    const ordered = sortPrimitivesByPaintOrder([
      note.notehead,
      ...note.ledgerLines,
      ...(note.stem ? [note.stem] : []),
      ...(note.accidental ? [note.accidental] : []),
      ...(note.flag ? [note.flag] : []),
    ]);

    expect(ordered.map(({ role }) => role)).toEqual([
      "ledger",
      "ledger",
      "accidental",
      "notehead",
      "stem",
      "flag",
    ]);
    expect(note.primitives.every(({ id }) => id.startsWith("wf-"))).toBe(
      true,
    );
  });
});
