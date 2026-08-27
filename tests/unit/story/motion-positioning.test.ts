import { describe, expect, it, vi } from "vitest";

import {
  createMotionStoryPositioningAdapter,
  type MotionStoryRuntime,
} from "@/lib/story/motion";

function createRuntime(): MotionStoryRuntime {
  return {
    destroy: vi.fn(),
    navigate: vi.fn<MotionStoryRuntime["navigate"]>(
      async (chapterId) => ({
        cancelReason: null,
        distance: 0,
        durationSeconds: 0,
        status: "no-op",
        targetChapterId: chapterId,
      }),
    ),
    position: vi.fn<MotionStoryRuntime["position"]>(
      async (chapterId) => ({
        fallbackToHome: false,
        positionedChapterId: chapterId,
        projectionMode: "horizontal-enhanced",
        requestedChapterId: chapterId,
      }),
    ),
    projectionMode: "horizontal-enhanced",
    rebuildPreservingActiveChapter: vi.fn<
      MotionStoryRuntime["rebuildPreservingActiveChapter"]
    >(async (requestedChapterId) => ({
      fallbackToHome: false,
      positionedChapterId: "professional-projects",
      projectionMode: "horizontal-enhanced",
      requestedChapterId,
    })),
    snapshot: vi.fn(() => {
      throw new Error("Not needed by this adapter test.");
    }),
  };
}

describe("Phase-4 to Phase-5 positioning handoff", () => {
  it("routes semantic destinations and viewport preservation through distinct runtime paths", async () => {
    const runtime = createRuntime();
    const adapter = createMotionStoryPositioningAdapter({
      getRuntime: () => runtime,
    });

    await adapter.position("application-benefits", {
      intent: "position-destination",
    });
    const preserved = await adapter.position("home", {
      intent: "preserve-active-chapter",
    });

    expect(runtime.position).toHaveBeenCalledWith(
      "application-benefits",
      expect.objectContaining({ intent: "position-destination" }),
    );
    expect(runtime.rebuildPreservingActiveChapter).toHaveBeenCalledWith(
      "home",
      expect.objectContaining({ intent: "preserve-active-chapter" }),
    );
    expect(preserved.positionedChapterId).toBe("professional-projects");
  });
});
