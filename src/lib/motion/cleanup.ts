import { NAVIGATION_TIMING_MS } from "./timing";

export type CleanupCallback = () => void;

export interface CleanupRegistry {
  readonly add: (cleanup: CleanupCallback) => CleanupCallback;
  readonly flush: () => void;
  readonly size: () => number;
  readonly flushed: () => boolean;
}

export function onceCleanup(cleanup: CleanupCallback): CleanupCallback {
  let called = false;

  return () => {
    if (called) {
      return;
    }

    called = true;
    cleanup();
  };
}

/** Creates a cleanup bag whose members and flush operation are idempotent. */
export function createCleanupRegistry(): CleanupRegistry {
  const callbacks = new Set<CleanupCallback>();
  let hasFlushed = false;

  const add = (cleanup: CleanupCallback): CleanupCallback => {
    const wrappedCleanup = onceCleanup(() => {
      callbacks.delete(wrappedCleanup);
      cleanup();
    });

    if (hasFlushed) {
      wrappedCleanup();
      return wrappedCleanup;
    }

    callbacks.add(wrappedCleanup);
    return wrappedCleanup;
  };

  const flush = onceCleanup(() => {
    hasFlushed = true;
    const errors: unknown[] = [];

    for (const cleanup of [...callbacks]) {
      try {
        cleanup();
      } catch (error) {
        errors.push(error);
      }
    }

    callbacks.clear();

    if (errors.length > 0) {
      throw new AggregateError(errors, "Navigation cleanup failed.");
    }
  });

  return {
    add,
    flush,
    size: () => callbacks.size,
    flushed: () => hasFlushed,
  };
}

export function scheduleRecoveryTimeout(
  onTimeout: () => void,
  delay = NAVIGATION_TIMING_MS.recovery,
): CleanupCallback {
  let active = true;
  const timer = setTimeout(() => {
    if (!active) {
      return;
    }

    active = false;
    onTimeout();
  }, delay);

  return onceCleanup(() => {
    active = false;
    clearTimeout(timer);
  });
}
