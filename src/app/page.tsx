import Link from "next/link";

export default function HomePage() {
  return (
    <main className="foundation-shell">
      <p className="foundation-eyebrow">W_Flyer</p>
      <h1>Uma experiência digital pensada em dois movimentos.</h1>
      <p>
        Conheça a aplicação musical em desenvolvimento ou acompanhe o trabalho
        institucional da W_Flyer.
      </p>
      <nav aria-label="Escolha um caminho">
        <Link href="/aplicacao-wflyer" prefetch={false}>
          Explorar a aplicação
        </Link>
        <Link href="/sobre" prefetch={false}>
          Conhecer a empresa
        </Link>
      </nav>
    </main>
  );
}
