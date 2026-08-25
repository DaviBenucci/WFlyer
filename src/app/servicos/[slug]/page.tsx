import { notFound } from "next/navigation";

export function generateStaticParams(): never[] {
  return [];
}

export default async function UnknownServicePage({
  params,
}: {
  readonly params: Promise<{ readonly slug: string }>;
}) {
  await params;
  notFound();
}
