import {
  CONTACT_MAX_BODY_BYTES,
  contactPayloadSchema,
  readContactServerConfig,
  readLimitedBody,
  sendContactEmail,
  verifyTurnstile,
} from "@/lib/contact";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PublicCode =
  | "invalid_request"
  | "service_unavailable"
  | "verification_failed";

const responseHeaders = {
  "cache-control": "no-store, max-age=0",
  "content-type": "application/json; charset=utf-8",
};

function errorResponse(status: number, code: PublicCode): Response {
  return Response.json(
    { code, ok: false },
    { headers: responseHeaders, status },
  );
}

export async function POST(request: Request): Promise<Response> {
  const mediaType = request.headers.get("content-type")?.split(";", 1)[0]?.trim();
  if (mediaType?.toLowerCase() !== "application/json") {
    return errorResponse(415, "invalid_request");
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > CONTACT_MAX_BODY_BYTES) {
    return errorResponse(413, "invalid_request");
  }

  const config = readContactServerConfig();
  if (!config) return errorResponse(503, "service_unavailable");

  const origin = request.headers.get("origin");
  if (!origin || !config.allowedOrigins.has(origin)) {
    return errorResponse(403, "invalid_request");
  }

  let bodyResult;
  try {
    bodyResult = await readLimitedBody(request);
  } catch {
    return errorResponse(400, "invalid_request");
  }
  if (!bodyResult.ok) {
    return errorResponse(
      bodyResult.reason === "too_large" ? 413 : 400,
      "invalid_request",
    );
  }

  let unknownPayload: unknown;
  try {
    unknownPayload = JSON.parse(bodyResult.text);
  } catch {
    return errorResponse(400, "invalid_request");
  }

  if (
    typeof unknownPayload === "object" &&
    unknownPayload !== null &&
    "website" in unknownPayload &&
    unknownPayload.website !== ""
  ) {
    return errorResponse(400, "invalid_request");
  }

  const parsed = contactPayloadSchema.safeParse(unknownPayload);
  if (!parsed.success) return errorResponse(400, "invalid_request");

  const turnstile = await verifyTurnstile(parsed.data.turnstileToken, config);
  if (turnstile === "invalid") {
    return errorResponse(400, "verification_failed");
  }
  if (turnstile === "unavailable") {
    return errorResponse(503, "service_unavailable");
  }

  if (!(await sendContactEmail(parsed.data, config))) {
    return errorResponse(502, "service_unavailable");
  }

  return Response.json(
    { ok: true },
    { headers: responseHeaders, status: 200 },
  );
}
