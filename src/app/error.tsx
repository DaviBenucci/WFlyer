"use client";

import { Button, LinkButton } from "@/components/ui";
import { StatePage } from "@/components/pages";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  readonly error: Error & { readonly digest?: string };
  readonly unstable_retry: () => void;
}) {
  void error;

  return (
    <StatePage
      actions={
        <>
          <Button onClick={unstable_retry}>Tentar novamente</Button>
          <LinkButton href="/" variant="secondary">
            Voltar à página inicial
          </LinkButton>
        </>
      }
      description="Não foi possível carregar esta página. Tente novamente ou volte à página inicial."
      eyebrow="Falha temporária"
      title="Algo não saiu como esperado"
    />
  );
}
