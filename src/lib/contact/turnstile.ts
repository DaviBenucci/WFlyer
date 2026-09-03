import { randomUUID } from "node:crypto";

import type { ContactServerConfig } from "./config";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_TIMEOUT_MS = 5_000;

interface TurnstileResponse {
  readonly action?: unknown;
  readonly hostname?: unknown;
  readonly success?: unknown;
}

export type TurnstileResult = "invalid" | "unavailable" | "valid";

export type TurnstileAction = "app-launch-interest" | "contact";

export async function verifyTurnstileAction(
  token: string,
  action: TurnstileAction,
  config: ContactServerConfig,
  fetchImplementation: typeof fetch = fetch,
): Promise<TurnstileResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TURNSTILE_TIMEOUT_MS);

  try {
    const response = await fetchImplementation(TURNSTILE_VERIFY_URL, {
      body: JSON.stringify({
        idempotency_key: randomUUID(),
        response: token,
        secret: config.turnstileSecretKey,
      }),
      cache: "no-store",
      headers: { "content-type": "application/json" },
      method: "POST",
      signal: controller.signal,
    });
    if (!response.ok) return "unavailable";

    const result = (await response.json()) as TurnstileResponse;
    if (
      result.success !== true ||
      result.action !== action ||
      typeof result.hostname !== "string" ||
      !config.allowedHostnames.has(result.hostname)
    ) {
      return "invalid";
    }

    return "valid";
  } catch {
    return "unavailable";
  } finally {
    clearTimeout(timeoutId);
  }
}

export function verifyTurnstile(
  token: string,
  config: ContactServerConfig,
  fetchImplementation: typeof fetch = fetch,
): Promise<TurnstileResult> {
  return verifyTurnstileAction(
    token,
    "contact",
    config,
    fetchImplementation,
  );
}
