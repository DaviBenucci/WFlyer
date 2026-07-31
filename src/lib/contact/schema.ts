import { z } from "zod";

import { contactProjectTypes } from "@/content/site-content";

export const CONTACT_MAX_BODY_BYTES = 16 * 1024;

const projectTypeValues = contactProjectTypes.map(({ value }) => value) as [
  (typeof contactProjectTypes)[number]["value"],
  ...(typeof contactProjectTypes)[number]["value"][],
];

const htmlLikePattern = /<\/?[a-z][^>]*>/iu;
const forbiddenControlPattern = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u;

function plainText(minimum: number, maximum: number) {
  return z
    .string()
    .trim()
    .min(minimum)
    .max(maximum)
    .refine((value) => !htmlLikePattern.test(value))
    .refine((value) => !forbiddenControlPattern.test(value));
}

export const contactPayloadSchema = z.strictObject({
  name: plainText(2, 100).refine((value) => !/[\r\n]/u.test(value)),
  email: z.string().trim().max(254).email(),
  company: plainText(0, 120)
    .refine((value) => !/[\r\n]/u.test(value))
    .optional(),
  projectType: z.enum(projectTypeValues),
  message: plainText(20, 3_000).transform((value) =>
    value.replaceAll("\r\n", "\n").replaceAll("\r", "\n"),
  ),
  privacyConsent: z.literal(true),
  turnstileToken: z.string().trim().min(1).max(2_048),
  website: z.literal(""),
});

export type ContactPayload = z.infer<typeof contactPayloadSchema>;

export type LimitedBodyResult =
  | { readonly ok: true; readonly text: string }
  | { readonly ok: false; readonly reason: "empty" | "too_large" };

export async function readLimitedBody(
  request: Request,
  maximumBytes = CONTACT_MAX_BODY_BYTES,
): Promise<LimitedBodyResult> {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength) {
    const parsedLength = Number(declaredLength);
    if (Number.isFinite(parsedLength) && parsedLength > maximumBytes) {
      return { ok: false, reason: "too_large" };
    }
  }

  if (!request.body) return { ok: false, reason: "empty" };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let byteLength = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      byteLength += value.byteLength;
      if (byteLength > maximumBytes) {
        await reader.cancel();
        return { ok: false, reason: "too_large" };
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  if (byteLength === 0) return { ok: false, reason: "empty" };
  const combined = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return { ok: true, text: new TextDecoder("utf-8", { fatal: true }).decode(combined) };
}
