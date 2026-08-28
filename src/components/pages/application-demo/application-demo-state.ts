export const APPLICATION_DEMO_STATES = [
  "NOT_STARTED",
  "PLAYING",
  "FINAL_FRAME",
  "ERROR_STATIC",
  "REDUCED_STATIC",
] as const;

export type ApplicationDemoState = (typeof APPLICATION_DEMO_STATES)[number];

export type ApplicationDemoEvent =
  | { readonly type: "ACTIVE_CHAPTER_REACHED" }
  | { readonly type: "MEDIA_ENDED" }
  | { readonly type: "MEDIA_FAILED" }
  | { readonly type: "REDUCED_MOTION_INITIAL" }
  | { readonly type: "REPLAY_REQUESTED" };

export function createApplicationDemoInitialState(
  hasCompleteMediaContract: boolean,
): ApplicationDemoState {
  return hasCompleteMediaContract ? "NOT_STARTED" : "ERROR_STATIC";
}

/**
 * Pure APP-04 transition authority. Activity and document visibility pause the
 * owned media element without inventing a PAUSED state outside the canonical
 * five-state contract.
 */
export function reduceApplicationDemoState(
  state: ApplicationDemoState,
  event: ApplicationDemoEvent,
): ApplicationDemoState {
  switch (event.type) {
    case "ACTIVE_CHAPTER_REACHED":
      return state === "NOT_STARTED" ? "PLAYING" : state;
    case "MEDIA_ENDED":
      return state === "PLAYING" ? "FINAL_FRAME" : state;
    case "MEDIA_FAILED":
      return "ERROR_STATIC";
    case "REDUCED_MOTION_INITIAL":
      return state === "NOT_STARTED" ? "REDUCED_STATIC" : state;
    case "REPLAY_REQUESTED":
      return state === "NOT_STARTED" ||
        state === "FINAL_FRAME" ||
        state === "ERROR_STATIC" ||
        state === "REDUCED_STATIC"
        ? "PLAYING"
        : state;
  }
}
