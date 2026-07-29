import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LinkButton } from "./button";
import { Card, Container, Surface } from "./layout";
import frameStyles from "./story-frame.module.css";
import { Eyebrow, Heading, Text } from "./typography";

const meta = {
  title: "Design system/Foundation/Surfaces and typography",
  component: Surface,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["test"],
} satisfies Meta<typeof Surface>;

export default meta;

type Story = StoryObj<typeof meta>;

function FoundationPreview({ theme }: { readonly theme: "dark" | "light" }) {
  return (
    <div className={frameStyles.frame} data-theme={theme}>
      <Container size="content">
        <div className={frameStyles.stack}>
          <Eyebrow>Partitura editorial</Eyebrow>
          <Heading as="h1" size="lg">
            Tecnologia que acompanha o seu ritmo.
          </Heading>
          <Text size="lead" tone="muted">
            Hierarquia editorial, leitura clara e superfícies discretas nos
            dois temas.
          </Text>
          <div className={frameStyles.grid}>
            <Card interactive>
              <Heading as="h2" size="sm">
                Sites
              </Heading>
              <Text tone="muted">
                Experiências institucionais rápidas, acessíveis e precisas.
              </Text>
              <LinkButton href="/servicos/criacao-de-sites" variant="ghost">
                Conhecer serviço
              </LinkButton>
            </Card>
            <Surface elevation="raised" tone="elevated">
              <Heading as="h2" size="sm">
                Aplicações
              </Heading>
              <Text tone="muted">
                Produtos digitais construídos para fluxos reais.
              </Text>
            </Surface>
          </div>
        </div>
      </Container>
    </div>
  );
}

export const Light: Story = {
  globals: {
    theme: "light",
  },
  render: () => <FoundationPreview theme="light" />,
};

export const Dark: Story = {
  globals: {
    theme: "dark",
  },
  render: () => <FoundationPreview theme="dark" />,
};

export const CardHoverPreview: Story = {
  globals: {
    theme: "light",
  },
  render: () => (
    <div className={frameStyles.frame} data-theme="light">
      <Card data-preview-state="hover" interactive>
        <Eyebrow>Estado determinístico</Eyebrow>
        <Heading as="h2" size="sm">
          Card em hover
        </Heading>
        <Text tone="muted">
          O estado visual pode ser comparado sem automação de ponteiro frágil.
        </Text>
      </Card>
    </div>
  ),
};
