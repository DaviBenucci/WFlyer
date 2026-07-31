"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import styles from "./application-demo-tablet.module.css";

gsap.registerPlugin(useGSAP);

export type DemoState =
  | "idle"
  | "configured"
  | "processing"
  | "result"
  | "reset";

type DemoSelections = {
  originInstrument: string;
  originKey: string;
  destinationInstrument: string;
  destinationKey: string;
};

export type ApplicationDemoTabletProps = {
  readonly initialState?: Exclude<DemoState, "reset">;
};

const INITIAL_SELECTIONS: DemoSelections = {
  originInstrument: "piano",
  originKey: "c-major",
  destinationInstrument: "trumpet-bb",
  destinationKey: "bb-major",
};

const INSTRUMENTS = [
  { label: "Piano", value: "piano" },
  { label: "Violino", value: "violin" },
  { label: "Clarinete em Si bemol", value: "clarinet-bb" },
  { label: "Trompete em Si bemol", value: "trumpet-bb" },
] as const;

const KEYS = [
  { label: "Dó maior (C)", value: "c-major" },
  { label: "Fá maior (F)", value: "f-major" },
  { label: "Sol maior (G)", value: "g-major" },
  { label: "Si bemol maior (Bb)", value: "bb-major" },
] as const;

const PROCESSING_DURATION_MS = 650;

function DemoScore({ result }: { readonly result: boolean }) {
  const notes = [
    { cx: 58, cy: 79 },
    { cx: 101, cy: 67 },
    { cx: 144, cy: 74 },
    { cx: 190, cy: 57 },
    { cx: 236, cy: 63 },
    { cx: 282, cy: 48 },
    { cx: 327, cy: 57 },
    { cx: 371, cy: 43 },
  ] as const;

  return (
    <svg
      aria-label={
        result
          ? "Trecho ilustrativo após a demonstração"
          : "Trecho musical ilustrativo original"
      }
      className={styles.score}
      data-demo-score={result ? "result" : "initial"}
      role="img"
      viewBox="0 0 430 150"
    >
      <title>
        {result
          ? "Amostra ilustrativa com notas destacadas"
          : "Amostra musical ilustrativa original"}
      </title>
      <g className={styles.staffLines}>
        {[42, 56, 70, 84, 98].map((y) => (
          <line key={y} x1="28" x2="405" y1={y} y2={y} />
        ))}
      </g>
      <path
        className={styles.clef}
        d="M47 102c-16-17-4-46 13-52 17-7 23 13 9 26-10 9-28 10-32-5-4-18 17-37 31-45 4 15-5 40-17 56-10 14-10 35 4 41 11 5 21-7 15-16-6-10-21-1-14 10"
      />
      <g className={styles.notes}>
        {notes.map((note, index) => (
          <g
            className={
              result && [1, 4, 6].includes(index)
                ? styles.changedNote
                : undefined
            }
            key={`${note.cx}-${note.cy}`}
          >
            <ellipse cx={note.cx} cy={note.cy} rx="7" ry="5" />
            <line
              x1={note.cx + 6}
              x2={note.cx + 6}
              y1={note.cy}
              y2={note.cy - 30}
            />
            {result && [1, 4, 6].includes(index) ? (
              <circle
                className={styles.changedMarker}
                cx={note.cx}
                cy={note.cy}
                r="12"
              />
            ) : null}
          </g>
        ))}
      </g>
      {result ? (
        <text className={styles.scoreLabel} x="404" y="126">
          variante ilustrativa
        </text>
      ) : null}
    </svg>
  );
}

