import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Container, Heading } from "@/components/ui";
import { ApplicationDemoTablet } from "@/components/pages/application-demo";
import { siteConfig } from "@/config/site";
import {
  applicationContent,
  benefitsContent,
  howItWorksContent,
  portfolioContent,
  processContent,
  servicesContent,
} from "@/content/site-content";

import {
  ApplicationFeatureStrip,
  BenefitsGrid,
  ContactWorkspace,
  ProjectGrid,
  ServiceSolutionGrid,
  StepSequence,
} from "./ArchetypeBlocks";

const meta = {
  title: "Pages/Archetype blocks",
  component: ApplicationDemoTablet,
  decorators: [
    (Story) => (
      <Container>
        <div
          style={{
            display: "grid",
            gap: "2.5rem",
            paddingBlock: "3rem",
          }}
        >
          <Story />
        </div>
      </Container>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
  tags: ["test"],
} satisfies Meta<typeof ApplicationDemoTablet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ProductPreview: Story = {};

export const ProductPreviewConfigured: Story = {
  args: { initialState: "configured" },
};

export const ProductPreviewProcessing: Story = {
  args: { initialState: "processing" },
};

export const ProductPreviewResult: Story = {
  args: { initialState: "result" },
};

export const ProductPreviewDark: Story = {
  globals: { theme: "dark" },
};

export const ProductPreviewMobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const FeatureStrip: Story = {
  render: () => (
    <>
      <Heading as="h2" size="lg">
        Benefícios em destaque
      </Heading>
      <ApplicationFeatureStrip items={applicationContent.highlights} />
    </>
  ),
};

export const ApplicationSequence: Story = {
  render: () => (
    <>
      <Heading as="h2" size="lg">
        Cinco etapas claras
      </Heading>
      <StepSequence
        branch="application"
        steps={howItWorksContent.steps}
      />
    </>
  ),
};

export const ProcessTimeline: Story = {
  render: () => (
    <>
      <Heading as="h2" size="lg">
        Etapas do trabalho
      </Heading>
      <StepSequence
        branch="institutional"
        steps={processContent.steps}
      />
    </>
  ),
};

export const Services: Story = {
  render: () => (
    <>
      <Heading as="h2" size="lg">
        Nossas soluções
      </Heading>
      <ServiceSolutionGrid services={servicesContent.services} />
    </>
  ),
};

export const BenefitsDark: Story = {
  globals: {
    theme: "dark",
  },
  render: () => (
    <>
      <Heading as="h2" size="lg">
        Benefícios da aplicação
      </Heading>
      <BenefitsGrid items={benefitsContent.benefits} />
    </>
  ),
};

export const Portfolio: Story = {
  render: () => <ProjectGrid projects={portfolioContent.projects} />,
};

export const ContactShell: Story = {
  render: () => (
    <ContactWorkspace
      email={siteConfig.email}
      githubUrl={siteConfig.social.github}
      instagramUrl={siteConfig.social.instagram}
    />
  ),
};
