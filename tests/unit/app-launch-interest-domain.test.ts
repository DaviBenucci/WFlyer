import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  APP_LAUNCH_INTEREST_MAX_BODY_BYTES,
  APP_LAUNCH_OPERATIONAL_RECIPIENT,
  appLaunchInterestPayloadSchema,
  claimLaunchInterestRegistration,
  consumeLaunchInterestRateLimit,
  createLaunchInterestAcknowledgmentEmail,
  createLaunchInterestOperationalEmail,
  resetLaunchInterestGuardsForTests,
  sendLaunchInterestAcknowledgmentEmail,
  sendLaunchInterestOperationalEmail,
  type LaunchInterestRegistration,
} from "@/lib/app-launch-interest";
import {
  readLimitedBody,
  verifyTurnstileAction,
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

const registration: LaunchInterestRegistration = {
  acknowledgmentSent: false,
  addressKey: "opaque-address-key",
  registered: false,
  requestId: "11111111-1111-4111-8111-111111111111",
  submittedAt: "2026-08-31T12:00:00.000Z",
};

describe("application launch-interest domain", () => {
  beforeEach(() => {
    resendSend.mockReset();
    resetLaunchInterestGuardsForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("accepts exactly four user fields and normalizes the e-mail address", () => {
    const result = appLaunchInterestPayloadSchema.safeParse({
      consent: true,
      email: "  Visitante@Example.COM  ",
      honeypot: "",
      turnstileToken: "token-publico",
    });

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe("visitante@example.com");
    expect(
      appLaunchInterestPayloadSchema.safeParse({
        consent: true,
        email: "visitante@example.com",
        honeypot: "",
        route: "attacker-controlled",
        turnstileToken: "token-publico",
      }).success,
    ).toBe(false);
    expect(
      appLaunchInterestPayloadSchema.safeParse({
        consent: false,
        email: "visitante@example.com",
        honeypot: "",
        turnstileToken: "token-publico",
      }).success,
    ).toBe(false);
    expect(
      appLaunchInterestPayloadSchema.safeParse({
        consent: true,
        email: "visitante@example.com",
        honeypot: "spam",
        turnstileToken: "token-publico",
      }).success,
    ).toBe(false);
  });

  it("enforces the 4 KiB streamed-body ceiling", async () => {
    const declared = new Request(
      "https://wflyer.com.br/api/app-launch-interest",
      {
        body: "{}",
        headers: {
          "content-length": String(APP_LAUNCH_INTEREST_MAX_BODY_BYTES + 1),
        },
        method: "POST",
      },
    );
    const streamed = new Request(
      "https://wflyer.com.br/api/app-launch-interest",
      {
        body: "x".repeat(APP_LAUNCH_INTEREST_MAX_BODY_BYTES + 1),
        method: "POST",
      },
    );

    await expect(
      readLimitedBody(declared, APP_LAUNCH_INTEREST_MAX_BODY_BYTES),
    ).resolves.toEqual({ ok: false, reason: "too_large" });
    await expect(
      readLimitedBody(streamed, APP_LAUNCH_INTEREST_MAX_BODY_BYTES),
    ).resolves.toEqual({ ok: false, reason: "too_large" });
  });

  it("binds Turnstile to its dedicated action and an allowed hostname", async () => {
    const fetchImplementation = vi.fn().mockResolvedValue(
      Response.json({
        action: "app-launch-interest",
        hostname: "wflyer.com.br",
        success: true,
      }),
    );

    await expect(
      verifyTurnstileAction(
        "token-publico",
        "app-launch-interest",
        config,
        fetchImplementation,
      ),
    ).resolves.toBe("valid");

    fetchImplementation.mockResolvedValueOnce(
      Response.json({
        action: "contact",
        hostname: "wflyer.com.br",
        success: true,
      }),
    );
    await expect(
      verifyTurnstileAction(
        "token-publico",
        "app-launch-interest",
        config,
        fetchImplementation,
      ),
    ).resolves.toBe("invalid");
  });

  it("builds fixed pt-BR HTML and text templates with the approved warm palette", () => {
    const operational = createLaunchInterestOperationalEmail(
      "visitante@example.com",
      registration,
      config,
    );
    const acknowledgment = createLaunchInterestAcknowledgmentEmail(
      "visitante@example.com",
      registration,
      config,
    );

    expect(operational.to).toEqual([APP_LAUNCH_OPERATIONAL_RECIPIENT]);
    expect(acknowledgment.to).toEqual(["visitante@example.com"]);
    for (const message of [operational, acknowledgment]) {
      expect(message.from).toBe("W_Flyer <site@wflyer.com.br>");
      expect(message.html).toContain('<html lang="pt-BR">');
      expect(message.html).toContain('role="presentation"');
      for (const color of ["#12100f", "#f4ecdf", "#c1b9ad", "#e79271"]) {
        expect(message.html).toContain(color);
      }
      expect(message.text).not.toBe("");
      expect(message.html).not.toMatch(/<img|tracking[-_ ]?pixel/iu);
    }
    expect(operational.text).toContain("Não adicionar a listas de marketing");
    expect(acknowledgment.text).toContain("apenas um aviso");
  });

  it("uses stable, purpose-specific provider idempotency keys", async () => {
    resendSend.mockResolvedValue({ data: { id: "mail-id" }, error: null });

    await expect(
      sendLaunchInterestOperationalEmail(
        "visitante@example.com",
        registration,
        config,
      ),
    ).resolves.toBe(true);
    await expect(
      sendLaunchInterestAcknowledgmentEmail(
        "visitante@example.com",
        registration,
        config,
      ),
    ).resolves.toBe(true);

    expect(resendSend.mock.calls[0]?.[1]).toEqual({
      idempotencyKey: `app-launch-interest/operational/${registration.requestId}`,
    });
    expect(resendSend.mock.calls[1]?.[1]).toEqual({
      idempotencyKey: `app-launch-interest/ack/${registration.requestId}`,
    });
  });

  it("reuses one opaque logical registration and applies e-mail and client limits", () => {
    const first = claimLaunchInterestRegistration(
      "visitante@example.com",
      Date.parse("2026-08-31T12:00:00.000Z"),
    );
    const retry = claimLaunchInterestRegistration(
      "visitante@example.com",
      Date.parse("2026-08-31T12:01:00.000Z"),
    );
    const request = new Request(
      "https://wflyer.com.br/api/app-launch-interest",
      { headers: { "x-forwarded-for": "192.0.2.10" } },
    );

    expect(retry).toBe(first);
    expect(first.addressKey).not.toContain("visitante@example.com");
    expect(
      consumeLaunchInterestRateLimit(
        request,
        "visitante@example.com",
        Date.parse("2026-08-31T12:02:00.000Z"),
      ).allowed,
    ).toBe(true);
    expect(
      consumeLaunchInterestRateLimit(
        request,
        "visitante@example.com",
        Date.parse("2026-08-31T12:03:00.000Z"),
      ).allowed,
    ).toBe(true);
    expect(
      consumeLaunchInterestRateLimit(
        request,
        "visitante@example.com",
        Date.parse("2026-08-31T12:04:00.000Z"),
      ).allowed,
    ).toBe(true);
    expect(
      consumeLaunchInterestRateLimit(
        request,
        "visitante@example.com",
        Date.parse("2026-08-31T12:05:00.000Z"),
      ).allowed,
    ).toBe(false);
  });
});