function labelFor(
  options: readonly { readonly label: string; readonly value: string }[],
  value: string,
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function ApplicationDemoTablet({
  initialState = "idle",
}: ApplicationDemoTabletProps) {
  const descriptionId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLButtonElement>(null);
  const focusResultActionRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [state, setState] = useState<DemoState>(initialState);
  const [selections, setSelections] =
    useState<DemoSelections>(INITIAL_SELECTIONS);
  const resultVisible = state === "result";
  const processing = state === "processing";

  const clearProcessing = (): void => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => clearProcessing, []);

  useEffect(() => {
    if (state === "result" && focusResultActionRef.current) {
      focusResultActionRef.current = false;
      actionRef.current?.focus();
    }
  }, [state]);

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current;
      const shell = shellRef.current;

      if (!root || !shell) {
        return;
      }

      const precisePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      );
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      const mobile = window.matchMedia("(max-width: 47.999rem)");
      const tablet = window.matchMedia("(max-width: 63.999rem)");
      let inViewport = true;
      let listening = false;

      const rotateX = gsap.quickTo(shell, "rotationX", {
        duration: 0.42,
        ease: "power2.out",
      });
      const rotateY = gsap.quickTo(shell, "rotationY", {
        duration: 0.42,
        ease: "power2.out",
      });

      const resetTilt = contextSafe!((): void => {
        rotateX(0);
        rotateY(0);
        shell.style.setProperty("--wf-tablet-glare-x", "50%");
        shell.style.setProperty("--wf-tablet-glare-y", "14%");
      });

      const handlePointerMove = contextSafe!((event: PointerEvent): void => {
        const bounds = root.getBoundingClientRect();
        const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
        const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
        const limit = tablet.matches ? 3 : 6;

        rotateX(Math.max(-limit, Math.min(limit, vertical * -limit * 2)));
        rotateY(Math.max(-limit, Math.min(limit, horizontal * limit * 2)));
        shell.style.setProperty(
          "--wf-tablet-glare-x",
          `${Math.round((horizontal + 0.5) * 100)}%`,
        );
        shell.style.setProperty(
          "--wf-tablet-glare-y",
          `${Math.round((vertical + 0.5) * 100)}%`,
        );
      });

      const removePointerListeners = (): void => {
        if (!listening) {
          return;
        }

        root.removeEventListener("pointermove", handlePointerMove);
        root.removeEventListener("pointerleave", resetTilt);
        listening = false;
      };

      const syncPointerListeners = (): void => {
        const enabled =
          precisePointer.matches &&
          !reducedMotion.matches &&
          !mobile.matches &&
          inViewport;

        if (enabled && !listening) {
          root.addEventListener("pointermove", handlePointerMove);
          root.addEventListener("pointerleave", resetTilt);
          root.dataset.tiltActive = "true";
          listening = true;
        } else if (!enabled) {
          removePointerListeners();
          root.dataset.tiltActive = "false";
          resetTilt();
        }
      };

      const handleVisibility = (): void => {
        if (document.hidden) {
          resetTilt();
        }
      };
      const observer = new IntersectionObserver(([entry]) => {
        inViewport = entry?.isIntersecting ?? false;
        syncPointerListeners();
      });

      observer.observe(root);
      root.addEventListener("focusin", resetTilt);
      document.addEventListener("visibilitychange", handleVisibility);
      precisePointer.addEventListener("change", syncPointerListeners);
      reducedMotion.addEventListener("change", syncPointerListeners);
      mobile.addEventListener("change", syncPointerListeners);
      tablet.addEventListener("change", resetTilt);
      syncPointerListeners();

      return () => {
        removePointerListeners();
        observer.disconnect();
        root.removeEventListener("focusin", resetTilt);
        document.removeEventListener("visibilitychange", handleVisibility);
        precisePointer.removeEventListener("change", syncPointerListeners);
        reducedMotion.removeEventListener("change", syncPointerListeners);
        mobile.removeEventListener("change", syncPointerListeners);
        tablet.removeEventListener("change", resetTilt);
        delete root.dataset.tiltActive;
      };
    },
    { scope: rootRef },
  );

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const field = event.currentTarget.name as keyof DemoSelections;
    const { value } = event.currentTarget;
    clearProcessing();
    setSelections((current) => ({
      ...current,
      [field]: value,
    }));
    setState("configured");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    clearProcessing();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      focusResultActionRef.current = true;
      setState("result");
      return;
    }

    setState("processing");
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      focusResultActionRef.current = true;
      setState("result");
    }, PROCESSING_DURATION_MS);
  };

  const handleReset = (): void => {
    clearProcessing();
    setSelections(INITIAL_SELECTIONS);
    setState("reset");
  };

  const status = processing
    ? "Preparando a demonstração local…"
    : resultVisible
      ? `Demonstração ilustrativa pronta: ${labelFor(INSTRUMENTS, selections.destinationInstrument)}, ${labelFor(KEYS, selections.destinationKey)}.`
      : state === "configured"
        ? "Configuração alterada. Ative Transpor para ver a variante ilustrativa."
        : state === "reset"
          ? "Demonstração restaurada ao exemplo inicial."
          : "Exemplo local pronto para configurar.";

  return (
    <figure
      className={styles.demo}
      data-application-demo=""
      data-demo-state={state}
      ref={rootRef}
    >
      <div className={styles.perspective}>
        <div className={styles.shell} data-tablet-shell="" ref={shellRef}>
          <div aria-hidden="true" className={styles.camera} />
          <div className={styles.screen}>
            <header className={styles.topline}>
              <span>Prévia da experiência</span>
              <span className={styles.localBadge}>100% local</span>
            </header>
            <div className={styles.workspace}>
              <section className={styles.scorePanel}>
                <div className={styles.scoreHeading}>
                  <span>Trecho demonstrativo</span>
                  <strong>
                    {resultVisible ? "Variante visual" : "Amostra original"}
                  </strong>
                </div>
                <DemoScore result={resultVisible} />
                <p className={styles.scoreCaption}>
                  {resultVisible
                    ? "Notas marcadas indicam apenas uma mudança visual de exemplo."
                    : "Partitura original criada para esta demonstração."}
                </p>
              </section>

              <form
                aria-busy={processing}
                aria-describedby={descriptionId}
                aria-label="Demonstração de transposição"
                className={styles.controls}
                onReset={handleReset}
                onSubmit={handleSubmit}
              >
                <fieldset disabled={processing}>
                  <legend>Configurar demonstração</legend>
                  <label>
                    <span>Instrumento de origem</span>
                    <select
                      name="originInstrument"
                      onChange={handleChange}
                      value={selections.originInstrument}
                    >
                      {INSTRUMENTS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Tom de origem</span>
                    <select
                      name="originKey"
                      onChange={handleChange}
                      value={selections.originKey}
                    >
                      {KEYS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div aria-hidden="true" className={styles.directionMark}>
                    ↓
                  </div>
                  <label>
                    <span>Instrumento de destino</span>
                    <select
                      name="destinationInstrument"
                      onChange={handleChange}
                      value={selections.destinationInstrument}
                    >
                      {INSTRUMENTS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Tom de destino</span>
                    <select
                      name="destinationKey"
                      onChange={handleChange}
                      value={selections.destinationKey}
                    >
                      {KEYS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </fieldset>

                {resultVisible ? (
                  <button
                    className={styles.secondaryAction}
                    key="restore"
                    ref={actionRef}
                    type="reset"
                  >
                    Restaurar demonstração
                  </button>
                ) : (
                  <button
                    aria-busy={processing}
                    className={styles.primaryAction}
                    disabled={processing}
                    key="transpose"
                    ref={actionRef}
                    type="submit"
                  >
                    {processing ? (
                      <span aria-hidden="true" className={styles.spinner} />
                    ) : null}
                    {processing ? "Preparando…" : "Transpor"}
                  </button>
                )}
              </form>
            </div>
            <p
              aria-atomic="true"
              aria-live="polite"
              className={styles.status}
              data-demo-status=""
              role="status"
            >
              {status}
            </p>
          </div>
        </div>
        <div aria-hidden="true" className={styles.shadow} />
      </div>
      <figcaption id={descriptionId}>
        Demonstração ilustrativa em HTML e SVG, sem envio de arquivos, rede ou
        transposição musical real. A revisão humana permanece indispensável.
      </figcaption>
    </figure>
  );
}
