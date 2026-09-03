"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";

import styles from "./application-launch-interest-form.module.css";

export type ApplicationLaunchInterestUiState =
  | "CONSENT_REQUIRED"
  | "DELIVERY_FAILED"
  | "IDLE"
  | "INVALID_EMAIL"
  | "RATE_LIMITED"
  | "SUBMITTING"
  | "SUCCESS"
  | "TURNSTILE_FAILED"
  | "VALIDATING"
  | "VERIFYING_TURNSTILE";

const stateMessages: Record<ApplicationLaunchInterestUiState, string> = {
  CONSENT_REQUIRED:
    "Confirme o consentimento para registrar o interesse no lançamento.",
  DELIVERY_FAILED:
    "Não foi possível registrar o interesse agora. Tente novamente em alguns instantes.",
  IDLE: "Você receberá somente o aviso de disponibilidade da aplicação.",
  INVALID_EMAIL: "Informe um endereço de e-mail válido.",
  RATE_LIMITED:
    "Muitas tentativas foram feitas. Aguarde alguns minutos antes de tentar novamente.",
  SUBMITTING: "Registrando seu interesse com segurança…",
  SUCCESS: "Cadastro realizado. Enviaremos apenas o aviso de lançamento.",
  TURNSTILE_FAILED:
    "A verificação de segurança não foi concluída. Tente novamente.",
  VALIDATING: "Validando as informações…",
  VERIFYING_TURNSTILE: "Conclua a verificação de segurança para continuar.",
};

interface ApplicationLaunchInterestFormProps {
  readonly siteKey: string;
}

function isFailureState(state: ApplicationLaunchInterestUiState): boolean {
  return (
    state === "CONSENT_REQUIRED" ||
    state === "DELIVERY_FAILED" ||
    state === "INVALID_EMAIL" ||
    state === "RATE_LIMITED" ||
    state === "TURNSTILE_FAILED"
  );
}

export function ApplicationLaunchInterestForm({
  siteKey,
}: ApplicationLaunchInterestFormProps) {
  const statusRef = useRef<HTMLParagraphElement>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [acknowledgmentPending, setAcknowledgmentPending] = useState(false);
  const [state, setState] = useState<ApplicationLaunchInterestUiState>(
    siteKey ? "IDLE" : "TURNSTILE_FAILED",
  );
  const [token, setToken] = useState("");

  const focusStatus = useCallback(() => {
    requestAnimationFrame(() => statusRef.current?.focus());
  }, []);

  const resetVerification = useCallback(() => {
    setToken("");
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, []);

  const renderTurnstile = useCallback(() => {
    if (
      !siteKey ||
      !window.turnstile ||
      !turnstileContainerRef.current ||
      widgetIdRef.current
    ) {
      return;
    }

    try {
      setState("VERIFYING_TURNSTILE");
      widgetIdRef.current = window.turnstile.render(
        turnstileContainerRef.current,
        {
          action: "app-launch-interest",
          appearance: "interaction-only",
          callback: (nextToken) => {
            setToken(nextToken);
            setState("IDLE");
          },
          "error-callback": () => {
            setToken("");
            setState("TURNSTILE_FAILED");
          },
          "expired-callback": () => {
            setToken("");
            setState("VERIFYING_TURNSTILE");
          },
          sitekey: siteKey,
          size: "flexible",
          theme: "auto",
        },
      );
    } catch {
      setState("TURNSTILE_FAILED");
    }
  }, [siteKey]);

  useEffect(() => {
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "SUBMITTING") return;

    const form = event.currentTarget;
    const emailInput = form.elements.namedItem("email");
    const consentInput = form.elements.namedItem("consent");
    if (!(emailInput instanceof HTMLInputElement)) return;
    if (!(consentInput instanceof HTMLInputElement)) return;

    setAcknowledgmentPending(false);
    setState("VALIDATING");
    await Promise.resolve();

    if (!emailInput.validity.valid) {
      setState("INVALID_EMAIL");
      emailInput.focus();
      focusStatus();
      return;
    }
    if (!consentInput.checked) {
      setState("CONSENT_REQUIRED");
      consentInput.focus();
      focusStatus();
      return;
    }
    if (!token) {
      setState("TURNSTILE_FAILED");
      focusStatus();
      return;
    }

    const formData = new FormData(form);
    setState("SUBMITTING");

    try {
      const response = await fetch("/api/app-launch-interest", {
        body: JSON.stringify({
          consent: true,
          email: String(formData.get("email") ?? ""),
          honeypot: String(formData.get("honeypot") ?? ""),
          turnstileToken: token,
        }),
        cache: "no-store",
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      const result = (await response.json().catch(() => null)) as
        | { readonly acknowledgment?: unknown; readonly code?: unknown }
        | null;

      if (!response.ok) {
        setState(
          result?.code === "rate_limited"
            ? "RATE_LIMITED"
            : result?.code === "turnstile_failed"
              ? "TURNSTILE_FAILED"
              : "DELIVERY_FAILED",
        );
        focusStatus();
        resetVerification();
        return;
      }

      form.reset();
      setAcknowledgmentPending(result?.acknowledgment === "pending");
      setState("SUCCESS");
      focusStatus();
      resetVerification();
    } catch {
      setState("DELIVERY_FAILED");
      focusStatus();
      resetVerification();
    }
  };

  const message =
    state === "SUCCESS" && acknowledgmentPending
      ? "Cadastro realizado. A confirmação por e-mail não pôde ser enviada agora, mas seu registro foi preservado."
      : stateMessages[state];

  return (
    <form
      aria-busy={state === "SUBMITTING"}
      aria-describedby="app-launch-interest-status"
      aria-label="Aviso de lançamento da aplicação"
      className={styles.form}
      data-app-launch-interest-state={state}
      noValidate
      onInput={() => {
        if (isFailureState(state)) setState(token ? "IDLE" : "VERIFYING_TURNSTILE");
      }}
      onSubmit={handleSubmit}
    >
      <fieldset disabled={state === "SUBMITTING"}>
        <legend>Receber o aviso de lançamento</legend>
        <label>
          E-mail
          <input
            autoComplete="email"
            maxLength={254}
            name="email"
            placeholder="voce@exemplo.com.br"
            required
            type="email"
          />
        </label>
        <label className={styles.consent}>
          <input name="consent" type="checkbox" />
          <span>
            Li a <a href="/politica-de-privacidade">Política de Privacidade</a>{" "}
            e concordo com o uso do meu e-mail somente para este aviso.
          </span>
        </label>
        <label aria-hidden="true" className={styles.honeypot}>
          Não preencha este campo
          <input autoComplete="off" name="honeypot" tabIndex={-1} type="text" />
        </label>

        {siteKey ? (
          <div className={styles.verification}>
            <Script
              id="cloudflare-turnstile-app-launch-interest"
              onError={() => setState("TURNSTILE_FAILED")}
              onReady={renderTurnstile}
              src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
              strategy="afterInteractive"
            />
            <div
              className={styles.turnstile}
              data-app-launch-turnstile=""
              ref={turnstileContainerRef}
            />
          </div>
        ) : null}

        <button className={styles.submit} type="submit">
          {state === "SUBMITTING" ? "Registrando…" : "Quero receber o aviso"}
        </button>
      </fieldset>
      <p
        aria-live="polite"
        className={styles.status}
        data-app-launch-interest-status={state}
        id="app-launch-interest-status"
        ref={statusRef}
        role={isFailureState(state) ? "alert" : "status"}
        tabIndex={-1}
      >
        {message}
      </p>
    </form>
  );
}
