import { createHash, randomUUID } from "node:crypto";

const REGISTRATION_TTL_MS = 24 * 60 * 60 * 1_000;
const RATE_WINDOW_MS = 15 * 60 * 1_000;
const EMAIL_RATE_LIMIT = 3;
const CLIENT_RATE_LIMIT = 8;
const MAX_REGISTRATIONS = 2_048;
const MAX_RATE_BUCKETS = 4_096;

interface RateBucket {
  count: number;
  resetAt: number;
}

export interface LaunchInterestRegistration {
  readonly acknowledgmentSent: boolean;
  readonly addressKey: string;
  readonly registered: boolean;
  readonly requestId: string;
  readonly submittedAt: string;
}

const registrations = new Map<string, LaunchInterestRegistration>();
const rateBuckets = new Map<string, RateBucket>();

function digest(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function emailKey(email: string): string {
  return digest(`email:${email}`);
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",", 1)[0];
  const address =
    request.headers.get("cf-connecting-ip") ??
    forwarded?.trim() ??
    request.headers.get("x-real-ip") ??
    "unavailable";

  return digest(`client:${address}`);
}

function trimMaps(now: number): void {
  for (const [key, registration] of registrations) {
    if (Date.parse(registration.submittedAt) + REGISTRATION_TTL_MS <= now) {
      registrations.delete(key);
    }
  }
  for (const [key, bucket] of rateBuckets) {
    if (bucket.resetAt <= now) rateBuckets.delete(key);
  }

  while (registrations.size > MAX_REGISTRATIONS) {
    const oldestKey = registrations.keys().next().value as string | undefined;
    if (!oldestKey) break;
    registrations.delete(oldestKey);
  }
  while (rateBuckets.size > MAX_RATE_BUCKETS) {
    const oldestKey = rateBuckets.keys().next().value as string | undefined;
    if (!oldestKey) break;
    rateBuckets.delete(oldestKey);
  }
}

function consumeBucket(
  key: string,
  limit: number,
  now: number,
): { readonly allowed: boolean; readonly retryAfterSeconds: number } {
  const existing = rateBuckets.get(key);
  const bucket =
    existing && existing.resetAt > now
      ? existing
      : { count: 0, resetAt: now + RATE_WINDOW_MS };
  bucket.count += 1;
  rateBuckets.delete(key);
  rateBuckets.set(key, bucket);

  return {
    allowed: bucket.count <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1_000)),
  };
}

export function consumeLaunchInterestRateLimit(
  request: Request,
  email: string,
  now = Date.now(),
): { readonly allowed: boolean; readonly retryAfterSeconds: number } {
  trimMaps(now);
  const emailResult = consumeBucket(`e:${emailKey(email)}`, EMAIL_RATE_LIMIT, now);
  const clientResult = consumeBucket(`c:${clientKey(request)}`, CLIENT_RATE_LIMIT, now);

  return {
    allowed: emailResult.allowed && clientResult.allowed,
    retryAfterSeconds: Math.max(
      emailResult.retryAfterSeconds,
      clientResult.retryAfterSeconds,
    ),
  };
}

export function claimLaunchInterestRegistration(
  email: string,
  now = Date.now(),
): LaunchInterestRegistration {
  trimMaps(now);
  const addressKey = emailKey(email);
  const existing = registrations.get(addressKey);
  if (existing) return existing;

  const registration: LaunchInterestRegistration = Object.freeze({
    acknowledgmentSent: false,
    addressKey,
    registered: false,
    requestId: randomUUID(),
    submittedAt: new Date(now).toISOString(),
  });
  registrations.set(addressKey, registration);
  trimMaps(now);
  return registration;
}

function updateRegistration(
  registration: LaunchInterestRegistration,
  update: Partial<
    Pick<LaunchInterestRegistration, "acknowledgmentSent" | "registered">
  >,
): LaunchInterestRegistration {
  const current = registrations.get(registration.addressKey);
  if (!current || current.requestId !== registration.requestId) {
    return registration;
  }

  const next = Object.freeze({ ...current, ...update });
  registrations.set(registration.addressKey, next);
  return next;
}

export function markLaunchInterestRegistered(
  registration: LaunchInterestRegistration,
): LaunchInterestRegistration {
  return updateRegistration(registration, { registered: true });
}

export function markLaunchInterestAcknowledged(
  registration: LaunchInterestRegistration,
): LaunchInterestRegistration {
  return updateRegistration(registration, {
    acknowledgmentSent: true,
    registered: true,
  });
}

export function resetLaunchInterestGuardsForTests(): void {
  registrations.clear();
  rateBuckets.clear();
}
