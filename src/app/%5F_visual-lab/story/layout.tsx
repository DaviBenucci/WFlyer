import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

// `%5F_visual-lab` is the routable filesystem escape for `/__visual-lab`.

export function generateMetadata(): Metadata {
  if (process.env.NODE_ENV === "production") {
    return { robots: { follow: false, index: false } };
  }

  return {
    title: "Static Vertical v2 Skeleton | W_Flyer development",
    description:
      "Development-only semantic review surface for the W_Flyer v2 vertical story.",
    robots: { follow: false, index: false },
  };
}

export default function StoryVisualLabLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return children;
}
