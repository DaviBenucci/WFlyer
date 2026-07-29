import { THEME_STORAGE_KEY } from "./theme-constants";

interface ThemeScriptProps {
  nonce?: string;
}

const themeBootstrapScript = `(() => {
  const root = document.documentElement;
  let theme;

  try {
    const savedTheme = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    if (savedTheme === "light" || savedTheme === "dark") {
      theme = savedTheme;
    }
  } catch {}

  if (!theme) {
    theme =
      typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  }

  root.dataset.theme = theme;
  root.style.colorScheme = theme;
})();`;

export function ThemeScript({ nonce }: ThemeScriptProps) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
      id="wf-theme-script"
      nonce={nonce}
    />
  );
}
