import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/header";
import { ThemeProvider, ThemeScript, ThemeToggle } from "@/components/theme";
import { siteConfig } from "@/config/site";

import { cormorantGaramond, manrope } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "W_Flyer",
    template: "%s | W_Flyer",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
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
          <a className="wf-skip-link" href="#main-content">
            Pular para o conteúdo principal
          </a>
          <SiteHeader themeControl={<ThemeToggle />} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
