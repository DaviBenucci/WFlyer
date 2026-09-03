import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApplicationLaunchInterestForm } from "./ApplicationLaunchInterestForm";

vi.mock("next/script", () => ({
  default: ({ onReady }: { readonly onReady?: () => void }) => (
    <button data-testid="launch-turnstile-script" onClick={onReady} type="button">
      Load verification
    </button>
  ),
}));

let verificationCallback: (token: string) => void;
const renderTurnstile = vi.fn();
const resetTurnstile = vi.fn();
const removeTurnstile = vi.fn();

function installTurnstile() {
  renderTurnstile.mockImplementation((_container, options) => {
    verificationCallback = options.callback;
    return "widget-launch";
  });
  window.turnstile = {
    remove: removeTurnstile,
    render: renderTurnstile,
    reset: resetTurnstile,
  };
}

async function verify() {
  await userEvent.click(screen.getByTestId("launch-turnstile-script"));
  await act(() => verificationCallback("turnstile-token"));
}

async function fillValidForm() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("E-mail"), "visitante@example.com");
  await user.click(screen.getByRole("checkbox"));
  return user;
}

describe("ApplicationLaunchInterestForm", () => {
  beforeEach(() => {
    renderTurnstile.mockReset();
    resetTurnstile.mockReset();
    removeTurnstile.mockReset();
    installTurnstile();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete window.turnstile;
  });

  it("binds the widget to the launch-interest action and owns cleanup", async () => {
    const { unmount } = render(
      <ApplicationLaunchInterestForm siteKey="site-key" />,
    );

    expect(screen.getByRole("form")).toHaveAttribute(
      "data-app-launch-interest-state",
      "IDLE",
    );
    await userEvent.click(screen.getByTestId("launch-turnstile-script"));
    expect(renderTurnstile).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({
        action: "app-launch-interest",
        appearance: "interaction-only",
        sitekey: "site-key",
        size: "flexible",
      }),
    );
    expect(screen.getByRole("form")).toHaveAttribute(
      "data-app-launch-interest-state",
      "VERIFYING_TURNSTILE",
    );

    await act(() => verificationCallback("turnstile-token"));
    expect(screen.getByRole("form")).toHaveAttribute(
      "data-app-launch-interest-state",
      "IDLE",
    );
    unmount();
    expect(removeTurnstile).toHaveBeenCalledWith("widget-launch");
  });

  it("exposes distinct invalid-email and consent-required states", async () => {
    const user = userEvent.setup();
    render(<ApplicationLaunchInterestForm siteKey="site-key" />);
    await verify();

    await user.type(screen.getByLabelText("E-mail"), "endereco-invalido");
    await user.click(screen.getByRole("button", { name: "Quero receber o aviso" }));
    expect(screen.getByRole("form")).toHaveAttribute(
      "data-app-launch-interest-state",
      "INVALID_EMAIL",
    );

    await user.clear(screen.getByLabelText("E-mail"));
    await user.type(screen.getByLabelText("E-mail"), "visitante@example.com");
    await user.click(screen.getByRole("button", { name: "Quero receber o aviso" }));
    expect(screen.getByRole("form")).toHaveAttribute(
      "data-app-launch-interest-state",
      "CONSENT_REQUIRED",
    );
  });

  it("submits only the exact four-field contract and reports full success", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({ acknowledgment: "sent", ok: true, registered: true }),
    );
    vi.stubGlobal("fetch", fetchMock);
    render(<ApplicationLaunchInterestForm siteKey="site-key" />);
    await verify();
    const user = await fillValidForm();

    await user.click(screen.getByRole("button", { name: "Quero receber o aviso" }));
    await waitFor(() =>
      expect(screen.getByRole("form")).toHaveAttribute(
        "data-app-launch-interest-state",
        "SUCCESS",
      ),
    );

    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(JSON.parse(String(init.body))).toEqual({
      consent: true,
      email: "visitante@example.com",
      honeypot: "",
      turnstileToken: "turnstile-token",
    });
    expect(screen.getByRole("status")).toHaveTextContent(
      "Enviaremos apenas o aviso de lançamento",
    );
    expect(resetTurnstile).toHaveBeenCalledWith("widget-launch");
  });

  it("keeps registration success explicit when acknowledgment is pending", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json({
          acknowledgment: "pending",
          ok: true,
          registered: true,
        }),
      ),
    );
    render(<ApplicationLaunchInterestForm siteKey="site-key" />);
    await verify();
    const user = await fillValidForm();
    await user.click(screen.getByRole("button", { name: "Quero receber o aviso" }));

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "seu registro foi preservado",
      ),
    );
    expect(screen.getByRole("form")).toHaveAttribute(
      "data-app-launch-interest-state",
      "SUCCESS",
    );
  });

  it.each([
    [429, "rate_limited", "RATE_LIMITED"],
    [503, "turnstile_failed", "TURNSTILE_FAILED"],
    [502, "delivery_failed", "DELIVERY_FAILED"],
  ] as const)("maps HTTP %s/%s to %s", async (status, code, expectedState) => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ code, ok: false }, { status })),
    );
    render(<ApplicationLaunchInterestForm siteKey="site-key" />);
    await verify();
    const user = await fillValidForm();
    await user.click(screen.getByRole("button", { name: "Quero receber o aviso" }));

    await waitFor(() =>
      expect(screen.getByRole("form")).toHaveAttribute(
        "data-app-launch-interest-state",
        expectedState,
      ),
    );
  });

  it("fails closed without a public site key", async () => {
    render(<ApplicationLaunchInterestForm siteKey="" />);

    expect(screen.queryByTestId("launch-turnstile-script")).not.toBeInTheDocument();
    expect(screen.getByRole("form")).toHaveAttribute(
      "data-app-launch-interest-state",
      "TURNSTILE_FAILED",
    );
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() =>
      expect(screen.getByRole("form")).toHaveAttribute(
        "data-app-launch-interest-state",
        "INVALID_EMAIL",
      ),
    );
  });
});
