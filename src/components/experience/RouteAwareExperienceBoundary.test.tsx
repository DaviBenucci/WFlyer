import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const navigationState = vi.hoisted(() => ({
  pathname: "/",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationState.pathname,
}));

vi.mock("./SiteExperienceShell", () => ({
  SiteExperienceShell: ({ children }: { readonly children: ReactNode }) => (
    <div data-testid="legacy-shell">{children}</div>
  ),
}));

import { RouteAwareExperienceBoundary } from "./RouteAwareExperienceBoundary";

function renderBoundary() {
  return render(
    <RouteAwareExperienceBoundary
      legacyFooter={<div data-testid="legacy-footer" />}
      legacyHeader={<div data-testid="legacy-header" />}
      legacyPrelude={<div data-testid="legacy-prelude" />}
      storyFooter={<div data-testid="story-footer" />}
      storyHeader={<div data-testid="story-header" />}
      storyVisualLabEnabled
    >
      <main id="main-content">Conteúdo</main>
    </RouteAwareExperienceBoundary>,
  );
}

describe("RouteAwareExperienceBoundary", () => {
  beforeEach(() => {
    navigationState.pathname = "/";
  });

  it("preserves the complete legacy shell on public routes", () => {
    renderBoundary();

    expect(screen.getByTestId("legacy-shell")).toBeInTheDocument();
    expect(screen.getByTestId("legacy-prelude")).toBeInTheDocument();
    expect(screen.getByTestId("legacy-header")).toBeInTheDocument();
    expect(screen.getByTestId("legacy-footer")).toBeInTheDocument();
    expect(screen.queryByTestId("story-header")).not.toBeInTheDocument();
    expect(screen.queryByTestId("story-footer")).not.toBeInTheDocument();
  });

  it("uses the isolated static chrome throughout the story lab subtree", () => {
    navigationState.pathname = "/__visual-lab/story";
    const { rerender } = renderBoundary();

    expect(screen.getByTestId("story-header")).toBeInTheDocument();
    expect(screen.getByTestId("story-footer")).toBeInTheDocument();
    expect(screen.queryByTestId("legacy-shell")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Pular para o conteúdo principal" }),
    ).toHaveAttribute("href", "#main-content");

    navigationState.pathname = "/__visual-lab/story/nested-fixture";
    rerender(
      <RouteAwareExperienceBoundary
        legacyFooter={<div data-testid="legacy-footer" />}
        legacyHeader={<div data-testid="legacy-header" />}
        storyFooter={<div data-testid="story-footer" />}
        storyHeader={<div data-testid="story-header" />}
        storyVisualLabEnabled
      >
        <main id="main-content">Conteúdo</main>
      </RouteAwareExperienceBoundary>,
    );

    expect(screen.getByTestId("story-header")).toBeInTheDocument();
    expect(screen.queryByTestId("legacy-shell")).not.toBeInTheDocument();
  });

  it("lets the immersive story terminal own the only footer conclusion", () => {
    navigationState.pathname = "/__visual-lab/story/motion";
    renderBoundary();

    expect(screen.getByTestId("story-header")).toBeInTheDocument();
    expect(screen.queryByTestId("story-footer")).not.toBeInTheDocument();
    expect(screen.queryByTestId("legacy-footer")).not.toBeInTheDocument();
  });

  it("fails closed to the ordinary shell when the story lab is disabled", () => {
    navigationState.pathname = "/__visual-lab/story";
    render(
      <RouteAwareExperienceBoundary
        legacyFooter={<div data-testid="legacy-footer" />}
        legacyHeader={<div data-testid="legacy-header" />}
        storyFooter={<div data-testid="story-footer" />}
        storyHeader={<div data-testid="story-header" />}
      >
        <main id="main-content">Conteúdo</main>
      </RouteAwareExperienceBoundary>,
    );

    expect(screen.getByTestId("legacy-shell")).toBeInTheDocument();
    expect(screen.queryByTestId("story-header")).not.toBeInTheDocument();
    expect(screen.queryByTestId("story-footer")).not.toBeInTheDocument();
  });
});
