import { z } from "zod";

export const APP_LAUNCH_INTEREST_MAX_BODY_BYTES = 4 * 1024;

export const appLaunchInterestPayloadSchema = z.strictObject({
  consent: z.literal(true),
  email: z
    .string()
    .trim()
    .max(254)
    .email()
    .transform((value) => value.toLocaleLowerCase("en-US")),
  honeypot: z.literal(""),
  turnstileToken: z.string().trim().min(1).max(2_048),
});

export type AppLaunchInterestPayload = z.infer<
  typeof appLaunchInterestPayloadSchema
>;
