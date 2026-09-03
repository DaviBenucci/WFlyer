import {
  createLaunchInterestAcknowledgmentEmail,
  createLaunchInterestOperationalEmail,
  type LaunchInterestRegistration,
} from "@/lib/app-launch-interest";
import type { ContactServerConfig } from "@/lib/contact";

import styles from "./preview.module.css";

const previewConfig: ContactServerConfig = {
  allowedHostnames: new Set(["wflyer.com.br"]),
  allowedOrigins: new Set(["https://wflyer.com.br"]),
  fromEmail: "site@wflyer.com.br",
  recipientEmail: "davi.benucci@wflyer.com.br",
  resendApiKey: "preview-only",
  turnstileSecretKey: "preview-only",
};

const previewRegistration: LaunchInterestRegistration = {
  acknowledgmentSent: false,
  addressKey: "preview-only",
  registered: true,
  requestId: "c51cc8fa-e7e5-4cc3-923d-a9010b29f771",
  submittedAt: "2026-08-31T15:00:00.000Z",
};

export default function AppLaunchInterestEmailPreviewPage() {
  const operational = createLaunchInterestOperationalEmail(
    "visitante@example.com",
    previewRegistration,
    previewConfig,
  );
  const acknowledgment = createLaunchInterestAcknowledgmentEmail(
    "visitante@example.com",
    previewRegistration,
    previewConfig,
  );

  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <header className={styles.header}>
        <p>Visual Lab · desenvolvimento</p>
        <h1>Prévia dos e-mails de lançamento</h1>
        <span>
          Templates fixos em pt-BR; esta rota nunca envia mensagens.
        </span>
      </header>
      <section aria-labelledby="operational-preview-title" className={styles.preview}>
        <div>
          <p>Destino fixo · welcome.app@wflyer.com.br</p>
          <h2 id="operational-preview-title">Registro operacional</h2>
        </div>
        <iframe
          sandbox=""
          srcDoc={operational.html}
          title="Prévia HTML do registro operacional"
        />
        <details>
          <summary>Versão em texto</summary>
          <pre>{operational.text}</pre>
        </details>
      </section>
      <section aria-labelledby="ack-preview-title" className={styles.preview}>
        <div>
          <p>Destino · endereço informado pela pessoa</p>
          <h2 id="ack-preview-title">Confirmação do cadastro</h2>
        </div>
        <iframe
          sandbox=""
          srcDoc={acknowledgment.html}
          title="Prévia HTML da confirmação do cadastro"
        />
        <details>
          <summary>Versão em texto</summary>
          <pre>{acknowledgment.text}</pre>
        </details>
      </section>
    </main>
  );
}
