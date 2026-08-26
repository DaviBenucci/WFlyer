import type {
  RenderPrimitiveRole,
  ScoreRenderPrimitive,
} from "./types";

/** Lower ranks paint first. Equal-rank primitives preserve semantic order. */
export const CANONICAL_PRIMITIVE_PAINT_RANK = {
  "staff-line": 0,
  clef: 10,
  "key-signature": 10,
  ledger: 20,
  accidental: 30,
  notehead: 40,
  stem: 40,
  flag: 40,
  "beam-primary": 50,
  "beam-secondary": 50,
  "beam-secondary-hook-left": 50,
  "beam-secondary-hook-right": 50,
  tuplet: 60,
  barline: 70,
  "final-barline-thin": 70,
  "final-barline-thick": 70,
} as const satisfies Readonly<Record<RenderPrimitiveRole, number>>;

export function sortPrimitivesByPaintOrder(
  primitives: readonly ScoreRenderPrimitive[],
): readonly ScoreRenderPrimitive[] {
  return primitives
    .map((primitive, semanticIndex) => ({ primitive, semanticIndex }))
    .sort(
      (left, right) =>
        CANONICAL_PRIMITIVE_PAINT_RANK[left.primitive.role] -
          CANONICAL_PRIMITIVE_PAINT_RANK[right.primitive.role] ||
        left.semanticIndex - right.semanticIndex,
    )
    .map(({ primitive }) => primitive);
}
