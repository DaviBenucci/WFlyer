"use client";

import { useSearchParams } from "next/navigation";

import {
  contactProjectTypes,
  isContactProjectType,
} from "@/content/site-content";

export function ContactProjectTypeSelect() {
  const searchParams = useSearchParams();
  const requestedType = searchParams.get("tipo");
  const selectedType = isContactProjectType(requestedType)
    ? requestedType
    : "";

  return (
    <select
      defaultValue={selectedType}
      disabled
      name="projectType"
    >
      <option value="">Selecione uma opção</option>
      {contactProjectTypes.map((projectType) => (
        <option key={projectType.value} value={projectType.value}>
          {projectType.label}
        </option>
      ))}
    </select>
  );
}
