import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button, LinkButton } from "./button";
import { ArrowIcon, MenuIcon } from "./icons";
import frameStyles from "./story-frame.module.css";

const meta = {
  title: "Design system/Actions/Button",
  component: Button,
  args: {
    children: "Começar um projeto",
  },
  parameters: {
    layout: "fullscreen",
  },
  tags: ["test"],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Light: Story = {
  globals: {
    theme: "light",
  },
  render: (args) => (
    <div className={frameStyles.frame} data-theme="light">
      <Button {...args} />
    </div>
  ),
};

export const Dark: Story = {
  globals: {
    theme: "dark",
  },
  render: (args) => (
    <div className={frameStyles.frame} data-theme="dark">
      <Button {...args} />
    </div>
  ),
};

export const Variants: Story = {
  globals: {
    theme: "light",
  },
  render: () => (
    <div className={frameStyles.frame} data-theme="light">
      <div className={frameStyles.row}>
        <Button variant="primary">Primário</Button>
        <Button variant="secondary">Secundário</Button>
        <Button variant="ghost">Discreto</Button>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  globals: {
    theme: "light",
  },
  render: () => (
    <div className={frameStyles.frame} data-theme="light">
      <div className={frameStyles.row}>
        <Button disabled variant="primary">
          Ação indisponível
        </Button>
        <Button disabled variant="secondary">
          Ação indisponível
        </Button>
      </div>
    </div>
  ),
};

export const HoverPreview: Story = {
  globals: {
    theme: "light",
  },
  render: () => (
    <div className={frameStyles.frame} data-theme="light">
      <div className={frameStyles.row}>
        <Button data-preview-state="hover" variant="primary">
          Hover primário
        </Button>
        <Button data-preview-state="hover" variant="secondary">
          Hover secundário
        </Button>
        <Button data-preview-state="hover" variant="ghost">
          Hover discreto
        </Button>
      </div>
    </div>
  ),
};

export const WithIcons: Story = {
  globals: {
    theme: "dark",
  },
  render: () => (
    <div className={frameStyles.frame} data-theme="dark">
      <div className={frameStyles.row}>
        <Button
          trailingIcon={<ArrowIcon />}
          variant="primary"
        >
          Ver serviços
        </Button>
        <Button aria-label="Abrir menu" iconOnly variant="secondary">
          <MenuIcon />
        </Button>
        <LinkButton
          external
          href="https://app.wflyer.com.br"
          variant="ghost"
        >
          Acessar aplicação
        </LinkButton>
      </div>
    </div>
  ),
};
