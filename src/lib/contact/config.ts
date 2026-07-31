import { z } from "zod";

const email = z.string().trim().max(254).email();

const environmentSchema = z.strictObject({
  CONTACT_ALLOWED_ORIGINS: z.string().trim().min(1),
  CONTACT_FROM_EMAIL: email,
  CONTACT_RECIPIENT_EMAIL: email,
  RESEND_API_KEY: z.string().trim().min(1),
  TURNSTILE_SECRET_KEY: z.string().trim().min(1),
});

export interface ContactServerConfig {
  readonly allowedHostnames: ReadonlySet<string>;
  readonly allowedOrigins: ReadonlySet<string>;
  readonly fromEmail: string;
  readonly recipientEmail: string;
  readonly resendApiKey: string;
  readonly turnstileSecretKey: string;
}

export function readContactServerConfig(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): ContactServerConfig | null {
  const result = environmentSchema.safeParse({
    CONTACT_ALLOWED_ORIGINS: environment.CONTACT_ALLOWED_ORIGINS,
    CONTACT_FROM_EMAIL: environment.CONTACT_FROM_EMAIL,
    CONTACT_RECIPIENT_EMAIL: environment.CONTACT_RECIPIENT_EMAIL,
    RESEND_API_KEY: environment.RESEND_API_KEY,
    TURNSTILE_SECRET_KEY: environment.TURNSTILE_SECRET_KEY,
  });
  if (!result.success) return null;

  try {
    const origins = result.data.CONTACT_ALLOWED_ORIGINS.split(",").map(
      (value) => new URL(value.trim()),
    );
    if (
      origins.length === 0 ||
      origins.some(
        (url) =>
          (url.protocol !== "https:" && url.protocol !== "http:") ||
          url.origin !== url.href.replace(/\/$/u, ""),
      )
    ) {
      return null;
    }

    return {
      allowedHostnames: new Set(origins.map(({ hostname }) => hostname)),
      allowedOrigins: new Set(origins.map(({ origin }) => origin)),
      fromEmail: result.data.CONTACT_FROM_EMAIL,
      recipientEmail: result.data.CONTACT_RECIPIENT_EMAIL,
      resendApiKey: result.data.RESEND_API_KEY,
      turnstileSecretKey: result.data.TURNSTILE_SECRET_KEY,
    };
  } catch {
    return null;
  }
}
