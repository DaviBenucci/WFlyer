import { Resend } from "resend";

import { contactProjectTypes } from "@/content/site-content";

import type { ContactServerConfig } from "./config";
import type { ContactPayload } from "./schema";

const RESEND_TIMEOUT_MS = 8_000;

export interface ContactEmail {
  readonly from: string;
  readonly replyTo: string;
  readonly subject: string;
  readonly text: string;
  readonly to: [string];
}

const projectLabels = new Map(
  contactProjectTypes.map(({ label, value }) => [value, label]),
);

export function createContactEmail(
  payload: ContactPayload,
  config: ContactServerConfig,
): ContactEmail {
  const projectLabel = projectLabels.get(payload.projectType)!;
  const company = payload.company?.trim() || "Não informada";

  return {
    from: `W_Flyer <${config.fromEmail}>`,
    replyTo: payload.email,
    subject: `[W_Flyer] Novo contato — ${projectLabel}`,
    text: [
      "Novo contato recebido pelo site institucional W_Flyer.",
      "",
      `Nome: ${payload.name}`,
      `E-mail: ${payload.email}`,
      `Empresa: ${company}`,
      `Tipo de projeto: ${projectLabel}`,
      "",
      "Mensagem:",
      payload.message,
      "",
      "Consentimento de privacidade: confirmado",
    ].join("\n"),
    to: [config.recipientEmail],
  };
}

export async function sendContactEmail(
  payload: ContactPayload,
  config: ContactServerConfig,
): Promise<boolean> {
  const resend = new Resend(config.resendApiKey);
  const delivery = resend.emails.send(createContactEmail(payload, config), {
    idempotencyKey: `contact/${payload.submissionId}`,
  });
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    const result = await Promise.race([
      delivery,
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error("contact provider deadline exceeded")),
          RESEND_TIMEOUT_MS,
        );
      }),
    ]);
    return result.error === null;
  } catch {
    return false;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
