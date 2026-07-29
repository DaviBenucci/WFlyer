export interface VisualArchetype {
  readonly source_panels?: readonly string[];
  readonly source_files?: readonly string[];
  readonly pages: readonly string[];
  readonly rules: readonly string[];
}

export interface VisualArchetypeManifest {
  readonly version: "1.0";
  readonly status: "normative";
  readonly updated_at: "2026-07-29";
  readonly source_files: {
    readonly master_board: string;
    readonly application_reference: string;
  };
  readonly archetypes: Readonly<Record<string, VisualArchetype>>;
  readonly theme_derivation: {
    readonly light: "use-approved-light-tokens";
    readonly dark: "preserve-geometry-and-apply-approved-dark-tokens";
  };
  readonly responsive_derivation: {
    readonly mobile: "follow-docs/02-design/06-responsividade.md";
    readonly "no_required_horizontal-scroll": true;
    readonly "preserve-score-narrative": true;
  };
}

/**
 * Espelho tipado de
 * docs/design-reference/golden-pages/visual-archetypes.yaml.
 */
export const visualArchetypeManifest = {
  version: "1.0",
  status: "normative",
  updated_at: "2026-07-29",
  source_files: {
    master_board: "master/wflyer-approved-master-board.png",
    application_reference: "application/application-desktop-light.png",
  },
  archetypes: {
    "origin-bifurcation": {
      source_panels: ["home-light", "home-dark"],
      pages: ["home"],
      rules: [
        "central-clef-origin",
        "dual-branch-layout",
        "balanced-editorial-hero",
      ],
    },
    "product-demo": {
      source_files: ["application/application-desktop-light.png"],
      pages: ["application"],
      rules: [
        "editorial-hero",
        "interactive-tablet",
        "five-benefit-strip",
      ],
    },
    "editorial-sequence": {
      source_panels: ["home-light", "application-light"],
      pages: ["application-how-it-works", "company"],
      rules: [
        "large-serif-heading",
        "restrained-copy",
        "score-continuity",
        "modular-sections",
      ],
    },
    "editorial-benefits-terminal": {
      source_panels: ["application-light", "services-light"],
      pages: ["application-benefits"],
      rules: ["benefit-cards", "terminal-cta", "final-double-barline"],
    },
    "service-grid": {
      source_panels: ["services-light", "services-dark"],
      pages: ["services"],
      rules: ["four-card-grid", "thin-borders", "line-icons", "compact-copy"],
    },
    "process-timeline": {
      source_panels: ["services-light", "portfolio-light"],
      pages: ["process"],
      rules: [
        "numbered-steps",
        "score-as-progress-line",
        "no-horizontal-scroll-dependency",
      ],
    },
    "portfolio-grid": {
      source_panels: ["portfolio-light", "portfolio-dark"],
      pages: ["portfolio"],
      rules: [
        "project-cards",
        "verified-projects-only",
        "external-link-affordance",
      ],
    },
    "contact-terminal": {
      source_panels: ["contact-light", "contact-dark"],
      pages: ["contact"],
      rules: [
        "two-column-contact",
        "accessible-form",
        "social-links",
        "final-double-barline",
      ],
    },
    "service-detail": {
      source_panels: ["services-light", "application-light", "contact-light"],
      pages: [
        "service-sites",
        "service-applications",
        "service-integrations",
        "service-custom",
      ],
      rules: [
        "editorial-hero",
        "scoped-deliverables",
        "process-block",
        "contact-cta",
      ],
    },
    "legal-editorial": {
      source_panels: ["company-derived", "contact-light", "footer-light"],
      pages: ["legal-page-template"],
      rules: [
        "narrow-reading-column",
        "table-of-contents-optional",
        "minimal-score-decoration",
      ],
    },
    "global-footer": {
      source_panels: ["footer-light", "footer-dark"],
      pages: ["footer"],
      rules: [
        "brand-lockup",
        "navigation-columns",
        "contact-and-socials",
        "legal-links",
      ],
    },
  },
  theme_derivation: {
    light: "use-approved-light-tokens",
    dark: "preserve-geometry-and-apply-approved-dark-tokens",
  },
  responsive_derivation: {
    mobile: "follow-docs/02-design/06-responsividade.md",
    "no_required_horizontal-scroll": true,
    "preserve-score-narrative": true,
  },
} as const satisfies VisualArchetypeManifest;

export type VisualArchetypeId = keyof typeof visualArchetypeManifest.archetypes;
export type ArchetypePageId =
  (typeof visualArchetypeManifest.archetypes)[VisualArchetypeId]["pages"][number];

const archetypeEntries = Object.entries(
  visualArchetypeManifest.archetypes,
) as [VisualArchetypeId, (typeof visualArchetypeManifest.archetypes)[VisualArchetypeId]][];

export const visualArchetypeByPage = Object.fromEntries(
  archetypeEntries.flatMap(([archetypeId, archetype]) =>
    archetype.pages.map((pageId) => [pageId, archetypeId]),
  ),
) as Record<ArchetypePageId, VisualArchetypeId>;
