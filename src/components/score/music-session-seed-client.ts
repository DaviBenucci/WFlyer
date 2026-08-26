import {
  resolveSessionSeed,
  WFLYER_MUSIC_SESSION_SEED_KEY,
} from "@/lib/music/composer/session-seed";

/** Browser adapter kept outside the pure composer boundary. */
export function getBrowserMusicSessionSeed(explicitSeed?: string): string {
  if (explicitSeed !== undefined) {
    return resolveSessionSeed({ explicitSeed });
  }

  return resolveSessionSeed({
    randomSource: globalThis.crypto,
    storage: globalThis.sessionStorage,
    storageKey: WFLYER_MUSIC_SESSION_SEED_KEY,
  });
}
