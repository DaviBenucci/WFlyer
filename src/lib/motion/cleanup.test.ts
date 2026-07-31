import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createCleanupRegistry,
  onceCleanup,
  scheduleRecoveryTimeout,
} from "./cleanup";
import { NAVIGATION_TIMING_MS } from "./timing";

afterEach(() => {
  vi.useRealTimers();
});

describe("onceCleanup", () => {
  it("invokes cleanup exactly once", () => {
    const cleanup = vi.fn();
    const once = onceCleanup(cleanup);

    once();
    once();

    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});

describe("createCleanupRegistry", () => {
  it("flushes every registered callback once", () => {
    const first = vi.fn();
    const second = vi.fn();
    const registry = createCleanupRegistry();

    registry.add(first);
    const disposeSecond = registry.add(second);
    expect(registry.size()).toBe(2);

    disposeSecond();
    disposeSecond();
    expect(registry.size()).toBe(1);

    registry.flush();
    registry.flush();

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
    expect(registry.size()).toBe(0);
    expect(registry.flushed()).toBe(true);
  });

  it("immediately cleans a resource registered after flush", () => {
    const cleanup = vi.fn();
    const registry = createCleanupRegistry();

    registry.flush();
    registry.add(cleanup);
    registry.add(cleanup)();

    expect(cleanup).toHaveBeenCalledTimes(2);
    expect(registry.size()).toBe(0);
  });

  it("runs all callbacks before surfacing cleanup errors", () => {
    const survivingCleanup = vi.fn();
    const registry = createCleanupRegistry();

    registry.add(() => {
      throw new Error("timeline cleanup failed");
    });
    registry.add(survivingCleanup);

    expect(() => registry.flush()).toThrow(AggregateError);
    expect(survivingCleanup).toHaveBeenCalledOnce();
    expect(registry.size()).toBe(0);
  });
});

describe("scheduleRecoveryTimeout", () => {
  it("fires at the 1,100 ms safety deadline", () => {
    vi.useFakeTimers();
    const onTimeout = vi.fn();

    scheduleRecoveryTimeout(onTimeout);
    vi.advanceTimersByTime(NAVIGATION_TIMING_MS.recovery - 1);
    expect(onTimeout).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(onTimeout).toHaveBeenCalledOnce();
  });

  it("can be canceled repeatedly without leaving a live timer", () => {
    vi.useFakeTimers();
    const onTimeout = vi.fn();
    const cancel = scheduleRecoveryTimeout(onTimeout);

    cancel();
    cancel();
    vi.runAllTimers();

    expect(onTimeout).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });
});
