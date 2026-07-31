"use client";

import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";

import {
  contactProjectTypes,
  isContactProjectType,
} from "@/content/site-content";

import styles from "./contact-form.module.css";

type SubmissionState =
  | "error"
  | "idle"
  | "submitting"
  | "success"
  | "validation-error";
type VerificationState =
  | "error"
  | "loading"
  | "ready"
  | "unavailable"
  | "verified";

interface TurnstileOptions {
  readonly action: string;
  readonly appearance: "interaction-only";
  readonly callback: (token: string) => void;
  readonly "error-callback": () => void;
  readonly "expired-callback": () => void;
  readonly sitekey: string;
  readonly size: "flexible";
  readonly theme: "auto";
}

interface TurnstileApi {
  remove(widgetId: string): void;
  render(container: HTMLElement, options: TurnstileOptions): string;
  reset(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const messages: Record<SubmissionState, string> = {
  error:
    "Não foi possível enviar agora. Revise os campos ou tente novamente em alguns instantes.",
  idle:
    "Os dados serão usados somente para responder ao contato. Nenhuma cópia é armazenada pelo site.",
  submitting: "Enviando a mensagem com segurança…",
  success: "Mensagem enviada. Obrigado pelo contexto — o retorno será feito por e-mail.",
  "validation-error":
    "Revise os campos destacados e complete todas as informações obrigatórias.",
};

export function ContactFormFallback() {
  return (
    <div aria-busy="true" className={styles.form} data-contact-form="loading">
      <p className={styles.loading}>Preparando o formulário seguro…</p>
    </div>
  );
}

export function ContactForm({ siteKey }: { readonly siteKey: string }) {
  const searchParams = useSearchParams();
  const requestedType = searchParams.get("tipo");
  const selectedType = isContactProjectType(requestedType) ? requestedType : "";
  const statusRef = useRef<HTMLParagraphElement>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [submission, setSubmission] = useState<SubmissionState>("idle");
  const [token, setToken] = useState("");
  const [verification, setVerification] = useState<VerificationState>(
    siteKey ? "loading" : "unavailable",
  );

  const resetVerification = useCallback((): void => {
    setToken("");
    setVerification(siteKey ? "ready" : "unavailable");
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, [siteKey]);

  const focusStatus = (): void => {
    statusRef.current?.focus();
  };

  const renderTurnstile = useCallback((): void => {
    if (
      !siteKey ||
      !window.turnstile ||
      !turnstileContainerRef.current ||
      widgetIdRef.current
    ) {
      return;
    }

    try {
      widgetIdRef.current = window.turnstile.render(
        turnstileContainerRef.current,
        {
          action: "contact",
          appearance: "interaction-only",
          callback: (nextToken) => {
            setToken(nextToken);
            setVerification("verified");
          },
          "error-callback": () => {
            setToken("");
            setVerification("error");
          },
          "expired-callback": () => {
            setToken("");
            setVerification("ready");
          },
          sitekey: siteKey,
          size: "flexible",
          theme: "auto",
        },
      );
      setVerification("ready");
    } catch {
      setVerification("unavailable");
    }
  }, [siteKey]);

  useEffect(() => {
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [renderTurnstile]);

  useEffect(() => {
    if (!siteKey || verification !== "loading") return;
    const timeoutId = window.setTimeout(() => {
      if (!widgetIdRef.current) setVerification("unavailable");
    }, 8_000);
    return () => window.clearTimeout(timeoutId);
  }, [siteKey, verification]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || submission === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmission("submitting");

    try {
      const response = await fetch("/api/contact", {
        body: JSON.stringify({
          company: String(data.get("company") ?? ""),
          email: String(data.get("email") ?? ""),
          message: String(data.get("message") ?? ""),
          name: String(data.get("name") ?? ""),
          privacyConsent: data.get("privacyConsent") === "on",
          projectType: String(data.get("projectType") ?? ""),
          turnstileToken: token,
          website: String(data.get("website") ?? ""),
        }),
        cache: "no-store",
        headers: { "content-type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        setSubmission("error");
        focusStatus();
        resetVerification();
        return;
      }

      form.reset();
      setSubmission("success");
      focusStatus();
      resetVerification();
    } catch {
      setSubmission("error");
      focusStatus();
      resetVerification();
    }
  };

  const verificationMessage =
    verification === "unavailable"
      ? "A verificação de segurança está indisponível. Use o e-mail oficial ou tente mais tarde."
      : verification === "error"
        ? "A verificação de segurança falhou. Tente novamente."
        : verification === "verified"
          ? "Verificação de segurança concluída."
          : verification === "loading"
            ? "Carregando a verificação de segurança…"
            : "Conclua a verificação de segurança para habilitar o envio.";

  return (
    <form
      aria-busy={submission === "submitting"}
      aria-describedby="contact-form-status contact-verification-status"
      aria-label="Formulário de contato"
      className={styles.form}
      data-contact-form={submission}
      noValidate={false}
      onInput={() => {
        if (submission === "validation-error") setSubmission("idle");
      }}
      onInvalid={() => {
        setSubmission("validation-error");
        focusStatus();
      }}
      onSubmit={handleSubmit}
    >
      <fieldset disabled={submission === "submitting"}>
        <legend>Apresente o seu projeto</legend>
        <div className={styles.fieldRow}>
          <label>
            Nome
            <input
              autoComplete="name"
              maxLength={100}
              minLength={2}
              name="name"
              required
              type="text"
            />
          </label>
          <label>
            E-mail
            <input
              autoComplete="email"
              maxLength={254}
              name="email"
              required
              type="email"
            />
          </label>
        </div>
        <label>
          Empresa <span>(opcional)</span>
          <input
            autoComplete="organization"
            maxLength={120}
            name="company"
            type="text"
          />
        </label>
        <label>
          Tipo de projeto
          <select defaultValue={selectedType} name="projectType" required>
            <option value="">Selecione uma opção</option>
            {contactProjectTypes.map((projectType) => (
              <option key={projectType.value} value={projectType.value}>
                {projectType.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Mensagem
          <textarea
            maxLength={3_000}
            minLength={20}
            name="message"
            required
            rows={6}
          />
        </label>
        <label className={styles.consentField}>
          <input name="privacyConsent" required type="checkbox" />
          <span>
            Li a <a href="/politica-de-privacidade">Política de Privacidade</a> e
            concordo com o uso destes dados para resposta ao contato.
          </span>
        </label>
        <label aria-hidden="true" className={styles.honeypot}>
          Website
          <input
            autoComplete="off"
            name="website"
            tabIndex={-1}
            type="text"
          />
        </label>

        {siteKey ? (
          <>
            <Script
              id="cloudflare-turnstile"
              onError={() => setVerification("unavailable")}
              onReady={renderTurnstile}
              src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
              strategy="afterInteractive"
            />
            <div
              className={styles.turnstile}
              data-turnstile-container=""
              ref={turnstileContainerRef}
            />
          </>
        ) : null}

        <p
          className={styles.verificationStatus}
          data-verification-state={verification}
          id="contact-verification-status"
        >
          {verificationMessage}
        </p>
        <button
          className={styles.submit}
          disabled={!token || submission === "submitting"}
          type="submit"
        >
          {submission === "submitting" ? "Enviando…" : "Enviar mensagem"}
        </button>
      </fieldset>
      <p
        aria-live="polite"
        className={styles.formStatus}
        data-contact-status={submission}
        id="contact-form-status"
        ref={statusRef}
        role={
          submission === "error" || submission === "validation-error"
            ? "alert"
            : "status"
        }
        tabIndex={-1}
      >
        {messages[submission]}
      </p>
    </form>
  );
}
