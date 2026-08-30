import { ScorePathReviewSurface } from "../ScorePathReview";
import { resolveScorePathReviewSelection } from "../_fixtures/score-path-candidates";

interface ScorePathReviewPreviewPageProps {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ScorePathReviewPreviewPage({
  searchParams,
}: ScorePathReviewPreviewPageProps) {
  const selection = resolveScorePathReviewSelection(await searchParams);

  return <ScorePathReviewSurface {...selection} />;
}
