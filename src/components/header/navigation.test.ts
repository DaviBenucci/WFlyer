import { describe, expect, it } from "vitest";

import {
  APPLICATION_NAVIGATION,
  getHeaderRouteState,
} from "./navigation";

describe("getHeaderRouteState", () => {
  it.each([
    ["/", null],
    ["/aplicacao-wflyer", "application"],
    ["/aplicacao-wflyer/como-funciona", "how-it-works"],
    ["/aplicacao-wflyer/beneficios", "benefits"],
    ["/sobre", "company"],
    ["/servicos", "services"],
    ["/servicos/integracoes", "services"],
    ["/portfolio", "portfolio"],
    ["/contato", "contact"],
  ])("mapeia %s para %s", (pathname, activeId) => {
    expect(getHeaderRouteState(pathname).activeId).toBe(activeId);
  });

  it("mantém Processo sob Serviços sem criar item extra", () => {
    expect(getHeaderRouteState("/processo")).toEqual({
      activeId: "services",
      processSubchapter: true,
    });
  });

  it("deriva o CTA externo da fonte tipada global", () => {
    const externalItem = APPLICATION_NAVIGATION.find(
      (item) => item.id === "application-access",
    );

    expect(externalItem).toMatchObject({
      href: "https://app.wflyer.com.br",
      branch: "application",
      external: true,
    });
  });
});
