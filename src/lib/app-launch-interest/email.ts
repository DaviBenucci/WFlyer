import { Resend } from "resend";

import type { ContactServerConfig } from "@/lib/contact";

import type { LaunchInterestRegistration } from "./guard";

const RESEND_TIMEOUT_MS = 8_000;
export const APP_LAUNCH_OPERATIONAL_RECIPIENT =
  "welcome.app@wflyer.com.br" as const;

export interface LaunchInterestEmail {
  readonly from: string;
  readonly html: string;
  readonly subject: string;
  readonly text: string;
  readonly to: [string];
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/gu, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "'": "&#39;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
    };
    return entities[character] ?? character;
  });
}

function emailShell(preheader: string, content: string): string {
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>W_Flyer</title></head>
<body style="margin:0;padding:0;background:#12100f;color:#f4ecdf;font-family:Arial,Helvetica,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#12100f;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:620px;border:1px solid #c1b9ad;background:#12100f;">
<tr><td style="padding:32px;color:#f4ecdf;">${content}</td></tr>
<tr><td style="padding:20px 32px;border-top:1px solid #c1b9ad;color:#c1b9ad;font-size:12px;line-height:1.5;">W_Flyer &middot; tecnologia, produto e música com responsabilidade pessoal.</td></tr>
</table></td></tr></table></body></html>`;
}

export function createLaunchInterestOperationalEmail(
  email: string,
  registration: LaunchInterestRegistration,
  config: ContactServerConfig,
): LaunchInterestEmail {
  const safeEmail = escapeHtml(email);
  const safeRequestId = escapeHtml(registration.requestId);
  const safeSubmittedAt = escapeHtml(registration.submittedAt);

  return {
    from: `W_Flyer <${config.fromEmail}>`,
    html: emailShell(
      "Novo interesse no lançamento da aplicação W_Flyer.",
      `<p style="margin:0 0 10px;color:#e79271;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">Lançamento da aplicação</p>
<h1 style="margin:0 0 24px;color:#f4ecdf;font-size:28px;line-height:1.2;">Novo cadastro de interesse</h1>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;color:#f4ecdf;font-size:15px;line-height:1.6;">
<tr><td style="padding:10px 0;border-bottom:1px solid #c1b9ad;color:#c1b9ad;">E-mail</td><td style="padding:10px 0;border-bottom:1px solid #c1b9ad;text-align:right;">${safeEmail}</td></tr>
<tr><td style="padding:10px 0;border-bottom:1px solid #c1b9ad;color:#c1b9ad;">Consentimento</td><td style="padding:10px 0;border-bottom:1px solid #c1b9ad;text-align:right;">Confirmado</td></tr>
<tr><td style="padding:10px 0;border-bottom:1px solid #c1b9ad;color:#c1b9ad;">Recebido em</td><td style="padding:10px 0;border-bottom:1px solid #c1b9ad;text-align:right;">${safeSubmittedAt}</td></tr>
<tr><td style="padding:10px 0;color:#c1b9ad;">ID da solicitação</td><td style="padding:10px 0;text-align:right;font-family:monospace;">${safeRequestId}</td></tr>
</table>
<p style="margin:24px 0 0;color:#c1b9ad;font-size:13px;line-height:1.6;">Finalidade fixa: registrar interesse e enviar apenas o aviso de disponibilidade da aplicação. Não adicionar a listas de marketing.</p>`,
    ),
    subject: "[W_Flyer] Novo interesse no lançamento da aplicação",
    text: [
      "Novo cadastro de interesse no lançamento da aplicação W_Flyer.",
      "",
      `E-mail: ${email}`,
      "Consentimento: confirmado",
      `Recebido em: ${registration.submittedAt}`,
      `ID da solicitação: ${registration.requestId}`,
      "",
      "Finalidade fixa: registrar interesse e enviar apenas o aviso de disponibilidade da aplicação. Não adicionar a listas de marketing.",
    ].join("\n"),
    to: [APP_LAUNCH_OPERATIONAL_RECIPIENT],
  };
}

export function createLaunchInterestAcknowledgmentEmail(
  email: string,
  registration: LaunchInterestRegistration,
  config: ContactServerConfig,
): LaunchInterestEmail {
  return {
    from: `W_Flyer <${config.fromEmail}>`,
    html: emailShell(
      "Seu interesse no lançamento da aplicação W_Flyer foi registrado.",
      `<p style="margin:0 0 10px;color:#e79271;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">W_Flyer</p>
<h1 style="margin:0 0 18px;color:#f4ecdf;font-size:30px;line-height:1.2;">Cadastro recebido.</h1>
<p style="margin:0 0 22px;color:#c1b9ad;font-size:16px;line-height:1.7;">Seu interesse foi registrado. Você receberá apenas um aviso quando a aplicação W_Flyer estiver disponível.</p>
<table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td style="border-radius:999px;background:#e79271;"><a href="https://wflyer.com.br/aplicacao-wflyer" style="display:inline-block;padding:13px 22px;color:#12100f;font-size:15px;font-weight:700;text-decoration:none;">Conhecer a proposta</a></td></tr></table>
<p style="margin:24px 0 0;color:#c1b9ad;font-size:12px;line-height:1.6;">Referência: ${escapeHtml(registration.requestId)}. Se você não fez este cadastro, ignore esta mensagem.</p>`,
    ),
    subject: "Seu interesse no lançamento W_Flyer foi registrado",
    text: [
      "Cadastro recebido.",
      "",
      "Seu interesse foi registrado. Você receberá apenas um aviso quando a aplicação W_Flyer estiver disponível.",
      "",
      "Conheça a proposta: https://wflyer.com.br/aplicacao-wflyer",
      `Referência: ${registration.requestId}`,
      "Se você não fez este cadastro, ignore esta mensagem.",
    ].join("\n"),
    to: [email],
  };
}

async function sendWithDeadline(
  email: LaunchInterestEmail,
  config: ContactServerConfig,
  idempotencyKey: string,
): Promise<boolean> {
  const resend = new Resend(config.resendApiKey);
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    const result = await Promise.race([
      resend.emails.send(email, { idempotencyKey }),
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error("launch-interest provider deadline exceeded")),
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

export function sendLaunchInterestOperationalEmail(
  email: string,
  registration: LaunchInterestRegistration,
  config: ContactServerConfig,
): Promise<boolean> {
  return sendWithDeadline(
    createLaunchInterestOperationalEmail(email, registration, config),
    config,
    `app-launch-interest/operational/${registration.requestId}`,
  );
}

export function sendLaunchInterestAcknowledgmentEmail(
  email: string,
  registration: LaunchInterestRegistration,
  config: ContactServerConfig,
): Promise<boolean> {
  return sendWithDeadline(
    createLaunchInterestAcknowledgmentEmail(email, registration, config),
    config,
    `app-launch-interest/ack/${registration.requestId}`,
  );
}
