import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  BRAND_INTRO_LABELS,
  BRAND_INTRO_SESSION_KEY,
  BrandIntroController,
} from "./BrandIntroController";

vi.mock("@gsap/react", () => ({
  useGSAP: Object.assign(() => undefined, { register: () => undefined }),
}));

vi.mock("gsap", () => ({
  default: { registerPlugin: () => undefined },
}));

describe("BrandIntroController", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise<Response>(() => undefined)),
    );
    sessionStorage.clear();
  });

  afterEach(() => {
    document.documentElement.removeAttribute("data-brand-intro-active");
    document.body.style.removeProperty("overflow");
    vi.clearAllTimers();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("preserves every normative label and total duration", () => {
    expect(BRAND_INTRO_LABELS).toEqual({
      "hero:ready": 5.6,
      "hero:start": 4.25,
      "intro:breath": 2.1,
      "intro:expand": 0.7,
      "intro:handoff": 4.05,
      "intro:hold": 3.3,
      "intro:lock": 1.5,
      "intro:overlay-off": 4.85,
      "intro:seed": 0.3,
      "intro:start": 0,
      "intro:wordmark": 2.5,
    });
  });

  it("mounts only after eligibility and releases safely through the skip button", () => {
    render(<BrandIntroController />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();

    act(() => vi.advanceTimersByTime(0));
    expect(
      screen.getByRole("button", { name: "Pular introdução" }),
    ).toBeVisible();
    expect(document.documentElement).toHaveAttribute(
      "data-brand-intro-active",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: "Pular introdução" }));
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(sessionStorage.getItem(BRAND_INTRO_SESSION_KEY)).toBe("1");
    expect(document.documentElement).not.toHaveAttribute(
      "data-brand-intro-active",
    );
  });

  it("does not replay a completed session and leaves scroll unlocked", () => {
    sessionStorage.setItem(BRAND_INTRO_SESSION_KEY, "1");
    render(<BrandIntroController />);

    act(() => vi.advanceTimersByTime(0));

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });

  it("keeps ordinary automated routes intro-free in test mode", () => {
    render(<BrandIntroController testMode />);
    act(() => vi.advanceTimersByTime(0));
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("fails open at the hard deadline and records completion", () => {
    render(<BrandIntroController />);
    act(() => vi.advanceTimersByTime(0));

    expect(screen.getByRole("button")).toBeVisible();
    act(() => vi.advanceTimersByTime(7_000));

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(sessionStorage.getItem(BRAND_INTRO_SESSION_KEY)).toBe("1");
    expect(document.body.style.overflow).toBe("");
  });

  it("releases page locks when unmounted during the opening", () => {
    const { unmount } = render(<BrandIntroController />);
    act(() => vi.advanceTimersByTime(0));
    expect(document.body.style.overflow).toBe("hidden");

    unmount();

    expect(document.body.style.overflow).toBe("");
    expect(document.documentElement).not.toHaveAttribute(
      "data-brand-intro-active",
    );
  });
});
