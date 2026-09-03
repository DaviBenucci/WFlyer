import { randomUUID } from "node:crypto";

import {
  APP_LAUNCH_INTEREST_MAX_BODY_BYTES,
  appLaunchInterestPayloadSchema,
  claimLaunchInterestRegistration,
  consumeLaunchInterestRateLimit,
  markLaunchInterestAcknowledged,
  markLaunchInterestRegistered,
  sendLaunchInterestAcknowledgmentEmail,
  sendLaunchInterestOperationalEmail,
} from "@/lib/app-launch-interest";
import {
  readContactServerConfig,
  readLimitedBody,
  verifyTurnstileAction,
} from "@/lib/contact";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PublicCode =
  | "delivery_failed"
  | "invalid_request"
  | "rate_limited"
  | "turnstile_failed";

function responseHeaders(requestId: string): HeadersInit {
  return {
    "cache-control": "no-store, max-age=0",
    "content-type": "application/json; charset=utf-8",
    "x-request-id": requestId,
  };
}

function errorResponse(
  status: number,
  code: PublicCode,
  requestId: string,
  retryAfterSeconds?: number,
): Response {
  const headers = new Headers(responseHeaders(requestId));
  if (retryAfterSeconds !== undefined) {
    headers.set("retry-after", String(retryAfterSeconds));
  }
  return Response.json({ code, ok: false }, { headers, status });
}

function requestHostname(request: Request): string | null {
  const host = request.headers.get("host");
  if (!host || host.includes(",")) return null;

  try {
    return new URL(`https://${host}`).hostname.toLocaleLowerCase("en-US");
  } catch {
    return null;
  }
}

export async function POST(request: Request): Promise<Response> {
  const requestId = randomUUID();
  const mediaType = request.headers.get("content-type")?.split(";", 1)[0]?.trim();
  if (mediaType?.toLowerCase() !== "application/json") {
    return errorResponse(415, "invalid_request", requestId);
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (
    Number.isFinite(declaredLength) &&
    declaredLength > APP_LAUNCH_INTEREST_MAX_BODY_BYTES
  ) {
    return errorResponse(413, "invalid_request", requestId);
  }

  const config = readContactServerConfig();
  if (!config) return errorResponse(503, "delivery_failed", requestId);

  const origin = request.headers.get("origin");
  const hostname = requestHostname(request);
  const urlHostname = new URL(request.url).hostname.toLocaleLowerCase("en-US");
  if (
    !origin ||
    !config.allowedOrigins.has(origin) ||
    !hostname ||
    hostname !== urlHostname ||
    !config.allowedHostnames.has(hostname)
  ) {
    return errorResponse(403, "invalid_request", requestId);
  }

  let bodyResult;
  try {
    bodyResult = await readLimitedBody(
      request,
      APP_LAUNCH_INTEREST_MAX_BODY_BYTES,
    );
  } catch {
    return errorResponse(400, "invalid_request", requestId);
  }
  if (!bodyResult.ok) {
    return errorResponse(
      bodyResult.reason === "too_large" ? 413 : 400,
      "invalid_request",
      requestId,
    );
  }

  let unknownPayload: unknown;
  try {
    unknownPayload = JSON.parse(bodyResult.text);
  } catch {
    return errorResponse(400, "invalid_request", requestId);
  }

  if (
    typeof unknownPayload === "object" &&
    unknownPayload !== null &&
    "honeypot" in unknownPayload &&
    unknownPayload.honeypot !== ""
  ) {
    return errorResponse(400, "invalid_request", requestId);
  }

  const parsed = appLaunchInterestPayloadSchema.safeParse(unknownPayload);
  if (!parsed.success) return errorResponse(400, "invalid_request", requestId);

  const turnstile = await verifyTurnstileAction(
    parsed.data.turnstileToken,
    "app-launch-interest",
    config,
  );
  if (turnstile !== "valid") {
    return errorResponse(
      turnstile === "invalid" ? 400 : 503,
      "turnstile_failed",
      requestId,
    );
  }

  const rate = consumeLaunchInterestRateLimit(request, parsed.data.email);
  if (!rate.allowed) {
    return errorResponse(
      429,
      "rate_limited",
      requestId,
      rate.retryAfterSeconds,
    );
  }

  let registration = claimLaunchInterestRegistration(parsed.data.email);
  if (!registration.registered) {
    const registered = await sendLaunchInterestOperationalEmail(
      parsed.data.email,
      registration,
      config,
    );
    if (!registered) {
      return errorResponse(502, "delivery_failed", requestId);
    }
    registration = markLaunchInterestRegistered(registration);
  }

  if (!registration.acknowledgmentSent) {
    const acknowledged = await sendLaunchInterestAcknowledgmentEmail(
      parsed.data.email,
      registration,
      config,
    );
    if (acknowledged) {
      registration = markLaunchInterestAcknowledged(registration);
    }
  }

  return Response.json(
    {
      acknowledgment:
        registration.acknowledgmentSent === true ? "sent" : "pending",
      ok: true,
      registered: true,
    },
    { headers: responseHeaders(requestId), status: 200 },
  );
}
