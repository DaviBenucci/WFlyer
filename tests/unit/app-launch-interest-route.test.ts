import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const providers = vi.hoisted(() => ({
  sendAcknowledgment: vi.fn(),
  sendOperational: vi.fn(),
  verifyTurnstileAction: vi.fn(),
}));

vi.mock("@/lib/app-launch-interest", async (importOriginal) => {
  const original =
    await importOriginal<typeof import("@/lib/app-launch-interest")>();
  return {
    ...original,
    sendLaunchInterestAcknowledgmentEmail: providers.sendAcknowledgment,
    sendLaunchInterestOperationalEmail: providers.sendOperational,
  };
});

vi.mock("@/lib/contact", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/contact")>();
  return {
    ...original,
    verifyTurnstileAction: providers.verifyTurnstileAction,
  };
});

import { POST } from "@/app/api/app-launch-interest/route";
import {
  APP_LAUNCH_INTEREST_MAX_BODY_BYTES,
  resetLaunchInterestGuardsForTests,
} from "@/lib/app-launch-interest";

const validPayload = {
  consent: true,
  email: "visitante@example.com",
  honeypot: "",
  turnstileToken: "token-publico",
};

function request(
  body: unknown = validPayload,
  headers: Record<string, string> = {},
): Request {
  return new Request("https://wflyer.com.br/api/app-launch-interest", {
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      host: "wflyer.com.br",
      origin: "https://wflyer.com.br",
      "x-forwarded-for": "192.0.2.20",
      ...headers,
    },
    method: "POST",
  });
}

describe("POST /api/app-launch-interest", () => {
  beforeEach(() => {
    resetLaunchInterestGuardsForTests();
    vi.stubEnv("CONTACT_ALLOWED_ORIGINS", "https://wflyer.com.br");
    vi.stubEnv("CONTACT_FROM_EMAIL", "site@wflyer.com.br");
    vi.stubEnv("CONTACT_RECIPIENT_EMAIL", "davi.benucci@wflyer.com.br");
    vi.stubEnv("RESEND_API_KEY", "re_secret_value");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "turnstile_secret_value");
    providers.verifyTurnstileAction.mockReset().mockResolvedValue("valid");
    providers.sendOperational.mockReset().mockResolvedValue(true);
    providers.sendAcknowledgment.mockReset().mockResolvedValue(true);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("registers operationally before acknowledging and emits a request ID", async () => {
    const order: string[] = [];
    providers.sendOperational.mockImplementation(async () => {
      order.push("operational");
      return true;
    });
    providers.sendAcknowledgment.mockImplementation(async () => {
      order.push("acknowledgment");
      return true;
    });

    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store, max-age=0");
    expect(response.headers.get("x-request-id")).toMatch(
      /^[0-9a-f]{8}-[0-9a-f-]{27}$/u,
    );
    await expect(response.json()).resolves.toEqual({
      acknowledgment: "sent",
      ok: true,
      registered: true,
    });
    expect(order).toEqual(["operational", "acknowledgment"]);
    expect(providers.verifyTurnstileAction).toHaveBeenCalledWith(
      validPayload.turnstileToken,
      "app-launch-interest",
      expect.any(Object),
    );
  });

  it("preserves registration when acknowledgment fails and retries only the acknowledgment", async () => {
    providers.sendAcknowledgment
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    const first = await POST(request());
    const firstPayload = await first.json();
    const retry = await POST(request());

    expect(first.status).toBe(200);
    expect(firstPayload).toEqual({
      acknowledgment: "pending",
      ok: true,
      registered: true,
    });
    expect(retry.status).toBe(200);
    await expect(retry.json()).resolves.toEqual({
      acknowledgment: "sent",
      ok: true,
      registered: true,
    });
    expect(providers.sendOperational).toHaveBeenCalledOnce();
    expect(providers.sendAcknowledgment).toHaveBeenCalledTimes(2);
  });

  it("retries an uncertain operational delivery with the same logical record", async () => {
    providers.sendOperational
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    const first = await POST(request());
    const retry = await POST(request());

    expect(first.status).toBe(502);
    await expect(first.json()).resolves.toEqual({
      code: "delivery_failed",
      ok: false,
    });
    expect(retry.status).toBe(200);
    const firstRegistration = providers.sendOperational.mock.calls[0]?.[1];
    const retryRegistration = providers.sendOperational.mock.calls[1]?.[1];
    expect(retryRegistration.requestId).toBe(firstRegistration.requestId);
    expect(retryRegistration.submittedAt).toBe(firstRegistration.submittedAt);
  });

  it.each([
    ["malformed JSON", "{", {}, 400],
    ["wrong media type", validPayload, { "content-type": "text/plain" }, 415],
    ["missing fields", { honeypot: "" }, {}, 400],
    ["unknown field", { ...validPayload, route: "evil" }, {}, 400],
    ["honeypot", { ...validPayload, honeypot: "spam" }, {}, 400],
    ["origin", validPayload, { origin: "https://evil.invalid" }, 403],
    ["host", validPayload, { host: "evil.invalid" }, 403],
  ])("rejects invalid %s requests generically", async (_label, body, headers, status) => {
    const response = await POST(request(body, headers as Record<string, string>));

    expect(response.status).toBe(status);
    expect(await response.json()).toEqual({ code: "invalid_request", ok: false });
    expect(response.headers.get("x-request-id")).toEqual(expect.any(String));
    expect(providers.sendOperational).not.toHaveBeenCalled();
  });

  it("rejects declared and streamed payloads beyond 4 KiB", async () => {
    const declared = await POST(
      request(validPayload, {
        "content-length": String(APP_LAUNCH_INTEREST_MAX_BODY_BYTES + 1),
      }),
    );
    const streamed = await POST(
      request("x".repeat(APP_LAUNCH_INTEREST_MAX_BODY_BYTES + 1)),
    );

    expect(declared.status).toBe(413);
    expect(streamed.status).toBe(413);
    expect(providers.verifyTurnstileAction).not.toHaveBeenCalled();
  });

  it.each([
    ["invalid", 400],
    ["unavailable", 503],
  ])("fails closed when Turnstile is %s", async (result, status) => {
    providers.verifyTurnstileAction.mockResolvedValueOnce(result);
    const response = await POST(request());

    expect(response.status).toBe(status);
    expect(await response.json()).toEqual({
      code: "turnstile_failed",
      ok: false,
    });
    expect(providers.sendOperational).not.toHaveBeenCalled();
  });

  it("rate-limits repeated attempts without leaking the submitted address", async () => {
    await POST(request());
    await POST(request());
    await POST(request());
    const response = await POST(request());
    const text = await response.text();

    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toMatch(/^\d+$/u);
    expect(text).toBe('{"code":"rate_limited","ok":false}');
    expect(text).not.toContain(validPayload.email);
  });

  it("fails closed when server configuration is unavailable", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const response = await POST(request());

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      code: "delivery_failed",
      ok: false,
    });
  });
});
