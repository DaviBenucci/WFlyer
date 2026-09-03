import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MOBILE_STORY_CHAPTERS } from "@/lib/story";

import { StaticStorySkeleton } from "./StaticStorySkeleton";

describe("StaticStorySkeleton", () => {
  it("renders every canonical chapter once in vertical document order", () => {
    const { container } = render(<StaticStorySkeleton />);
    const main = screen.getByRole("main");
    const chapters = [...main.querySelectorAll<HTMLElement>("[data-chapter-id]")];

    expect(chapters.map((chapter) => chapter.dataset.chapterId)).toEqual(
      MOBILE_STORY_CHAPTERS.map((chapter) => chapter.id),
    );
    expect(new Set(chapters.map((chapter) => chapter.dataset.chapterId)).size).toBe(
      MOBILE_STORY_CHAPTERS.length,
    );
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(container.querySelector("footer")).not.toBeInTheDocument();
  });

  it("keeps canonical hashes distinct from technical chapter identities", () => {
    const { container } = render(<StaticStorySkeleton />);
    const expectedIds = [
      "main-content",
      "home",
      "sobre",
      "servicos",
      "processo",
      "projetos",
      "contato",
      "aplicacao",
      "como-funciona",
      "beneficios",
      "demonstracao",
      "lancamento",
    ];
    const allIds = [...container.querySelectorAll<HTMLElement>("[id]")].map(
      (element) => element.id,
    );

    for (const id of expectedIds) expect(allIds).toContain(id);
    expect(new Set(allIds).size).toBe(allIds.length);
    expect(
      container.querySelector('[data-chapter-id="professional-about"]'),
    ).toHaveAttribute("id", "sobre");
    expect(
      container.querySelector('[data-chapter-id="professional-terminal"]'),
    ).not.toHaveAttribute("id");
  });

  it("publishes Task-34 semantic score hooks without rendering Music in the static fallback", () => {
    const { container } = render(<StaticStorySkeleton />);
    const chapters = container.querySelectorAll<HTMLElement>("[data-chapter-id]");

    for (const chapter of chapters) {
      expect(chapter.dataset.storyScene).toBe(chapter.dataset.chapterId);
      expect(chapter.dataset.futureScoreSegment).toBe(chapter.dataset.chapterId);
      expect(chapter.dataset.futureScoreSlotCount).toBe(
        chapter.dataset.chapterId === "home" ? "0" : "2",
      );
    }

    expect(
      container.querySelector(
        [
          "[data-composer-semantics]",
          "[data-connector-fixture]",
          "[data-music-renderer]",
          "[data-rendered-score]",
          "[data-score-model]",
          "[data-score-role]",
          "video",
        ].join(", "),
      ),
    ).not.toBeInTheDocument();
  });

  it("places the purpose-limited launch registration only in its final content chapter", () => {
    const { container } = render(<StaticStorySkeleton />);
    const accessChapter = container.querySelector(
      '[data-chapter-id="application-access"]',
    );

    expect(accessChapter).not.toBeNull();
    expect(within(accessChapter as HTMLElement).getByRole("heading", {
      name: "A aplicação está em desenvolvimento.",
    })).toBeVisible();
    expect(container.querySelector('a[href="https://app.wflyer.com.br"]')).not.toBeInTheDocument();
    expect(container.textContent).not.toMatch(
      /\b(?:agência|companhia|empresa|empresas|nossa equipe|nosso time|sociedade)\b/iu,
    );
  });

  it("keeps final assets and advanced behavior visibly pending", () => {
    const { container } = render(<StaticStorySkeleton />);

    expect(
      within(
        container.querySelector(
          '[data-chapter-id="professional-about"]',
        ) as HTMLElement,
      ).getByText(/Ativo final pendente/u),
    ).toBeVisible();
    expect(
      within(
        container.querySelector(
          '[data-chapter-id="application-demo"]',
        ) as HTMLElement,
      ).getByText(/WebM, MP4, poster e quadro final/u),
    ).toBeVisible();
    expect(container.querySelectorAll("[data-structural-placeholder]")).toHaveLength(
      2,
    );
  });
});
