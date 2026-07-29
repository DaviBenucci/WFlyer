"use client";

import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import Link from "next/link";

import { OfficialBrandSymbol } from "@/components/brand";

import { NavigationMeasure } from "./NavigationMeasure";
import {
  APPLICATION_NAVIGATION,
  getHeaderRouteState,
  INSTITUTIONAL_NAVIGATION,
  type HeaderNavigationItem,
} from "./navigation";
import styles from "./site-header.module.css";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export interface SiteHeaderProps {
  readonly pathname?: string;
  readonly themeControl?: ReactNode;
  readonly defaultMenuOpen?: boolean;
}

type MenuCloseFocusTarget = "desktop-brand" | "trigger";

function MenuIcon({ open }: { readonly open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={styles.menuIcon}
      focusable="false"
      viewBox="0 0 24 24"
    >
      {open ? (
        <>
          <path d="M5 5 19 19" />
          <path d="M19 5 5 19" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

function DesktopMeasureGroup({
  activeId,
  items,
  label,
  processSubchapter,
}: {
  readonly activeId: string | null;
  readonly items: readonly HeaderNavigationItem[];
  readonly label: string;
  readonly processSubchapter: boolean;
}) {
  return (
    <nav aria-label={label} className={styles.desktopMeasureGroup}>
      {items.map((item) => {
        const itemIsActive = item.id === activeId;
        const itemShowsProcess =
          item.id === "services" && processSubchapter;

        return (
          <NavigationMeasure
            active={itemIsActive}
            item={item}
            key={item.id}
            processSubchapter={itemShowsProcess}
          />
        );
      })}
    </nav>
  );
}

function MobileMenuGroup({
  activeId,
  items,
  label,
  onNavigate,
  processSubchapter,
}: {
  readonly activeId: string | null;
  readonly items: readonly HeaderNavigationItem[];
  readonly label: string;
  readonly onNavigate: () => void;
  readonly processSubchapter: boolean;
}) {
  return (
    <div className={styles.mobileMenuGroup}>
      <h2>{label}</h2>
      <ol>
        {items.map((item) => {
          const itemIsActive = item.id === activeId;
          const itemShowsProcess =
            item.id === "services" && processSubchapter;

          return (
            <li key={item.id}>
              <NavigationMeasure
                active={itemIsActive}
                item={item}
                mobile
                onNavigate={onNavigate}
                processSubchapter={itemShowsProcess}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function SiteHeader({
  defaultMenuOpen = false,
  pathname,
  themeControl,
}: SiteHeaderProps) {
  const routerPathname = usePathname();
  const currentPathname = pathname ?? routerPathname ?? "/";
  const { activeId, processSubchapter } =
    getHeaderRouteState(currentPathname);
  const [menuOpen, setMenuOpen] = useState(defaultMenuOpen);
  const [scrolled, setScrolled] = useState(false);
  const menuTitleId = `wf-mobile-menu-${useId().replaceAll(":", "")}`;
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const desktopBrandLinkRef = useRef<HTMLAnchorElement>(null);
  const menuWasOpenRef = useRef(false);
  const menuCloseFocusTargetRef =
    useRef<MenuCloseFocusTarget>("trigger");

  const closeMenu = useCallback(
    (focusTarget: MenuCloseFocusTarget = "trigger") => {
      menuCloseFocusTargetRef.current = focusTarget;
      setMenuOpen(false);
    },
    [],
  );

  useEffect(() => {
    const updateScrolledState = () => {
      setScrolled(window.scrollY > 8);
    };

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrolledState);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const firstFocusable =
        menuPanelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      firstFocusable?.focus();
    } else if (menuWasOpenRef.current) {
      if (menuCloseFocusTargetRef.current === "desktop-brand") {
        desktopBrandLinkRef.current?.focus();
      } else {
        menuTriggerRef.current?.focus();
      }
    }

    menuWasOpenRef.current = menuOpen;
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const closeMenu = () => {
      menuCloseFocusTargetRef.current = "trigger";
      setMenuOpen(false);
    };
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Node &&
        !menuPanelRef.current?.contains(target) &&
        !menuTriggerRef.current?.contains(target)
      ) {
        event.preventDefault();
        closeMenu();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    const desktopMediaQuery = window.matchMedia("(min-width: 1024px)");
    const closeAtDesktopBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) {
        closeMenu("desktop-brand");
      }
    };

    desktopMediaQuery.addEventListener(
      "change",
      closeAtDesktopBreakpoint,
    );

    return () => {
      desktopMediaQuery.removeEventListener(
        "change",
        closeAtDesktopBreakpoint,
      );
    };
  }, [closeMenu]);

  const handleMenuKeyDown = (
    event: ReactKeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = Array.from(
      menuPanelRef.current?.querySelectorAll<HTMLElement>(
        FOCUSABLE_SELECTOR,
      ) ?? [],
    ).filter((element) => !element.hasAttribute("disabled"));

    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements.at(0);
    const lastElement = focusableElements.at(-1);

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  };

  return (
    <header
      className={styles.siteHeader}
      data-menu-open={menuOpen ? "true" : "false"}
      data-scrolled={scrolled ? "true" : "false"}
    >
      <div
        className={styles.desktopHeader}
        data-has-theme-control={themeControl ? "true" : "false"}
      >
        <DesktopMeasureGroup
          activeId={activeId}
          items={APPLICATION_NAVIGATION}
          label="Navegação da aplicação"
          processSubchapter={false}
        />

        <Link
          aria-current={currentPathname === "/" ? "page" : undefined}
          aria-label="W_Flyer — voltar à página inicial"
          className={styles.brandHomeLink}
          href="/"
          ref={desktopBrandLinkRef}
        >
          <OfficialBrandSymbol decorative />
        </Link>

        <DesktopMeasureGroup
          activeId={activeId}
          items={INSTITUTIONAL_NAVIGATION}
          label="Navegação institucional"
          processSubchapter={processSubchapter}
        />

        {themeControl ? (
          <div className={styles.desktopThemeControl}>{themeControl}</div>
        ) : null}
      </div>

      <div
        aria-hidden={menuOpen ? "true" : undefined}
        className={styles.mobileHeader}
        inert={menuOpen ? true : undefined}
      >
        <Link
          aria-current={currentPathname === "/" ? "page" : undefined}
          aria-label="W_Flyer — voltar à página inicial"
          className={styles.mobileBrandHomeLink}
          href="/"
          onClick={() => {
            closeMenu();
          }}
        >
          <OfficialBrandSymbol decorative />
        </Link>

        <div className={styles.mobileActions}>
          {themeControl ? (
            <div className={styles.mobileThemeControl}>{themeControl}</div>
          ) : null}
          <button
            aria-controls={menuTitleId}
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            className={styles.menuTrigger}
            onClick={() => {
              if (menuOpen) {
                closeMenu();
              } else {
                setMenuOpen(true);
              }
            }}
            ref={menuTriggerRef}
            type="button"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className={styles.mobileMenuLayer}>
          <button
            aria-hidden="true"
            className={styles.mobileMenuBackdrop}
            onClick={() => {
              closeMenu();
            }}
            tabIndex={-1}
            type="button"
          />
          <div
            aria-labelledby={`${menuTitleId}-title`}
            aria-modal="true"
            className={styles.mobileMenuPanel}
            id={menuTitleId}
            onKeyDown={handleMenuKeyDown}
            ref={menuPanelRef}
            role="dialog"
          >
            <div className={styles.mobileMenuHeading}>
              <p id={`${menuTitleId}-title`}>Navegação W_Flyer</p>
              <button
                aria-label="Fechar menu"
                className={styles.menuClose}
                onClick={() => {
                  closeMenu();
                }}
                type="button"
              >
                <MenuIcon open />
              </button>
            </div>

            <nav aria-label="Navegação principal">
              <MobileMenuGroup
                activeId={activeId}
                items={APPLICATION_NAVIGATION}
                label="Aplicação"
                onNavigate={() => {
                  closeMenu();
                }}
                processSubchapter={false}
              />
              <MobileMenuGroup
                activeId={activeId}
                items={INSTITUTIONAL_NAVIGATION}
                label="Empresa"
                onNavigate={() => {
                  closeMenu();
                }}
                processSubchapter={processSubchapter}
              />
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
