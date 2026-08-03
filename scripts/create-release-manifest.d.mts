export interface ReleaseManifestInput {
  readonly archive: string;
  readonly createdAt: string;
  readonly environment: string;
  readonly repository: string;
  readonly revision: string;
  readonly runAttempt: string;
  readonly runId: string;
  readonly runUrl: string;
  readonly sourceRef: string;
}

export interface ReleaseManifest {
  readonly schemaVersion: 1;
  readonly project: "wflyer.com.br";
  readonly repository: string;
  readonly environment: string;
  readonly revision: string;
  readonly sourceRef: string;
  readonly workflow: {
    readonly runId: string;
    readonly runAttempt: string;
    readonly url: string;
  };
  readonly createdAt: string;
  readonly artifact: {
    readonly file: string;
    readonly sha256: string;
  };
  readonly deployment: {
    readonly performed: false;
    readonly target: "Napoleon Node.js application";
    readonly handoff: "pending documented integration";
  };
}

export function createReleaseManifest(
  input: ReleaseManifestInput,
  checksumFile: string,
): ReleaseManifest;

export function writeReleaseManifestFromEnvironment(
  environment: NodeJS.ProcessEnv,
): Promise<string>;
