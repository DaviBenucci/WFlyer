import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PUBLIC_PROJECTS } from "@/content/public";

import { ProjectListing } from "./ProjectListing";

describe("ProjectListing", () => {
  it("renders only the supplied public records as semantic links", () => {
    render(<ProjectListing projects={PUBLIC_PROJECTS} />);

    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(screen.getAllByRole("link")).toHaveLength(3);
    for (const project of PUBLIC_PROJECTS) {
      expect(
        screen.getByRole("link", {
          name: `Conhecer o projeto ${project.title}`,
        }),
      ).toHaveAttribute("href", project.route);
    }
  });

  it("renders a valid empty state without fabricating a project", () => {
    render(<ProjectListing projects={[]} />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Nenhum projeto público",
    );
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
