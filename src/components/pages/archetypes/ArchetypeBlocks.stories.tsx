import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Container, Heading } from "@/components/ui";
import { siteConfig } from "@/config/site";
import {
  processContent,
  servicesContent,
} from "@/content/site-content";

import {
  ContactWorkspace,
  ServiceSolutionGrid,
  StepSequence,
} from "./ArchetypeBlocks";

const meta = {
  title: "Pages/Archetype blocks",
  component: ServiceSolutionGrid,
  args: { services: servicesContent.services },
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
} satisfies Meta<typeof ServiceSolutionGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

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

export const ContactShell: Story = {
  render: () => (
    <ContactWorkspace
      email={siteConfig.email}
      githubUrl={siteConfig.social.github}
      instagramUrl={siteConfig.social.instagram}
    />
  ),
};
