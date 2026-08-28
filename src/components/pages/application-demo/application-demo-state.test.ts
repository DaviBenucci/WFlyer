import { describe, expect, it } from "vitest";

import {
  APPLICATION_DEMO_STATES,
  createApplicationDemoInitialState,
  reduceApplicationDemoState,
} from "./application-demo-state";

describe("APP-04 canonical state reducer", () => {
  it("exposes only the five approved state names", () => {
    expect(APPLICATION_DEMO_STATES).toEqual([
      "NOT_STARTED",
      "PLAYING",
      "FINAL_FRAME",
      "ERROR_STATIC",
      "REDUCED_STATIC",
    ]);
  });

  it("starts with NOT_STARTED only when all four media slots exist", () => {
    expect(createApplicationDemoInitialState(true)).toBe("NOT_STARTED");
    expect(createApplicationDemoInitialState(false)).toBe("ERROR_STATIC");
  });

  it("runs the active, ended, and explicit replay cycle", () => {
    const playing = reduceApplicationDemoState("NOT_STARTED", {
      type: "ACTIVE_CHAPTER_REACHED",
    });
    const finalFrame = reduceApplicationDemoState(playing, {
      type: "MEDIA_ENDED",
    });

    expect(playing).toBe("PLAYING");
    expect(finalFrame).toBe("FINAL_FRAME");
    expect(
      reduceApplicationDemoState(finalFrame, {
        type: "REPLAY_REQUESTED",
      }),
    ).toBe("PLAYING");
  });

  it("does not restart a completed run merely because the chapter is active again", () => {
    expect(
      reduceApplicationDemoState("FINAL_FRAME", {
        type: "ACTIVE_CHAPTER_REACHED",
      }),
    ).toBe("FINAL_FRAME");
  });

  it("uses REDUCED_STATIC until replay is explicitly requested", () => {
    const reduced = reduceApplicationDemoState("NOT_STARTED", {
      type: "REDUCED_MOTION_INITIAL",
    });

    expect(reduced).toBe("REDUCED_STATIC");
    expect(
      reduceApplicationDemoState(reduced, {
        type: "ACTIVE_CHAPTER_REACHED",
      }),
    ).toBe("REDUCED_STATIC");
    expect(
      reduceApplicationDemoState(reduced, { type: "REPLAY_REQUESTED" }),
    ).toBe("PLAYING");
    expect(
      reduceApplicationDemoState("NOT_STARTED", {
        type: "REPLAY_REQUESTED",
      }),
    ).toBe("PLAYING");
  });

  it("routes every media failure to a recoverable static state", () => {
    for (const state of APPLICATION_DEMO_STATES) {
      expect(
        reduceApplicationDemoState(state, { type: "MEDIA_FAILED" }),
      ).toBe("ERROR_STATIC");
    }
    expect(
      reduceApplicationDemoState("ERROR_STATIC", {
        type: "REPLAY_REQUESTED",
      }),
    ).toBe("PLAYING");
  });
});
