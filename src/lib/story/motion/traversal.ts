export const HEADER_TRAVERSAL_TIMING = Object.freeze({
  distanceRangeSeconds: 2.35,
  ease: "power2.inOut",
  maximumDurationSeconds: 3,
  minimumDurationSeconds: 0.65,
});

function requireFiniteDistance(distance: number): number {
  if (!Number.isFinite(distance)) {
    throw new RangeError("Header traversal distance must be finite.");
  }

  return Math.min(1, Math.max(0, Math.abs(distance)));
}

/**
 * Phase-6 operational timing. The canonical formula is proportional to the
 * current physical story distance and has a normative 3-second hard ceiling.
 */
export function resolveHeaderTraversalDuration(distance: number): number {
  const normalizedDistance = requireFiniteDistance(distance);
  const duration =
    HEADER_TRAVERSAL_TIMING.minimumDurationSeconds +
    HEADER_TRAVERSAL_TIMING.distanceRangeSeconds * normalizedDistance;

  return Math.min(
    HEADER_TRAVERSAL_TIMING.maximumDurationSeconds,
    Math.max(HEADER_TRAVERSAL_TIMING.minimumDurationSeconds, duration),
  );
}
