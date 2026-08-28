import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  ApplicationDemoDevice,
  type ApplicationDemoMediaContract,
} from "./ApplicationDemoDevice";

const MEDIA: ApplicationDemoMediaContract = {
  finalFrameSrc: "/phase-8-contract/final.webp",
  mp4Src: "/phase-8-contract/demo.mp4",
  posterSrc: "/phase-8-contract/poster.webp",
  webmSrc: "/phase-8-contract/demo.webm",
};

function setDocumentHidden(hidden: boolean): void {
  Object.defineProperty(document, "hidden", {
    configurable: true,
    value: hidden,
  });
}

describe("ApplicationDemoDevice", () => {
  const play = vi.fn<() => Promise<void>>();
  const pause = vi.fn<() => void>();

  beforeEach(() => {
    play.mockReset();
    pause.mockReset();
    play.mockResolvedValue(undefined);
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation(
        (query: string) =>
          ({
            addEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
            matches: false,
            media: query,
            onchange: null,
            removeEventListener: vi.fn(),
          }) as unknown as MediaQueryList,
      ),
    );
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(play);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(pause);
    setDocumentHidden(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    setDocumentHidden(false);
  });

  it("does not play from mount, preload, refresh, or proximity", async () => {
    render(<ApplicationDemoDevice isActive={false} media={MEDIA} />);

    await waitFor(() => {
      expect(screen.getByRole("figure")).toHaveAttribute(
        "data-app04-state",
        "NOT_STARTED",
      );
    });
    expect(play).not.toHaveBeenCalled();
    expect(screen.getByRole("figure")).toHaveAttribute(
      "data-app04-media-contract",
      "complete",
    );
  });

  it("starts on first active entry, pauses outside, and resumes unfinished playback", async () => {
    const { rerender } = render(
      <ApplicationDemoDevice isActive={false} media={MEDIA} />,
    );

    rerender(<ApplicationDemoDevice isActive media={MEDIA} />);
    await waitFor(() => expect(play).toHaveBeenCalledTimes(1));
    expect(screen.getByRole("figure")).toHaveAttribute(
      "data-app04-state",
      "PLAYING",
    );

    rerender(<ApplicationDemoDevice isActive={false} media={MEDIA} />);
    await waitFor(() => expect(pause).toHaveBeenCalled());
    expect(screen.getByRole("figure")).toHaveAttribute(
      "data-app04-state",
      "PLAYING",
    );

    rerender(<ApplicationDemoDevice isActive media={MEDIA} />);
    await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
  });

  it("shows the exact final-frame slot and replays from zero", async () => {
    render(<ApplicationDemoDevice isActive media={MEDIA} />);
    await waitFor(() => expect(play).toHaveBeenCalledTimes(1));

    const video = document.querySelector("video");
    expect(video).not.toBeNull();
    fireEvent.ended(video!);

    const finalFrame = document.querySelector<HTMLImageElement>(
      '[data-app04-static-media="final-frame"]',
    );
    expect(finalFrame?.src).toBe(
      new URL(MEDIA.finalFrameSrc, window.location.href).href,
    );
    expect(screen.getByRole("figure")).toHaveAttribute(
      "data-app04-state",
      "FINAL_FRAME",
    );

    Object.defineProperty(video, "currentTime", {
      configurable: true,
      writable: true,
      value: 8,
    });
    fireEvent.click(
      screen.getByRole("button", {
        name: "Reproduzir demonstração novamente",
      }),
    );

    await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
    expect(video?.currentTime).toBe(0);
    expect(
      document.querySelector('[data-app04-static-media="final-frame"]'),
    ).toBeNull();
    expect(screen.getByRole("figure")).toHaveAttribute(
      "data-app04-state",
      "PLAYING",
    );
  });

  it("keeps FINAL_FRAME when the completed chapter is left and revisited", async () => {
    const { rerender } = render(
      <ApplicationDemoDevice isActive media={MEDIA} />,
    );
    await waitFor(() => expect(play).toHaveBeenCalledTimes(1));
    fireEvent.ended(document.querySelector("video")!);

    rerender(<ApplicationDemoDevice isActive={false} media={MEDIA} />);
    rerender(<ApplicationDemoDevice isActive media={MEDIA} />);

    expect(screen.getByRole("figure")).toHaveAttribute(
      "data-app04-state",
      "FINAL_FRAME",
    );
    expect(play).toHaveBeenCalledTimes(1);
  });

  it("falls back deterministically when final assets are not supplied", async () => {
    render(<ApplicationDemoDevice isActive />);

    await waitFor(() => {
      expect(screen.getByRole("figure")).toHaveAttribute(
        "data-app04-state",
        "ERROR_STATIC",
      );
    });
    expect(
      document.querySelector("[data-app04-deterministic-fallback]"),
    ).toHaveTextContent(/aguardam fornecimento e aprovação humana/u);
    expect(document.querySelector("video")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(play).not.toHaveBeenCalled();
  });

  it("turns play rejection and media errors into a navigable static state", async () => {
    play.mockRejectedValueOnce(new DOMException("Denied", "NotAllowedError"));
    render(<ApplicationDemoDevice isActive media={MEDIA} />);

    await waitFor(() => {
      expect(screen.getByRole("figure")).toHaveAttribute(
        "data-app04-state",
        "ERROR_STATIC",
      );
    });
    expect(
      screen.getByRole("button", { name: "Reproduzir demonstração" }),
    ).toBeEnabled();

    fireEvent.error(document.querySelector("video")!);
    expect(screen.getByRole("figure")).toHaveAttribute(
      "data-app04-state",
      "ERROR_STATIC",
    );
  });

  it("never autoplays for reduced motion but honors explicit replay", async () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation(
        (query: string) =>
          ({
            addEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
            matches: query.includes("prefers-reduced-motion"),
            media: query,
            onchange: null,
            removeEventListener: vi.fn(),
          }) as unknown as MediaQueryList,
      ),
    );
    render(<ApplicationDemoDevice isActive media={MEDIA} />);

    await waitFor(() => {
      expect(screen.getByRole("figure")).toHaveAttribute(
        "data-app04-state",
        "REDUCED_STATIC",
      );
    });
    expect(play).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", { name: "Reproduzir demonstração" }),
    );
    await waitFor(() => expect(play).toHaveBeenCalledTimes(1));
    expect(screen.getByRole("figure")).toHaveAttribute(
      "data-app04-state",
      "PLAYING",
    );
  });

  it("waits for a visible document and pauses on a hidden tab", async () => {
    setDocumentHidden(true);
    render(<ApplicationDemoDevice isActive media={MEDIA} />);

    await act(async () => undefined);
    expect(play).not.toHaveBeenCalled();
    expect(screen.getByRole("figure")).toHaveAttribute(
      "data-app04-state",
      "NOT_STARTED",
    );

    setDocumentHidden(false);
    fireEvent(document, new Event("visibilitychange"));
    await waitFor(() => expect(play).toHaveBeenCalledTimes(1));

    setDocumentHidden(true);
    fireEvent(document, new Event("visibilitychange"));
    await waitFor(() => expect(pause).toHaveBeenCalled());
  });

  it("owns listener and media cleanup and exposes no simulated UI controls", async () => {
    const addEventListener = vi.spyOn(document, "addEventListener");
    const removeEventListener = vi.spyOn(document, "removeEventListener");
    const { unmount } = render(
      <ApplicationDemoDevice isActive={false} media={MEDIA} />,
    );

    await waitFor(() => {
      expect(addEventListener).toHaveBeenCalledWith(
        "visibilitychange",
        expect.any(Function),
      );
    });
    const screenSurface = document.querySelector("[data-app04-screen]");
    expect(
      screenSurface?.querySelectorAll(
        "a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])",
      ),
    ).toHaveLength(0);

    unmount();
    expect(removeEventListener).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function),
    );
    expect(pause).toHaveBeenCalled();
  });
});
