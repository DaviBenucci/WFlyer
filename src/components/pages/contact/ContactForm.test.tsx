import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect, type ComponentProps } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ContactForm } from "./ContactForm";

let search = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useSearchParams: () => search,
}));

vi.mock("next/script", () => ({
  default: function MockScript({
    onReady,
  }: ComponentProps<"script"> & { onReady?: () => void }) {
    useEffect(() => {
      onReady?.();
    }, [onReady]);
    return null;
  },
}));

async function fillValidContactFields(
  user: ReturnType<typeof userEvent.setup>,
  form: HTMLElement,
) {
  const name = within(form).getByLabelText("Nome");
  const email = within(form).getByLabelText("E-mail");
  const message = within(form).getByLabelText("Mensagem");
  const consent = within(form).getByLabelText(/Li a Política/u);
  await user.clear(name);
  await user.type(name, "Pessoa Visitante");
  await user.clear(email);
  await user.type(email, "visitante@example.com");
  await user.selectOptions(
    within(form).getByLabelText("Tipo de projeto"),
    "solucao-personalizada",
  );
  await user.clear(message);
  await user.type(
    message,
    "Preciso conversar sobre um projeto digital sob medida.",
  );
  if (!(consent as HTMLInputElement).checked) await user.click(consent);
}

