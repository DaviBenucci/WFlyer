import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { PUBLIC_PROJECTS, type ProjectRecord } from "@/content/public";

import { ProjectCardFan } from "./ProjectCardFan";

function itemAt(items: readonly HTMLElement[], index: number): HTMLElement {
  const item = items[index];

  if (!item) {
    throw new Error(`Expected project-card item at index ${index}.`);
  }

  return item;
}

function projectAt(index: number): ProjectRecord {
  const project = PUBLIC_PROJECTS[index];

  if (!project) {
    throw new Error(`Expected public project at index ${index}.`);
  }

  return project;
}

describe("ProjectCardFan", () => {
  it("renders the authorized projects as a semantic ordered list with internal routes", () => {
    render(<ProjectCardFan projects={PUBLIC_PROJECTS} />);

    const list = screen.getByRole("list", { name: "Projetos em destaque" });
    const items = within(list).getAllByRole("listitem");

    expect(list.tagName).toBe("OL");
    expect(items).toHaveLength(PUBLIC_PROJECTS.length);
    expect(screen.getAllByRole("article")).toHaveLength(PUBLIC_PROJECTS.length);

    for (const [index, project] of PUBLIC_PROJECTS.entries()) {
      const item = itemAt(items, index);

      expect(
        within(item).getByRole("link", {
          name: `Conhecer o projeto ${project.title}`,
        }),
      ).toHaveAttribute("href", project.route);
      expect(within(item).getByText(project.role)).toBeVisible();
    }
  });

  it("assigns a deterministic restrained fan position to every card", () => {
    render(<ProjectCardFan projects={PUBLIC_PROJECTS} />);

    const items = screen.getAllByRole("listitem");

    expect(itemAt(items, 0)).toHaveStyle(
      "--project-card-rest-y: 0.4rem; --project-card-rotation: -2.25deg; --project-card-selected-z: 13; --project-card-z: 1;",
    );
    expect(itemAt(items, 1)).toHaveStyle(
      "--project-card-rest-y: 0rem; --project-card-rotation: 0deg; --project-card-z: 2;",
    );
    expect(itemAt(items, 2)).toHaveStyle(
      "--project-card-rest-y: 0.4rem; --project-card-rotation: 2.25deg; --project-card-z: 3;",
    );
  });

  it("keeps every destination keyboard-focusable without hover", async () => {
    const user = userEvent.setup();

    render(<ProjectCardFan projects={PUBLIC_PROJECTS} />);

    const firstProject = projectAt(0);
    const firstLink = screen.getByRole("link", {
      name: `Conhecer o projeto ${firstProject.title}`,
    });

    await user.tab();

    expect(firstLink).toHaveFocus();
    expect(
      firstLink.closest<HTMLElement>("[data-project-card-item]"),
    ).toContainElement(firstLink);
  });

  it("fails closed to the empty state when no featured public record remains", () => {
    const unpublishedProject = {
      ...projectAt(0),
      publicationStatus: "unpublished",
    } satisfies ProjectRecord;
    const unfeaturedProject = {
      ...projectAt(1),
      featured: false,
    } satisfies ProjectRecord;

    render(
      <ProjectCardFan projects={[unpublishedProject, unfeaturedProject]} />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Nenhum projeto público",
    );
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
