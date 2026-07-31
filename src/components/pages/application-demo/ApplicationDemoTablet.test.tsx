import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApplicationDemoTablet } from "./ApplicationDemoTablet";

vi.mock("@gsap/react", () => ({
  useGSAP: Object.assign(() => undefined, { register: () => undefined }),
}));

vi.mock("gsap", () => ({
  default: {
    registerPlugin: () => undefined,
  },
}));

describe("ApplicationDemoTablet", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        addEventListener: vi.fn(),
        matches: query.includes("prefers-reduced-motion") ? false : true,
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
      })),
    );
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("exposes the four native labelled controls and honest local disclosure", () => {
    render(<ApplicationDemoTablet />);

    expect(screen.getByLabelText("Instrumento de origem")).toHaveValue(
      "piano",
    );
    expect(screen.getByLabelText("Tom de origem")).toHaveValue("c-major");
    expect(screen.getByLabelText("Instrumento de destino")).toHaveValue(
      "trumpet-bb",
    );
    expect(screen.getByLabelText("Tom de destino")).toHaveValue(
      "bb-major",
    );
    expect(screen.getByRole("button", { name: "Transpor" })).toBeEnabled();
    expect(screen.getByText(/sem envio de arquivos, rede/u)).toBeVisible();
    expect(screen.getByRole("img")).toHaveAttribute(
      "data-demo-score",
      "initial",
    );
  });

  it("moves from configured through processing to one deterministic result", () => {
    render(<ApplicationDemoTablet />);

    fireEvent.change(screen.getByLabelText("Tom de destino"), {
      target: { value: "g-major" },
    });
    expect(screen.getByRole("figure")).toHaveAttribute(
      "data-demo-state",
      "configured",
    );

    fireEvent.click(screen.getByRole("button", { name: "Transpor" }));
    expect(screen.getByRole("form")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("button", { name: "Preparando…" })).toBeDisabled();

    act(() => vi.advanceTimersByTime(650));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Demonstração ilustrativa pronta: Trompete em Si bemol, Sol maior (G).",
    );
    expect(screen.getByRole("img")).toHaveAttribute(
      "data-demo-score",
      "result",
    );
    expect(
      screen.getByRole("button", { name: "Restaurar demonstração" }),
    ).toBeEnabled();
  });

  it("restores every field and cancels pending processing on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
    const { unmount } = render(<ApplicationDemoTablet />);

    fireEvent.change(screen.getByLabelText("Instrumento de origem"), {
      target: { value: "violin" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Transpor" }));
    act(() => vi.advanceTimersByTime(650));
    fireEvent.click(
      screen.getByRole("button", { name: "Restaurar demonstração" }),
    );

    expect(screen.getByLabelText("Instrumento de origem")).toHaveValue(
      "piano",
    );
    expect(screen.getByRole("figure")).toHaveAttribute(
      "data-demo-state",
      "reset",
    );

    fireEvent.submit(screen.getByRole("form"));
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it("skips processing animation when reduced motion is requested", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        addEventListener: vi.fn(),
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
      })),
    );
    render(<ApplicationDemoTablet />);

    fireEvent.submit(screen.getByRole("form"));

    expect(screen.getByRole("figure")).toHaveAttribute(
      "data-demo-state",
      "result",
    );
    expect(screen.queryByText("Preparando…")).not.toBeInTheDocument();
  });
});
