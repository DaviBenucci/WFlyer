from __future__ import annotations

import os
import shutil
import subprocess
from pathlib import Path


class OMRConversionError(RuntimeError):
    pass


def convert_pdf_to_musicxml(pdf_path: Path, output_dir: Path) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)

    audiveris_bin = _resolve_audiveris_bin()
    if not audiveris_bin:
        raise OMRConversionError(
            "Audiveris nao encontrado. Instale o Audiveris e adicione ao PATH para converter PDF em MusicXML."
        )

    command = [
        audiveris_bin,
        "-batch",
        "-export",
        "-output",
        str(output_dir),
        str(pdf_path),
    ]
    result = subprocess.run(command, capture_output=True, text=True, check=False)
    if result.returncode != 0:
        message = "\n".join(
            text
            for text in (
                "Falha ao converter PDF com Audiveris.",
                result.stdout.strip(),
                result.stderr.strip(),
            )
            if text
        )
        raise OMRConversionError(message)

    candidates = _find_musicxml_candidates(output_dir)
    if not candidates:
        raise OMRConversionError(
            "Nenhum arquivo MusicXML foi gerado pelo Audiveris. Verifique se o PDF e legivel para OMR."
        )

    return candidates[0]


def _find_musicxml_candidates(directory: Path) -> list[Path]:
    patterns = ("*.musicxml", "*.mxl", "*.xml")
    matches: list[Path] = []
    for pattern in patterns:
        matches.extend(directory.rglob(pattern))
    matches = [path for path in matches if path.is_file()]
    matches.sort(key=lambda path: path.stat().st_mtime, reverse=True)
    return matches


def _resolve_audiveris_bin() -> str | None:
    explicit = os.environ.get("AUDIVERIS_BIN")
    if explicit and Path(explicit).exists():
        return explicit

    for candidate in ("audiveris", "Audiveris.exe"):
        resolved = shutil.which(candidate)
        if resolved:
            return resolved

    known_locations = (
        Path("C:/Program Files/Audiveris/Audiveris.exe"),
        Path("C:/Program Files (x86)/Audiveris/Audiveris.exe"),
    )
    for location in known_locations:
        if location.exists():
            return str(location)

    return None
