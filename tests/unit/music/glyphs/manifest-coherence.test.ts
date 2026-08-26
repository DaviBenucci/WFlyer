import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { APPROVED_DOWN_FLAG_TRANSFORM } from "@/lib/music/glyphs/metrics";
import { MUSIC_GLYPH_REGISTRY } from "@/lib/music/glyphs/registry";

interface VisualLibraryManifest {
  readonly assets: readonly {
    readonly assetKey: string;
    readonly metrics: unknown;
    readonly requiredAnchors: unknown;
    readonly runtimeStatus: unknown;
    readonly sha256: unknown;
  }[];
  readonly runtimeCalibrationApproval?: {
    readonly downFlagTransform?: unknown;
    readonly status?: unknown;
  };
}

function readManifest(): VisualLibraryManifest {
  const path = resolve(
    process.cwd(),
    "docs/design-reference/visual-library/manifest.json",
  );

  return JSON.parse(readFileSync(path, "utf8")) as VisualLibraryManifest;
}

describe("glyph runtime registry and canonical manifest coherence", () => {
  it("keeps all eight approved metrics, anchors, and checksum traces exact", () => {
    const manifest = readManifest();
    const manifestByKey = new Map(
      manifest.assets.map((asset) => [asset.assetKey, asset]),
    );

    expect(manifest.assets).toHaveLength(8);
    expect(manifestByKey.size).toBe(8);

    for (const registryEntry of MUSIC_GLYPH_REGISTRY) {
      const manifestEntry = manifestByKey.get(registryEntry.assetKey);

      expect(manifestEntry, registryEntry.assetKey).toBeDefined();
      expect(manifestEntry?.runtimeStatus, registryEntry.assetKey).toBe(
        "approved",
      );
      expect(manifestEntry?.metrics, registryEntry.assetKey).toEqual(
        registryEntry.metrics,
      );
      expect(manifestEntry?.requiredAnchors, registryEntry.assetKey).toEqual(
        registryEntry.requiredAnchors,
      );
      expect(manifestEntry?.sha256, registryEntry.assetKey).toEqual(
        registryEntry.sha256,
      );
    }
  });

  it("keeps the manifest approval and down-flag transform synchronized", () => {
    const approval = readManifest().runtimeCalibrationApproval;

    expect(approval?.status).toBe("approved");
    expect(approval?.downFlagTransform).toEqual(
      APPROVED_DOWN_FLAG_TRANSFORM,
    );
  });
});
