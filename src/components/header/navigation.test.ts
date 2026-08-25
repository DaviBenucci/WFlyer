import { describe, expect, it } from "vitest";

import {
  APPLICATION_NAVIGATION,
  getHeaderRouteState,
  INSTITUTIONAL_NAVIGATION,
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

  it("mantém o acesso ao app fora do cabeçalho e usa rótulos profissionais", () => {
    expect(
      APPLICATION_NAVIGATION.some((item) => item.href.startsWith("http")),
    ).toBe(false);
    expect(INSTITUTIONAL_NAVIGATION.map(({ label }) => label)).toEqual([
      "Sobre",
      "Serviços",
      "Projetos",
      "Contato",
    ]);
  });
});
