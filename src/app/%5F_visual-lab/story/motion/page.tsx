import type { ApplicationDemoMediaContract } from "@/components/pages";
import { MotionStoryLab } from "@/components/story-motion";

const APP04_DEVELOPMENT_CONTRACT_FIXTURE: ApplicationDemoMediaContract = {
  finalFrameSrc: "/__phase8-app04-contract/final.webp",
  mp4Src: "/__phase8-app04-contract/demo.mp4",
  posterSrc: "/__phase8-app04-contract/poster.webp",
  webmSrc: "/__phase8-app04-contract/demo.webm",
};

interface StoryMotionLabPageProps {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function StoryMotionLabPage({
  searchParams,
}: StoryMotionLabPageProps) {
  const params = await searchParams;
  const scenario = Array.isArray(params.scenario)
    ? params.scenario[0]
    : params.scenario;

  return (
    <MotionStoryLab
      applicationDemoMedia={
        scenario === "app04-media-contract"
          ? APP04_DEVELOPMENT_CONTRACT_FIXTURE
          : undefined
      }
    />
  );
}
