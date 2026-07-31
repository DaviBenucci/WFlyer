import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  CONTACT_MAX_BODY_BYTES,
  contactPayloadSchema,
  createContactEmail,
  readContactServerConfig,
  readLimitedBody,
  sendContactEmail,
  verifyTurnstile,
  type ContactPayload,
  type ContactServerConfig,
} from "@/lib/contact";

const resendSend = vi.hoisted(() => vi.fn());

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: resendSend };
  },
}));

const config: ContactServerConfig = {
  allowedHostnames: new Set(["wflyer.com.br"]),
  allowedOrigins: new Set(["https://wflyer.com.br"]),
  fromEmail: "site@wflyer.com.br",
  recipientEmail: "davi.benucci@wflyer.com.br",
  resendApiKey: "re_test",
  turnstileSecretKey: "turnstile_test",
};

const payload: ContactPayload = {
  company: "W_Flyer",
  email: "visitante@example.com",
  message: "Preciso conversar sobre um projeto digital sob medida.",
  name: "Pessoa Visitante",
  privacyConsent: true,
  projectType: "solucao-personalizada",
  turnstileToken: "token-publico",
  website: "",
};

describe("contact domain boundary", () => {
  beforeEach(() => {
    resendSend.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("normalizes valid plain text and rejects unknown, HTML-like, and control fields", () => {
    const valid = contactPayloadSchema.safeParse({
      ...payload,
      company: "  W_Flyer  ",
      message: "  Linha um com contexto.\r\nLinha dois com detalhes.  ",
      name: "  Pessoa Visitante  ",
    });

    expect(valid.success).toBe(true);
    if (valid.success) {
      expect(valid.data.name).toBe("Pessoa Visitante");
      expect(valid.data.company).toBe("W_Flyer");
      expect(valid.data.message).toBe(
        "Linha um com contexto.\nLinha dois com detalhes.",
      );
    }
    expect(
      contactPayloadSchema.safeParse({ ...payload, extra: "unknown" }).success,
    ).toBe(false);
    expect(
      contactPayloadSchema.safeParse({
        ...payload,
        message: "<strong>Conteúdo que não pode ser HTML.</strong>",
      }).success,
    ).toBe(false);
    expect(
      contactPayloadSchema.safeParse({ ...payload, name: "Nome\u0000" }).success,
    ).toBe(false);
  });

  it("enforces declared and streamed 16 KiB body limits", async () => {
    const declared = new Request("https://wflyer.com.br/api/contact", {
      body: "{}",
      headers: { "content-length": String(CONTACT_MAX_BODY_BYTES + 1) },
      method: "POST",
    });
    await expect(readLimitedBody(declared)).resolves.toEqual({
      ok: false,
      reason: "too_large",
    });

    const streamed = new Request("https://wflyer.com.br/api/contact", {
      body: "x".repeat(CONTACT_MAX_BODY_BYTES + 1),
      method: "POST",
    });
    await expect(readLimitedBody(streamed)).resolves.toEqual({
      ok: false,
      reason: "too_large",
    });
  });

  it("derives exact origins and hostnames and fails closed on bad configuration", () => {
    expect(
      readContactServerConfig({
        CONTACT_ALLOWED_ORIGINS:
          "https://wflyer.com.br,https://staging.wflyer.com.br",
        CONTACT_FROM_EMAIL: "site@wflyer.com.br",
        CONTACT_RECIPIENT_EMAIL: "davi.benucci@wflyer.com.br",
        RESEND_API_KEY: "re_test",
        TURNSTILE_SECRET_KEY: "turnstile_test",
      }),
    ).toMatchObject({
      allowedHostnames: new Set(["wflyer.com.br", "staging.wflyer.com.br"]),
      allowedOrigins: new Set([
        "https://wflyer.com.br",
        "https://staging.wflyer.com.br",
      ]),
    });
    expect(
      readContactServerConfig({
        CONTACT_ALLOWED_ORIGINS: "https://wflyer.com.br/path",
        CONTACT_FROM_EMAIL: "site@wflyer.com.br",
        CONTACT_RECIPIENT_EMAIL: "davi.benucci@wflyer.com.br",
        RESEND_API_KEY: "re_test",
        TURNSTILE_SECRET_KEY: "turnstile_test",
      }),
    ).toBeNull();
    expect(readContactServerConfig({})).toBeNull();
  });

  it("accepts Turnstile only for the contact action and allowed hostname", async () => {
    const fetchImplementation = vi.fn().mockResolvedValue(
      Response.json({
        action: "contact",
        hostname: "wflyer.com.br",
        success: true,
      }),
    );

    await expect(
      verifyTurnstile("token-publico", config, fetchImplementation),
    ).resolves.toBe("valid");
    const requestInit = fetchImplementation.mock.calls.at(0)?.[1];
    expect(requestInit?.body).toEqual(expect.any(String));
    const body = JSON.parse(String(requestInit?.body));
    expect(body).toMatchObject({
      response: "token-publico",
      secret: "turnstile_test",
    });
    expect(body.idempotency_key).toEqual(expect.any(String));

    fetchImplementation.mockResolvedValueOnce(
      Response.json({
        action: "outro",
        hostname: "wflyer.com.br",
        success: true,
      }),
    );
    await expect(
      verifyTurnstile("token-publico", config, fetchImplementation),
    ).resolves.toBe("invalid");
  });

  it("fails Turnstile closed after its finite deadline", async () => {
    vi.useFakeTimers();
    const fetchImplementation = vi.fn(
      (_url: string | URL | Request, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(new DOMException("aborted", "AbortError"));
          });
        }),
    );
    const verification = verifyTurnstile(
      "token-publico",
      config,
      fetchImplementation,
    );

    await vi.advanceTimersByTimeAsync(5_000);
    await expect(verification).resolves.toBe("unavailable");
  });

  it("constructs one plain-text email with fixed routing and safe reply-to", async () => {
    const message = createContactEmail(payload, config);

    expect(message).toEqual(
      expect.objectContaining({
        from: "W_Flyer <site@wflyer.com.br>",
        replyTo: "visitante@example.com",
        subject: "[W_Flyer] Novo contato — Solução personalizada",
        to: ["davi.benucci@wflyer.com.br"],
      }),
    );
    expect(message).not.toHaveProperty("html");
    expect(message.text).toContain(payload.message);

    resendSend.mockResolvedValue({ data: { id: "mail-id" }, error: null });
    await expect(sendContactEmail(payload, config)).resolves.toBe(true);
    expect(resendSend).toHaveBeenCalledWith(
      message,
      expect.objectContaining({ idempotencyKey: expect.any(String) }),
    );

    resendSend.mockResolvedValue({ data: null, error: { message: "upstream" } });
    await expect(sendContactEmail(payload, config)).resolves.toBe(false);
  });
});
