import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/footer";
import { SiteHeader } from "@/components/header";
import { SiteStructuredData } from "@/components/seo";
import { ThemeProvider, ThemeScript, ThemeToggle } from "@/components/theme";
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
  creator: siteConfig.name,
  publisher: siteConfig.name,
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f1e8" },
    { media: "(prefers-color-scheme: dark)", color: "#020b22" },
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
          <a className="wf-skip-link" href="#main-content">
            Pular para o conteúdo principal
          </a>
          <SiteHeader themeControl={<ThemeToggle />} />
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
