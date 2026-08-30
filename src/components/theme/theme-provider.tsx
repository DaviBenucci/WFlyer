"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  isThemeName,
  resolveReviewRouteTheme,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  type ThemeName,
} from "./theme-constants";

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
  useSystemTheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): ThemeName | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeName(value) ? value : null;
  } catch {
    return null;
  }
}

function resolveSystemTheme(): ThemeName {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(): ThemeName {
  return (
    resolveReviewRouteTheme(window.location.pathname, window.location.search) ??
    readStoredTheme() ??
    resolveSystemTheme()
  );
}

function applyTheme(theme: ThemeName): void {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

function getThemeSnapshot(): ThemeName {
  const appliedTheme = document.documentElement.dataset.theme;
  return isThemeName(appliedTheme) ? appliedTheme : resolveTheme();
}

function getServerThemeSnapshot(): ThemeName {
  return "light";
}

function subscribeToTheme(onStoreChange: () => void): () => void {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handleThemeChange = (): void => {
    onStoreChange();
  };

  const handleSystemChange = (): void => {
    if (readStoredTheme() === null) {
      applyTheme(resolveTheme());
    }
  };

  const handleStorageChange = (event: StorageEvent): void => {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) {
      return;
    }

    applyTheme(resolveTheme());
  };

  window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  window.addEventListener("storage", handleStorageChange);
  mediaQuery.addEventListener("change", handleSystemChange);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    window.removeEventListener("storage", handleStorageChange);
    mediaQuery.removeEventListener("change", handleSystemChange);
  };
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    applyTheme(resolveTheme());
  }, []);

  const setTheme = useCallback((nextTheme: ThemeName) => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // O tema continua funcional na sessão mesmo com storage indisponível.
    }

    applyTheme(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(getThemeSnapshot() === "dark" ? "light" : "dark");
  }, [setTheme]);

  const useSystemTheme = useCallback(() => {
    try {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } catch {
      // O fallback do sistema ainda pode ser aplicado sem persistência.
    }

    applyTheme(resolveSystemTheme());
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, useSystemTheme }),
    [setTheme, theme, toggleTheme, useSystemTheme],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider.");
  }

  return context;
}
