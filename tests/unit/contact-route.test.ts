import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const providers = vi.hoisted(() => ({
  sendContactEmail: vi.fn(),
  verifyTurnstile: vi.fn(),
}));

vi.mock("@/lib/contact", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/contact")>();
  return {
    ...original,
    sendContactEmail: providers.sendContactEmail,
    verifyTurnstile: providers.verifyTurnstile,
  };
});

import { POST } from "@/app/api/contact/route";
import { CONTACT_MAX_BODY_BYTES } from "@/lib/contact";

const validPayload = {
  company: "W_Flyer",
  email: "visitante@example.com",
  message: "Preciso conversar sobre um projeto digital sob medida.",
  name: "Pessoa Visitante",
  privacyConsent: true,
  projectType: "solucao-personalizada",
  submissionId: "11111111-1111-4111-8111-111111111111",
  turnstileToken: "token-publico",
  website: "",
};

function request(
  body: unknown = validPayload,
  headers: Record<string, string> = {},
) {
  return new Request("https://wflyer.com.br/api/contact", {
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      origin: "https://wflyer.com.br",
      ...headers,
    },
    method: "POST",
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.stubEnv("CONTACT_ALLOWED_ORIGINS", "https://wflyer.com.br");
    vi.stubEnv("CONTACT_FROM_EMAIL", "site@wflyer.com.br");
    vi.stubEnv("CONTACT_RECIPIENT_EMAIL", "davi.benucci@wflyer.com.br");
    vi.stubEnv("RESEND_API_KEY", "re_secret_value");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "turnstile_secret_value");
    providers.verifyTurnstile.mockResolvedValue("valid");
    providers.sendContactEmail.mockResolvedValue(true);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("delivers one valid request without caching the response", async () => {
    const response = await POST(request());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(response.headers.get("cache-control")).toBe("no-store, max-age=0");
    expect(providers.verifyTurnstile).toHaveBeenCalledOnce();
    expect(providers.sendContactEmail).toHaveBeenCalledOnce();
    expect(providers.sendContactEmail).toHaveBeenCalledWith(
      expect.objectContaining({ submissionId: validPayload.submissionId }),
      expect.any(Object),
    );
  });

  it.each([
    ["malformed JSON", "{", {}, 400],
    ["wrong media type", validPayload, { "content-type": "text/plain" }, 415],
    ["missing fields", { website: "" }, {}, 400],
    [
      "missing submission UUID",
      { ...validPayload, submissionId: undefined },
      {},
      400,
    ],
    [
      "invalid submission UUID",
      { ...validPayload, submissionId: "invalid" },
      {},
      400,
    ],
    ["unknown fields", { ...validPayload, role: "admin" }, {}, 400],
    ["honeypot", { ...validPayload, website: "https://spam.invalid" }, {}, 400],
    ["disallowed origin", validPayload, { origin: "https://evil.invalid" }, 403],
  ])("rejects %s generically", async (_label, body, headers, status) => {
    const response = await POST(
      request(body, headers as Record<string, string>),
    );

    expect(response.status).toBe(status);
    expect(await response.json()).toEqual({ code: "invalid_request", ok: false });
    expect(providers.sendContactEmail).not.toHaveBeenCalled();
  });

  it("rejects declared and streamed oversized bodies", async () => {
    const declared = await POST(
      request(validPayload, {
        "content-length": String(CONTACT_MAX_BODY_BYTES + 1),
      }),
    );
    const streamed = await POST(request("x".repeat(CONTACT_MAX_BODY_BYTES + 1)));

    expect(declared.status).toBe(413);
    expect(streamed.status).toBe(413);
    expect(providers.verifyTurnstile).not.toHaveBeenCalled();
  });

  it.each([
    ["invalid", 400, "verification_failed"],
    ["unavailable", 503, "service_unavailable"],
  ])("maps Turnstile %s safely", async (result, status, code) => {
    providers.verifyTurnstile.mockResolvedValueOnce(result);
    const response = await POST(request());

    expect(response.status).toBe(status);
    expect(await response.json()).toEqual({ code, ok: false });
    expect(providers.sendContactEmail).not.toHaveBeenCalled();
  });

  it("maps Resend and configuration failures without leaking sensitive input", async () => {
    providers.sendContactEmail.mockResolvedValueOnce(false);
    const providerResponse = await POST(request());
    const providerText = await providerResponse.text();

    expect(providerResponse.status).toBe(502);
    for (const secret of [
      validPayload.email,
      validPayload.message,
      validPayload.submissionId,
      validPayload.turnstileToken,
      "re_secret_value",
      "turnstile_secret_value",
    ]) {
      expect(providerText).not.toContain(secret);
    }

    vi.stubEnv("RESEND_API_KEY", "");
    const configurationResponse = await POST(request());
    expect(configurationResponse.status).toBe(503);
    expect(await configurationResponse.json()).toEqual({
      code: "service_unavailable",
      ok: false,
    });
  });
});
