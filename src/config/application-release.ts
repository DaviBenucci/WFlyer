import type { ApplicationAvailabilityState } from "@/lib/story";

export interface ApplicationReleaseConfiguration {
  readonly liveLabel: string;
  readonly liveUrl: "https://app.wflyer.com.br";
  readonly state: ApplicationAvailabilityState;
}

/**
 * Single typed publication seam for the future PRELAUNCH -> LIVE transition.
 * The switch is deliberately local: no user input can select a destination.
 */
export const APPLICATION_RELEASE: Readonly<ApplicationReleaseConfiguration> =
  Object.freeze({
  liveLabel: "Acessar W_Flyer",
  liveUrl: "https://app.wflyer.com.br",
  state: "PRELAUNCH",
  });
