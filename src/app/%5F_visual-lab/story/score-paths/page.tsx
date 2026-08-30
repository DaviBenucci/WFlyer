import { ScorePathReviewShell } from "./ScorePathReview";
import { resolveScorePathReviewSelection } from "./_fixtures/score-path-candidates";

interface ScorePathReviewPageProps {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ScorePathReviewPage({
  searchParams,
}: ScorePathReviewPageProps) {
  const selection = resolveScorePathReviewSelection(await searchParams);

  return <ScorePathReviewShell {...selection} />;
}
