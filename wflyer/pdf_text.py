from __future__ import annotations

from pathlib import Path

import fitz


def extract_header_text(pdf_path: Path, max_pages: int = 2) -> str:
    snippets: list[str] = []
    with fitz.open(pdf_path) as doc:
        page_count = min(max_pages, len(doc))
        for idx in range(page_count):
            page = doc[idx]
            rect = page.rect
            top_rect = fitz.Rect(0, 0, rect.width, rect.height * 0.30)
            right_rect = fitz.Rect(rect.width * 0.60, 0, rect.width, rect.height * 0.30)

            snippets.append(page.get_textbox(top_rect).strip())
            snippets.append(page.get_textbox(right_rect).strip())
            snippets.append(page.get_text("text").strip())

    return "\n".join(chunk for chunk in snippets if chunk)

