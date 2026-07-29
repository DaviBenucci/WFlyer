import localFont from "next/font/local";

export const cormorantGaramond = localFont({
  src: [
    {
      path: "../assets/fonts/cormorant-garamond-latin-variable.woff2",
      style: "normal",
      weight: "300 700",
    },
    {
      path: "../assets/fonts/cormorant-garamond-latin-variable-italic.woff2",
      style: "italic",
      weight: "300 700",
    },
  ],
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  preload: true,
  variable: "--wf-font-cormorant",
});

export const manrope = localFont({
  src: [
    {
      path: "../assets/fonts/manrope-latin-variable.woff2",
      style: "normal",
      weight: "200 800",
    },
  ],
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
  preload: true,
  variable: "--wf-font-manrope",
});
