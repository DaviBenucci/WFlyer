from __future__ import annotations

import shutil
import subprocess
from pathlib import Path

from music21 import stream

MUSESCORE_BINARIES = (
    "MuseScore4",
    "MuseScore3",
    "musescore",
    "mscore",
)


def export_score_to_pdf(
    score: stream.Score,
    source_musicxml_path: Path,
    output_pdf_path: Path,
) -> tuple[bool, str | None]:
    output_pdf_path.parent.mkdir(parents=True, exist_ok=True)

    musescore_path = _find_musescore_binary()
    if musescore_path:
        command = [musescore_path, str(source_musicxml_path), "-o", str(output_pdf_path)]
        result = subprocess.run(command, capture_output=True, text=True, check=False)
        if result.returncode == 0 and output_pdf_path.exists():
            return True, None

    try:
        generated = score.write("musicxml.pdf", fp=str(output_pdf_path))
        generated_path = Path(str(generated))
        if generated_path.exists():
            if generated_path != output_pdf_path:
                generated_path.replace(output_pdf_path)
            return True, None
    except Exception:
        pass

    return (
        False,
        (
            "Nao foi possivel gerar PDF automaticamente. Instale MuseScore e adicione ao PATH "
            "para habilitar exportacao em PDF."
        ),
    )


def _find_musescore_binary() -> str | None:
    for binary in MUSESCORE_BINARIES:
        resolved = shutil.which(binary)
        if resolved:
            return resolved
    return None

