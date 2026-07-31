import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LocalRevealController } from "./LocalRevealController";

const gsapMocks = vi.hoisted(() => ({
  set: vi.fn(),
  to: vi.fn(),
}));

vi.mock("gsap", () => ({
  default: {
    registerPlugin: vi.fn(),
    set: gsapMocks.set,
    to: gsapMocks.to,
  },
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/sobre",
}));

vi.mock("@gsap/react", async () => {
  const { useEffect } = await import("react");
  return {
    useGSAP: Object.assign(
      (callback: () => void | (() => void)) => useEffect(callback, [callback]),
      { register: vi.fn() },
    ),
  };
});

class ObserverStub {
  static latest: ObserverStub | null = null;

  readonly disconnect = vi.fn();
  readonly observe = vi.fn();
  readonly unobserve = vi.fn();

  constructor(
    readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {
    ObserverStub.latest = this;
  }
}

describe("LocalRevealController", () => {
  beforeEach(() => {
    gsapMocks.set.mockClear();
    gsapMocks.to.mockClear();
    ObserverStub.latest = null;
    vi.stubGlobal("IntersectionObserver", ObserverStub);
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: false })),
    );
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      bottom: 940,
      height: 40,
      left: 0,
      right: 200,
      toJSON: () => undefined,
      top: 900,
      width: 200,
      x: 0,
      y: 900,
    });
    vi.spyOn(SVGElement.prototype, "getBoundingClientRect").mockReturnValue({
      bottom: 940,
      height: 40,
      left: 0,
      right: 200,
      toJSON: () => undefined,
      top: 900,
      width: 200,
      x: 0,
      y: 900,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("reveals an approved offscreen target once and clears temporary styles", () => {
    const { unmount } = render(
      <>
        <ul data-benefits-grid="">
          <li>Benefício</li>
        </ul>
        <LocalRevealController />
      </>,
    );
    const item = document.querySelector("li")!;
    const observer = ObserverStub.latest!;

    expect(observer.observe).toHaveBeenCalledWith(item);
    expect(gsapMocks.set).toHaveBeenCalledWith(item, {
      opacity: 0,
      willChange: "transform,opacity",
      y: 24,
    });

    observer.callback(
      [
        { isIntersecting: true, target: item } as unknown as IntersectionObserverEntry,
      ],
      observer as unknown as IntersectionObserver,
    );

    expect(observer.unobserve).toHaveBeenCalledWith(item);
    expect(gsapMocks.to).toHaveBeenCalledWith(
      item,
      expect.objectContaining({
        clearProps: "opacity,transform,will-change",
        duration: 0.55,
        opacity: 1,
        y: 0,
      }),
    );

    unmount();
    expect(observer.disconnect).toHaveBeenCalledOnce();
    expect(gsapMocks.set).toHaveBeenLastCalledWith([item], {
      clearProps: "opacity,transform,will-change",
    });
  });

  it("keeps direct final states when reduced motion is requested", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: true })),
    );

    render(
      <>
        <ul data-feature-strip="">
          <li>Recurso</li>
        </ul>
        <LocalRevealController />
      </>,
    );

    expect(ObserverStub.latest).toBeNull();
    expect(gsapMocks.set).not.toHaveBeenCalled();
  });

  it("reveals score notes through opacity without replacing SVG transforms", () => {
    render(
      <>
        <svg data-score-placement="hero">
          <g data-musical-note="" transform="translate(10 20)" />
        </svg>
        <LocalRevealController />
      </>,
    );
    const note = document.querySelector("[data-musical-note]")!;
    const observer = ObserverStub.latest!;

    expect(gsapMocks.set).toHaveBeenCalledWith(note, {
      opacity: 0,
      willChange: "opacity",
    });
    observer.callback(
      [
        { isIntersecting: true, target: note } as unknown as IntersectionObserverEntry,
      ],
      observer as unknown as IntersectionObserver,
    );

    expect(gsapMocks.to).toHaveBeenCalledWith(
      note,
      expect.not.objectContaining({ y: expect.anything() }),
    );
    expect(note).toHaveAttribute("transform", "translate(10 20)");
  });
});
