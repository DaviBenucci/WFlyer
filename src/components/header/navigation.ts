import {
  institutionalHeaderLinks,
  type HeaderLink,
} from "@/config/navigation";

export type HeaderNavigationId = (typeof institutionalHeaderLinks)[number]["id"];

export type HeaderNavigationItem = HeaderLink & {
  readonly branch: "institutional";
};

export const INSTITUTIONAL_NAVIGATION = institutionalHeaderLinks.map((item) => ({
  ...item,
  branch: "institutional" as const,
})) satisfies readonly HeaderNavigationItem[];

export interface HeaderRouteState {
  readonly activeId: HeaderNavigationId | null;
  readonly processSubchapter: boolean;
}

function normalizePathname(pathname: string) {
  const pathWithoutQuery = pathname.split(/[?#]/u, 1)[0] ?? "/";

  if (pathWithoutQuery === "/") {
    return pathWithoutQuery;
  }

  return pathWithoutQuery.replace(/\/+$/u, "");
}

export function getHeaderRouteState(pathname: string): HeaderRouteState {
  const normalizedPathname = normalizePathname(pathname);

  if (normalizedPathname === "/processo") {
    return {
      activeId: "services",
      processSubchapter: true,
    };
  }

  if (
    normalizedPathname === "/servicos" ||
    normalizedPathname.startsWith("/servicos/")
  ) {
    return {
      activeId: "services",
      processSubchapter: false,
    };
  }

  const internalItem = INSTITUTIONAL_NAVIGATION.find(
    (item) =>
      !("external" in item && item.external) &&
      item.href === normalizedPathname,
  );

  return {
    activeId: internalItem?.id ?? null,
    processSubchapter: false,
  };
}
