interface SvgPoint {
  readonly x: number;
  readonly y: number;
}

/** Sub-pixel review precision shared by SSR and every browser runtime. */
export const SCORE_REVIEW_SVG_PRECISION = 6;

/**
 * Produces stable decimal SVG attribute text across server and browser
 * runtimes. The renderer keeps its full-precision geometry; normalization is
 * applied only at the presentation boundary when a precision is requested.
 */
export function serializeSvgNumber(
  value: number,
  numericPrecision?: number,
): string {
  if (numericPrecision === undefined) return String(value);

  const fixed = value.toFixed(numericPrecision);
  const decimalSeparator = fixed.indexOf(".");

  if (decimalSeparator < 0) return fixed === "-0" ? "0" : fixed;

  const integer = fixed.slice(0, decimalSeparator);
  const fraction = fixed.slice(decimalSeparator + 1).replace(/0+$/u, "");
  const normalized = fraction.length > 0 ? `${integer}.${fraction}` : integer;

  return normalized === "-0" ? "0" : normalized;
}

export function serializeSvgPoints(
  points: readonly SvgPoint[],
  numericPrecision?: number,
): string {
  return points
    .map(
      ({ x, y }) =>
        `${serializeSvgNumber(x, numericPrecision)},${serializeSvgNumber(y, numericPrecision)}`,
    )
    .join(" ");
}
