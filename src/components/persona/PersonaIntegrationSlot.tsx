import styles from "./persona-integration-slot.module.css";

export interface PersonaIntegrationSlotProps {
  readonly className?: string;
}

export function PersonaIntegrationSlot({
  className,
}: PersonaIntegrationSlotProps = {}) {
  const rootClassName = [styles.slot, className].filter(Boolean).join(" ");

  return (
    <section
      aria-label="Contrato de integração da Persona W_Flyer"
      className={rootClassName}
      data-persona-integration-slot=""
      data-persona-phase-10="deferred"
      data-persona-slot="required"
      data-persona-static-fallback="active"
      data-persona-status="pending-owner-approval"
    >
      <header className={styles.header}>
        <p className={styles.eyebrow}>Persona W_Flyer</p>
        <h3 className={styles.title}>Espaço obrigatório da seção Sobre</h3>
      </header>

      <p className={styles.status} role="status">
        A Persona final é obrigatória na seção Sobre e aguarda fornecimento e
        aprovação do titular.
      </p>

      <p className={styles.copy}>
        Este espaço reserva somente o contrato de integração. Nenhuma
        ilustração, geometria, pose ou aparência substituta foi criada.
      </p>

      <div className={styles.fallback}>
        <p className={styles.fallbackTitle}>Alternativa estática ativa</p>
        <p>
          A leitura deste contrato permanece disponível sem imagem, movimento
          ou JavaScript.
        </p>
      </div>

      <p className={styles.deferred}>
        Rig, poses, movimentos e aparições opcionais ficam adiados para a Fase
        10 e só poderão ser integrados depois da aprovação do ativo final.
      </p>
    </section>
  );
}
