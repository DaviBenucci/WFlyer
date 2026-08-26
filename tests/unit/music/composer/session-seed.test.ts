import { describe, expect, it, vi } from "vitest";

import {
  createSecureSessionSeed,
  resolveSessionSeed,
  SessionSeedUnavailableError,
  WFLYER_MUSIC_SESSION_SEED_KEY,
  type SecureRandomSource,
  type SessionSeedStorage,
} from "@/lib/music/composer/session-seed";

function fixedRandomSource(): SecureRandomSource {
  return {
    getRandomValues(values) {
      values.set([1, 0x00ab_cdef, 0xffff_ffff, 0]);
      return values;
    },
  };
}

function memoryStorage(
  initial: Readonly<Record<string, string>> = {},
): SessionSeedStorage & { readonly values: Map<string, string> } {
  const values = new Map(Object.entries(initial));

  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

describe("session seed lifecycle", () => {
  it("formats 128 bits supplied by the injected secure entropy source", () => {
    expect(createSecureSessionSeed(fixedRandomSource())).toBe(
      "wfms1-0000000100abcdefffffffff00000000",
    );
  });

  it("returns an explicit dev/test seed without reading production adapters", () => {
    const storage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
    } satisfies SessionSeedStorage;
    const randomSource = {
      getRandomValues: vi.fn(),
    } satisfies SecureRandomSource;

    expect(
      resolveSessionSeed({ explicitSeed: "visual-lab-seed", storage, randomSource }),
    ).toBe("visual-lab-seed");
    expect(storage.getItem).not.toHaveBeenCalled();
    expect(randomSource.getRandomValues).not.toHaveBeenCalled();
  });

  it("reuses a valid versioned stored seed", () => {
    const stored = "wfms1-0123456789abcdef0123456789abcdef";
    const storage = memoryStorage({ [WFLYER_MUSIC_SESSION_SEED_KEY]: stored });
    const randomSource = {
      getRandomValues: vi.fn(),
    } satisfies SecureRandomSource;

    expect(resolveSessionSeed({ storage, randomSource })).toBe(stored);
    expect(randomSource.getRandomValues).not.toHaveBeenCalled();
  });

  it("replaces malformed stored data and persists the generated seed", () => {
    const storage = memoryStorage({
      [WFLYER_MUSIC_SESSION_SEED_KEY]: "malformed",
    });

    const seed = resolveSessionSeed({ storage, randomSource: fixedRandomSource() });

    expect(seed).toBe("wfms1-0000000100abcdefffffffff00000000");
    expect(storage.values.get(WFLYER_MUSIC_SESSION_SEED_KEY)).toBe(seed);
  });

  it("requires explicit production adapters and surfaces storage failures", () => {
    expect(() => resolveSessionSeed({})).toThrow(SessionSeedUnavailableError);
    expect(() =>
      resolveSessionSeed({
        storage: {
          getItem() {
            throw new Error("denied");
          },
          setItem() {},
        },
        randomSource: fixedRandomSource(),
      }),
    ).toThrow(/could not be read/u);
  });
});
