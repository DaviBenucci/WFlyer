import { StoryBootstrapExperience, type StoryBootstrapScenario } from "@/components/story-bootstrap";
import { StaticStorySkeleton } from "@/components/story";

const STORY_BOOTSTRAP_SCENARIOS = new Set<StoryBootstrapScenario>([
  "normal",
  "slow-critical",
  "critical-failure",
  "timeout",
  "noncritical-failure",
  "projection-failure",
]);

interface StoryBootstrapPageProps {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function StoryBootstrapPage({
  searchParams,
}: StoryBootstrapPageProps) {
  const params = await searchParams;
  const requestedScenario = Array.isArray(params.scenario)
    ? params.scenario[0]
    : params.scenario;
  const scenario = STORY_BOOTSTRAP_SCENARIOS.has(
    requestedScenario as StoryBootstrapScenario,
  )
    ? (requestedScenario as StoryBootstrapScenario)
    : "normal";

  return (
    <StoryBootstrapExperience scenario={scenario}>
      <StaticStorySkeleton />
    </StoryBootstrapExperience>
  );
}
