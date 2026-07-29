interface VitestWorkerState {
  filepath?: string;
}

const vitestGlobal = globalThis as typeof globalThis & {
  __vitest_worker__?: VitestWorkerState;
};
const workerFilepath = vitestGlobal.__vitest_worker__?.filepath;

if (workerFilepath) {
  try {
    // Storybook 10.5 decodes spaces but not non-ASCII path segments in its
    // generated test guard. Canonicalizing the worker path keeps stories
    // executable when the repository lives under "Área de trabalho".
    vitestGlobal.__vitest_worker__.filepath = encodeURI(decodeURI(workerFilepath)).replaceAll(
      "%20",
      " ",
    );
  } catch {
    // A malformed external path must not prevent the test environment boot.
  }
}
