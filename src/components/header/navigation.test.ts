import { describe, expect, it } from "vitest";

import {
  getHeaderRouteState,
  INSTITUTIONAL_NAVIGATION,
} from "./navigation";

describe("getHeaderRouteState", () => {
  it.each([
    ["/", null],
    ["/aplicacao-wflyer", null],
    ["/aplicacao-wflyer/como-funciona", null],
    ["/aplicacao-wflyer/beneficios", null],
    ["/sobre", "company"],
    ["/servicos", "services"],
    ["/servicos/integracoes", "services"],
    ["/portfolio", null],
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

  it("usa apenas rótulos profissionais", () => {
    expect(INSTITUTIONAL_NAVIGATION.map(({ label }) => label)).toEqual([
      "Sobre",
      "Serviços",
      "Contato",
    ]);
  });
});
