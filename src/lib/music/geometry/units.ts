import type { StaffSpace, StaffStep } from "./types";

export const STAFF_STEPS_PER_SPACE = 2;
export const MIDDLE_STAFF_STEP = 4;
export const STAFF_LINE_STEPS = [0, 2, 4, 6, 8] as const;

export function requireFiniteNumber(value: number, label: string): number {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${label} must be a finite number`);
  }

  return value;
}

export function requireInteger(value: number, label: string): number {
  requireFiniteNumber(value, label);

  if (!Number.isInteger(value)) {
    throw new RangeError(`${label} must be an integer`);
  }

  return value;
}

export function requireNonNegativeNumber(
  value: number,
  label: string,
): number {
  requireFiniteNumber(value, label);

  if (value < 0) {
    throw new RangeError(`${label} must be greater than or equal to zero`);
  }

  return value;
}

export function requirePositiveNumber(value: number, label: string): number {
  requireFiniteNumber(value, label);

  if (value <= 0) {
    throw new RangeError(`${label} must be greater than zero`);
  }

  return value;
}

export function requireNormalizedPosition(t: number): number {
  requireFiniteNumber(t, "t");

  if (t < 0 || t > 1) {
    throw new RangeError("t must be between zero and one inclusive");
  }

  return t;
}

export function requireStaffSpace(staffSpace: StaffSpace): StaffSpace {
  return requirePositiveNumber(staffSpace, "staffSpace");
}

export function requireStaffStep(staffStep: StaffStep): StaffStep {
  return requireInteger(staffStep, "staffStep");
}

export function staffStepSize(staffSpace: StaffSpace): number {
  return requireStaffSpace(staffSpace) / STAFF_STEPS_PER_SPACE;
}

/** Offset from the B4 / staffStep-4 master guide along increasing-pitch N. */
export function staffStepToOffset(
  staffStep: StaffStep,
  staffSpace: StaffSpace,
): number {
  requireStaffStep(staffStep);

  return (staffStep - MIDDLE_STAFF_STEP) * staffStepSize(staffSpace);
}
