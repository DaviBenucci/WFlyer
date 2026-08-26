/**
 * Primitive/event IDs are public renderer diagnostics. Semantic model IDs stay
 * unchanged, while every generated renderable receives the stable `wf-` prefix.
 */
export function wfPrimitiveId(
  ...semanticParts: readonly (number | string)[]
): `wf-${string}` {
  const semanticId = semanticParts.join(":");

  return (semanticId.startsWith("wf-")
    ? semanticId
    : `wf-${semanticId}`) as `wf-${string}`;
}
