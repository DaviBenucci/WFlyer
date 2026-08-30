import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/footer";
import { LocalRevealController } from "@/components/brand-intro";
import { RouteAwareExperienceBoundary } from "@/components/experience";
import { SiteHeader } from "@/components/header";
import { SiteStructuredData } from "@/components/seo";
import { StoryGlobalFooter, StoryV2Header } from "@/components/story";
import {
  THEME_BROWSER_COLORS,
  ThemeProvider,
  ThemeScript,
  ThemeToggle,
} from "@/components/theme";
import { createDeploymentRobotsMetadata } from "@/config/deployment";
import { pageSeo } from "@/config/seo";
import { siteConfig } from "@/config/site";

import { cormorantGaramond, manrope } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: pageSeo["/"].title,
    template: "%s",
  },
  description: pageSeo["/"].description,
  applicationName: siteConfig.name,
  category: "technology",
  creator: siteConfig.ownerName,
  publisher: siteConfig.name,
  robots: createDeploymentRobotsMetadata(),
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_BROWSER_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_BROWSER_COLORS.dark },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      className={`${cormorantGaramond.variable} ${manrope.variable}`}
      lang="pt-BR"
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          <SiteStructuredData />
          <RouteAwareExperienceBoundary
            legacyFooter={<SiteFooter />}
            legacyHeader={<SiteHeader themeControl={<ThemeToggle />} />}
            legacyPrelude={<LocalRevealController />}
            storyFooter={<StoryGlobalFooter />}
            storyHeader={<StoryV2Header themeControl={<ThemeToggle />} />}
            storyVisualLabEnabled={process.env.NODE_ENV !== "production"}
            testMode={process.env.WFLYER_TRANSITION_TEST_MODE === "1"}
          >
            {children}
          </RouteAwareExperienceBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
