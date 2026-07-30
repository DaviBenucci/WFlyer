import type { SVGProps } from "react";

import type { ContentIconName } from "@/content/site-content";

export type PageIconName = ContentIconName;

export interface PageIconProps
  extends Omit<SVGProps<SVGSVGElement>, "children"> {
  readonly name: PageIconName;
}

function IconDrawing({ name }: { readonly name: PageIconName }) {
  switch (name) {
    case "applications":
      return (
        <>
          <rect height="15" rx="2" width="12" x="3" y="4" />
          <rect height="12" rx="2" width="8" x="13" y="8" />
          <path d="M7 7h4M16 17h2" />
        </>
      );
    case "build":
      return (
        <>
          <path d="m4 8 8-4 8 4-8 4-8-4Z" />
          <path d="m4 12 8 4 8-4M4 16l8 4 8-4" />
        </>
      );
    case "clarity":
      return (
        <>
          <path d="M4 7h10M4 12h16M4 17h8" />
          <circle cx="18" cy="7" r="2" />
          <circle cx="15" cy="17" r="2" />
        </>
      );
    case "cloud":
      return (
        <path d="M7 18h10a4 4 0 0 0 .7-7.94A6 6 0 0 0 6.3 8.5 4.5 4.5 0 0 0 7 18Z" />
      );
    case "continue":
      return (
        <>
          <path d="M5 6h8a6 6 0 0 1 0 12H7" />
          <path d="m9 14-4 4 4 4" />
          <path d="m15 9 4 3-4 3V9Z" />
        </>
      );
    case "custom":
      return (
        <>
          <path d="M9 4v4H5a2 2 0 0 0 0 4h4v4a2 2 0 0 0 4 0v-4h4a2 2 0 0 0 0-4h-4V4a2 2 0 0 0-4 0Z" />
          <path d="M9 20h4" />
        </>
      );
    case "define":
      return (
        <>
          <path d="M6 3h9l3 3v15H6V3Z" />
          <path d="M14 3v4h4M9 12h6M9 16h4" />
        </>
      );
    case "devices":
      return (
        <>
          <rect height="12" rx="2" width="15" x="2" y="4" />
          <path d="M7 20h5M9.5 16v4" />
          <rect height="11" rx="1.5" width="6" x="16" y="9" />
        </>
      );
    case "discover":
      return (
        <>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m15.2 15.2 4.3 4.3M8.5 12.5l1.3-4 4-1.3-1.3 4-4 1.3Z" />
        </>
      );
    case "download":
      return (
        <>
          <path d="M12 3v11m0 0 4-4m-4 4-4-4" />
          <path d="M5 15v5h14v-5" />
        </>
      );
    case "evolve":
      return (
        <>
          <path d="M4 13a8 8 0 0 1 13.5-5.8L20 10" />
          <path d="M20 5v5h-5M20 13a8 8 0 0 1-13.5 5.8L4 16" />
          <path d="M4 21v-5h5" />
        </>
      );
    case "human":
      return (
        <>
          <circle cx="12" cy="7" r="3" />
          <path d="M5 21a7 7 0 0 1 14 0M4 11l2 2 3-4M18 11l2 2" />
        </>
      );
    case "instruments":
      return (
        <>
          <path d="M7 4v11a3 3 0 1 1-2-2.83M17 7v9a3 3 0 1 1-2-2.83" />
          <path d="m7 4 10-2v5L7 9V4Z" />
        </>
      );
    case "integrations":
      return (
        <>
          <circle cx="5" cy="12" r="3" />
          <circle cx="19" cy="5" r="3" />
          <circle cx="19" cy="19" r="3" />
          <path d="m7.7 10.6 8.6-4.2M7.7 13.4l8.6 4.2" />
        </>
      );
    case "mission":
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <path d="m12 12 7-7M16 5h3v3" />
        </>
      );
    case "note":
      return (
        <>
          <path d="M9 17V5l10-2v12" />
          <ellipse cx="6.5" cy="18" rx="2.5" ry="2" />
          <ellipse cx="16.5" cy="16" rx="2.5" ry="2" />
        </>
      );
    case "review":
      return (
        <>
          <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
          <circle cx="12" cy="12" r="2.5" />
          <path d="m16.5 18.5 1.5 1.5 3-4" />
        </>
      );
    case "score":
      return (
        <>
          <path d="M3 6h18M3 9h18M3 12h18M3 15h18M3 18h18" />
          <ellipse cx="8" cy="13.5" rx="2" ry="1.5" />
          <path d="M10 13.5V7" />
          <ellipse cx="16" cy="10.5" rx="2" ry="1.5" />
          <path d="M18 10.5V5" />
        </>
      );
    case "sites":
      return (
        <>
          <rect height="16" rx="2" width="20" x="2" y="4" />
          <path d="M2 9h20M6 6.5h.01M9 6.5h.01M7 14l-2 2 2 2M17 14l2 2-2 2M14 13l-4 6" />
        </>
      );
    case "sliders":
      return (
        <>
          <path d="M4 6h16M4 12h16M4 18h16" />
          <circle cx="9" cy="6" r="2" />
          <circle cx="15" cy="12" r="2" />
          <circle cx="7" cy="18" r="2" />
        </>
      );
    case "source":
      return (
        <>
          <path d="M4 6h12M4 12h16M4 18h9" />
          <circle cx="18" cy="6" r="2" />
          <path d="m17 15 3 3-3 3" />
        </>
      );
    case "target":
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 4V2M20 12h2M12 20v2M4 12H2" />
        </>
      );
    case "values":
      return (
        <>
          <path d="m12 3 2.2 5.2L20 10l-4.4 3.7.9 5.8L12 16.3l-4.5 3.2.9-5.8L4 10l5.8-1.8L12 3Z" />
          <path d="m9.5 12 1.7 1.7 3.5-3.7" />
        </>
      );
    case "vision":
      return (
        <>
          <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      );
    case "workflow":
      return (
        <>
          <rect height="5" rx="1" width="7" x="2" y="3" />
          <rect height="5" rx="1" width="7" x="15" y="16" />
          <path d="M9 5.5h3a5 5 0 0 1 5 5v1M15 18.5h-3a5 5 0 0 1-5-5v-1" />
          <path d="m15 9 2 2.5L19 9M9 15l-2-2.5L5 15" />
        </>
      );
  }
}

export function PageIcon({
  className,
  name,
  ...svgProps
}: PageIconProps) {
  return (
    <svg
      {...svgProps}
      aria-hidden="true"
      className={className}
      data-page-icon={name}
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.45"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <IconDrawing name={name} />
    </svg>
  );
}