describe("ContactForm", () => {
  const renderTurnstile = vi.fn();
  const resetTurnstile = vi.fn();
  const removeTurnstile = vi.fn();
  let verificationCallback: (token: string) => void;

  beforeEach(() => {
    search = new URLSearchParams();
    renderTurnstile.mockImplementation((_container, options) => {
      verificationCallback = options.callback;
      return "widget-contact";
    });
    window.turnstile = {
      remove: removeTurnstile,
      render: renderTurnstile,
      reset: resetTurnstile,
    };
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("preselects only a documented query value", () => {
    search = new URLSearchParams("tipo=site-institucional");
    const { unmount } = render(<ContactForm siteKey="site-key" />);

    expect(screen.getByLabelText("Tipo de projeto")).toHaveValue(
      "site-institucional",
    );
    expect(renderTurnstile).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({
        action: "contact",
        appearance: "interaction-only",
        sitekey: "site-key",
        size: "flexible",
      }),
    );

    unmount();
    expect(removeTurnstile).toHaveBeenCalledWith("widget-contact");
  });

  it("keeps native constraints and submits only after verification", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.mocked(fetch).mockResolvedValue(
      Response.json({ ok: true }),
    );
    render(<ContactForm siteKey="site-key" />);
    const form = screen.getByRole("form", { name: "Formulário de contato" });
    const submit = within(form).getByRole("button", {
      name: "Enviar mensagem",
    });

    expect(submit).toBeDisabled();
    expect(within(form).getByLabelText("Nome")).toBeRequired();
    expect(within(form).getByLabelText("Mensagem")).toHaveAttribute(
      "minlength",
      "20",
    );

    await user.type(within(form).getByLabelText("Nome"), "Pessoa Visitante");
    await user.type(
      within(form).getByLabelText("E-mail"),
      "visitante@example.com",
    );
    await user.selectOptions(
      within(form).getByLabelText("Tipo de projeto"),
      "solucao-personalizada",
    );
    await user.type(
      within(form).getByLabelText("Mensagem"),
      "Preciso conversar sobre um projeto digital sob medida.",
    );
    await user.click(within(form).getByLabelText(/Li a Política/u));
    await act(() => verificationCallback("turnstile-token"));

    expect(submit).toBeEnabled();
    await user.click(submit);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const init = fetchMock.mock.calls[0]?.[1];
    expect(fetchMock.mock.calls[0]?.[0]).toBe("/api/contact");
    expect(JSON.parse(String(init?.body))).toMatchObject({
      email: "visitante@example.com",
      privacyConsent: true,
      projectType: "solucao-personalizada",
      submissionId: expect.stringMatching(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu,
      ),
      turnstileToken: "turnstile-token",
      website: "",
    });
    expect(await screen.findByText(/Mensagem enviada/u)).toBeVisible();
    expect(resetTurnstile).toHaveBeenCalledWith("widget-contact");
    expect(submit).toBeDisabled();
  });

  it("recovers from a generic provider error and resets verification", async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValue(
      Response.json(
        { code: "service_unavailable", ok: false },
        { status: 503 },
      ),
    );
    render(<ContactForm siteKey="site-key" />);
    const form = screen.getByRole("form", { name: "Formulário de contato" });

    await user.type(within(form).getByLabelText("Nome"), "Pessoa Visitante");
    await user.type(
      within(form).getByLabelText("E-mail"),
      "visitante@example.com",
    );
    await user.selectOptions(
      within(form).getByLabelText("Tipo de projeto"),
      "solucao-personalizada",
    );
    await user.type(
      within(form).getByLabelText("Mensagem"),
      "Preciso conversar sobre um projeto digital sob medida.",
    );
    await user.click(within(form).getByLabelText(/Li a Política/u));
    await act(() => verificationCallback("turnstile-token"));
    await user.click(
      within(form).getByRole("button", { name: "Enviar mensagem" }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /Não foi possível enviar agora/u,
    );
    expect(resetTurnstile).toHaveBeenCalledWith("widget-contact");
    expect(within(form).getByLabelText("Nome")).toHaveValue("Pessoa Visitante");
  });

  it("keeps, rotates, and clears its private logical-submission identity", async () => {
    const firstSubmissionId = "11111111-1111-4111-8111-111111111111";
    const editedSubmissionId = "22222222-2222-4222-8222-222222222222";
    const postSuccessSubmissionId = "33333333-3333-4333-8333-333333333333";
    const randomUuid = vi
      .spyOn(globalThis.crypto, "randomUUID")
      .mockReturnValueOnce(firstSubmissionId)
      .mockReturnValueOnce(editedSubmissionId)
      .mockReturnValueOnce(postSuccessSubmissionId);
    const unavailable = Response.json(
      { code: "service_unavailable", ok: false },
      { status: 503 },
    );
    const fetchMock = vi
      .mocked(fetch)
      .mockResolvedValueOnce(unavailable)
      .mockResolvedValueOnce(
        Response.json(
          { code: "service_unavailable", ok: false },
          { status: 503 },
        ),
      )
      .mockResolvedValueOnce(Response.json({ ok: true }))
      .mockResolvedValueOnce(Response.json({ ok: true }));
    const user = userEvent.setup();

    render(<ContactForm siteKey="site-key" />);
    const form = screen.getByRole("form", { name: "Formulário de contato" });
    const submit = within(form).getByRole("button", {
      name: "Enviar mensagem",
    });
    expect(form.querySelector('[name="submissionId"]')).toBeNull();

    await fillValidContactFields(user, form);
    await act(() => verificationCallback("turnstile-token-1"));
    await user.click(submit);
    await waitFor(() =>
      expect(form).toHaveAttribute("data-contact-form", "error"),
    );

    await act(() => verificationCallback("turnstile-token-2"));
    await user.click(submit);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(form).toHaveAttribute("data-contact-form", "error"),
    );

    await user.type(
      within(form).getByLabelText("Mensagem"),
      " Agora com um novo requisito.",
    );
    expect(form).toHaveAttribute("data-contact-form", "idle");
    await act(() => verificationCallback("turnstile-token-3"));
    await user.click(submit);
    await waitFor(() =>
      expect(form).toHaveAttribute("data-contact-form", "success"),
    );

    const postSuccessUser = userEvent.setup();
    await fillValidContactFields(postSuccessUser, form);
    expect(within(form).getByLabelText("Nome")).toHaveValue("Pessoa Visitante");
    expect(within(form).getByLabelText("Tipo de projeto")).toHaveValue(
      "solucao-personalizada",
    );
    expect(within(form).getByLabelText(/Li a Política/u)).toBeChecked();
    await act(() => verificationCallback("turnstile-token-4"));
    await postSuccessUser.click(submit);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(4));

    const submittedIds = fetchMock.mock.calls.map(([, init]) =>
      String(JSON.parse(String(init?.body)).submissionId),
    );
    expect(submittedIds).toEqual([
      firstSubmissionId,
      firstSubmissionId,
      editedSubmissionId,
      postSuccessSubmissionId,
    ]);
    expect(randomUuid).toHaveBeenCalledTimes(3);
    expect(form.querySelector('[name="submissionId"]')).toBeNull();
    expect(form).not.toHaveTextContent(firstSubmissionId);
  });

  it("fails closed but leaves the official contact alternative visible", () => {
    render(<ContactForm siteKey="" />);

    expect(
      screen.getByText(/verificação de segurança está indisponível/u),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Enviar mensagem" }),
    ).toBeDisabled();
    expect(renderTurnstile).not.toHaveBeenCalled();
  });

  it("fails closed when the client verification script never initializes", async () => {
    vi.useFakeTimers();
    delete window.turnstile;
    render(<ContactForm siteKey="site-key" />);

    await act(() => vi.advanceTimersByTimeAsync(8_000));
    expect(
      screen.getByText(/verificação de segurança está indisponível/u),
    ).toBeVisible();
  });
});
