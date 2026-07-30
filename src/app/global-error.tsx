"use client";

import { Button, LinkButton } from "@/components/ui";
import { StatePage } from "@/components/pages";

import { cormorantGaramond, manrope } from "./fonts";
import "./globals.css";

export default function GlobalErrorPage({
  error,
  unstable_retry,
}: {
  readonly error: Error & { readonly digest?: string };
  readonly unstable_retry: () => void;
}) {
  void error;

  return (
    <html
      className={`${cormorantGaramond.variable} ${manrope.variable}`}
      lang="pt-BR"
    >
      <body>
        <StatePage
          actions={
            <>
              <Button onClick={unstable_retry}>Tentar novamente</Button>
              <LinkButton href="/" variant="secondary">
                Voltar à página inicial
              </LinkButton>
            </>
          }
          description="O site encontrou uma falha inesperada. Tente recarregar a experiência ou volte à página inicial."
          eyebrow="Falha inesperada"
          title="Não foi possível continuar"
        />
      </body>
    </html>
  );
}
