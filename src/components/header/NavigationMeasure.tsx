import Link from "next/link";
import type { MouseEventHandler } from "react";

import {
  MeasureBar,
  MusicalNote,
  StaffSegment,
} from "@/components/music";

import type { HeaderNavigationItem } from "./navigation";
import styles from "./site-header.module.css";

export interface NavigationMeasureProps {
  readonly item: HeaderNavigationItem;
  readonly active?: boolean;
  readonly processSubchapter?: boolean;
  readonly mobile?: boolean;
  readonly onNavigate?: MouseEventHandler<HTMLAnchorElement>;
}

function MeasureGraphic({
  active,
  branch,
}: {
  readonly active: boolean;
  readonly branch: HeaderNavigationItem["branch"];
}) {
  const isApplication = branch === "application";

  return (
    <svg
      aria-hidden="true"
      className={styles.measureGraphic}
      focusable="false"
      preserveAspectRatio="none"
      viewBox="0 0 160 48"
    >
      <StaffSegment
        amplitude={3}
        baseY={12}
        direction={isApplication ? "left" : "right"}
        endX={160}
        lineGap={6}
      />
      <MeasureBar bottom={36} top={12} x={2} />
      <MeasureBar bottom={36} top={12} x={158} />
      <MusicalNote
        filled={active}
        scale={0.45}
        stem={isApplication ? "down" : "up"}
        x={isApplication ? 34 : 126}
        y={24}
      />
    </svg>
  );
}

function MeasureContent({
  active,
  item,
  processSubchapter,
}: Pick<
  NavigationMeasureProps,
  "active" | "item" | "processSubchapter"
>) {
  return (
    <>
      <MeasureGraphic active={active === true} branch={item.branch} />
      <span className={styles.measureLabel}>{item.label}</span>
      {item.external ? (
        <>
          <span aria-hidden="true" className={styles.externalMark}>
            ↗
          </span>
          <span className={styles.srOnly}> (abre em nova aba)</span>
        </>
      ) : null}
      {processSubchapter ? (
        <span className={styles.processMarker} data-process-marker="">
          <span aria-hidden="true" className={styles.processMarkerDot} />
          <span className={styles.processMarkerText}>Processo — etapa atual</span>
        </span>
      ) : null}
    </>
  );
}

export function NavigationMeasure({
  active = false,
  item,
  mobile = false,
  onNavigate,
  processSubchapter = false,
}: NavigationMeasureProps) {
  const className = [
    styles.measureLink,
    mobile ? styles.measureLinkMobile : "",
    active ? styles.measureLinkActive : "",
  ]
    .filter(Boolean)
    .join(" ");
  const ariaCurrent = active
    ? processSubchapter
      ? "step"
      : "page"
    : undefined;

  if (item.external) {
    return (
      <a
        className={className}
        data-navigation-id={item.id}
        href={item.href}
        onClick={onNavigate}
        rel="noopener noreferrer"
        target="_blank"
      >
        <MeasureContent
          active={active}
          item={item}
          processSubchapter={processSubchapter}
        />
      </a>
    );
  }

  return (
    <Link
      aria-current={ariaCurrent}
      className={className}
      data-navigation-id={item.id}
      href={item.href}
      prefetch={false}
      {...(onNavigate ? { onClick: onNavigate } : {})}
    >
      <MeasureContent
        active={active}
        item={item}
        processSubchapter={processSubchapter}
      />
    </Link>
  );
}
