import { ScorePathOriginReview } from "../ScorePathOriginReview";
import { resolveScorePathOriginReviewSelection } from "../_fixtures/score-path-origin";

interface ScorePathOriginReviewPageProps {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ScorePathOriginReviewPage({
  searchParams,
}: ScorePathOriginReviewPageProps) {
  const selection = resolveScorePathOriginReviewSelection(await searchParams);

  return <ScorePathOriginReview {...selection} />;
}
