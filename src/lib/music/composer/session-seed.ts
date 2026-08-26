import { ComposerConfigurationError, COMPOSER_VERSION } from "./types";

export const WFLYER_MUSIC_SESSION_SEED_KEY =
  `wflyer.music.composer.v${COMPOSER_VERSION}.session-seed` as const;

const GENERATED_SESSION_SEED_PATTERN = /^wfms1-[0-9a-f]{32}$/u;

export interface SessionSeedStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface SecureRandomSource {
  getRandomValues(values: Uint32Array): Uint32Array;
}

export interface ResolveSessionSeedOptions {
  readonly explicitSeed?: string;
  readonly storage?: SessionSeedStorage;
  readonly randomSource?: SecureRandomSource;
  readonly storageKey?: string;
}

export class SessionSeedUnavailableError extends Error {
  readonly code = "SESSION_SEED_UNAVAILABLE" as const;

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "SessionSeedUnavailableError";
  }
}

function assertNonEmptySeed(seed: string): string {
  if (seed.trim().length === 0) {
    throw new ComposerConfigurationError("Explicit session seeds cannot be empty.");
  }

  return seed;
}

export function createSecureSessionSeed(
  randomSource: SecureRandomSource,
): string {
  const values = new Uint32Array(4);
  randomSource.getRandomValues(values);

  const hexadecimal = Array.from(values, (value) =>
    value.toString(16).padStart(8, "0"),
  ).join("");

  return `wfms1-${hexadecimal}`;
}

export function resolveSessionSeed(options: ResolveSessionSeedOptions): string {
  if (options.explicitSeed !== undefined) {
    return assertNonEmptySeed(options.explicitSeed);
  }

  if (!options.storage || !options.randomSource) {
    throw new SessionSeedUnavailableError(
      "Stored production session seeds require injected storage and a secure random source.",
    );
  }

  const storageKey = options.storageKey ?? WFLYER_MUSIC_SESSION_SEED_KEY;
  let storedSeed: string | null;

  try {
    storedSeed = options.storage.getItem(storageKey);
  } catch (error) {
    throw new SessionSeedUnavailableError(
      "The production session seed could not be read from session storage.",
      { cause: error },
    );
  }

  if (storedSeed && GENERATED_SESSION_SEED_PATTERN.test(storedSeed)) {
    return storedSeed;
  }

  const generatedSeed = createSecureSessionSeed(options.randomSource);

  try {
    options.storage.setItem(storageKey, generatedSeed);
  } catch (error) {
    throw new SessionSeedUnavailableError(
      "The production session seed could not be persisted to session storage.",
      { cause: error },
    );
  }

  return generatedSeed;
}
