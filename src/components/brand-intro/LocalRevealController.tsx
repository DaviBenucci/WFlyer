"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

const REVEAL_SELECTOR = [
  "[data-page-hero]",
  "[data-feature-strip] > li",
  "[data-benefits-grid] > li",
  "[data-service-grid] > li",
  "[data-project-grid] > li",
  "[data-step-sequence] li",
  "[data-score-placement]",
  "[data-score-placement] [data-musical-note]",
  "[data-final-barline]",
].join(",");

export function LocalRevealController() {
  const lifecycleRef = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const targets = Array.from(
        document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
      );
      const pending = targets.filter(
        (target) => target.getBoundingClientRect().top > innerHeight * 0.9,
      );
      if (pending.length === 0) return;

      for (const target of pending) {
        gsap.set(
          target,
          target.matches("[data-musical-note]")
            ? { opacity: 0, willChange: "opacity" }
            : { opacity: 0, willChange: "transform,opacity", y: 24 },
        );
      }
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const target = entry.target as HTMLElement;
            const note = target.matches("[data-musical-note]");
            observer.unobserve(target);
            gsap.to(target, {
              clearProps: "opacity,transform,will-change",
              duration: 0.55,
              ease: "power2.out",
              opacity: 1,
              overwrite: true,
              ...(note ? {} : { y: 0 }),
            });
          }
        },
        { rootMargin: "0px 0px -8%", threshold: 0.12 },
      );
      pending.forEach((target) => observer.observe(target));

      return () => {
        observer.disconnect();
        gsap.set(pending, { clearProps: "opacity,transform,will-change" });
      };
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return <span aria-hidden="true" hidden ref={lifecycleRef} />;
}
