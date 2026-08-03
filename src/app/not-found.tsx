import type { Metadata } from "next";

import { ArrowIcon, LinkButton } from "@/components/ui";
import { StatePage } from "@/components/pages";

export const metadata: Metadata = {
  title: {
    absolute: "Página não encontrada — W_Flyer",
  },
  description:
    "O endereço solicitado não corresponde a uma página publicada no site institucional W_Flyer.",
  robots: {
    follow: false,
    index: false,
    nocache: true,
  },
};

export default function NotFoundPage() {
  return (
    <StatePage
      actions={
        <>
          <LinkButton href="/" leadingIcon={<ArrowIcon direction="left" />}>
            Voltar à página inicial
          </LinkButton>
          <LinkButton href="/contato" variant="secondary">
            Entrar em contato
          </LinkButton>
        </>
      }
      description="O endereço pode ter mudado ou a página não existe. Use a navegação para continuar pelo site."
      eyebrow="Erro 404"
      title="Página não encontrada"
    />
  );
}
