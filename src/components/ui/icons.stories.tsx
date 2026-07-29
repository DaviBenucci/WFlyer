import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  ArrowIcon,
  CloseIcon,
  ExternalIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
} from "./icons";
import frameStyles from "./story-frame.module.css";

const meta = {
  title: "Design system/Foundation/Icons",
  component: ArrowIcon,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["test"],
} satisfies Meta<typeof ArrowIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

function IconSet({ theme }: { readonly theme: "dark" | "light" }) {
  return (
    <div className={frameStyles.frame} data-theme={theme}>
      <div className={frameStyles.row}>
        <div className={frameStyles.iconSample}>
          <ArrowIcon direction="left" size={24} />
          Esquerda
        </div>
        <div className={frameStyles.iconSample}>
          <ArrowIcon direction="right" size={24} />
          Direita
        </div>
        <div className={frameStyles.iconSample}>
          <MenuIcon size={24} />
          Menu
        </div>
        <div className={frameStyles.iconSample}>
          <CloseIcon size={24} />
          Fechar
        </div>
        <div className={frameStyles.iconSample}>
          <SunIcon size={24} />
          Claro
        </div>
        <div className={frameStyles.iconSample}>
          <MoonIcon size={24} />
          Escuro
        </div>
        <div className={frameStyles.iconSample}>
          <ExternalIcon size={24} />
          Externo
        </div>
      </div>
    </div>
  );
}

export const Light: Story = {
  globals: {
    theme: "light",
  },
  render: () => <IconSet theme="light" />,
};

export const Dark: Story = {
  globals: {
    theme: "dark",
  },
  render: () => <IconSet theme="dark" />,
};
