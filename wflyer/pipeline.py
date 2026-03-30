from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

from .history import append_correction
from .instrument import (
    DEFAULT_TARGET_INSTRUMENT_ID,
    InstrumentDetection,
    InstrumentProfile,
    detect_instrument_with_confidence,
    get_instrument_by_id,
)
from .omr import convert_pdf_to_musicxml
from .pdf_text import extract_header_text
from .transposer import (
    PIANO_MODE_SOL_ONLY,
    load_score,
    transpose_score,
    write_artifacts,
)


@dataclass
class InspectResult:
    extracted_text: str
    detection: InstrumentDetection | None

    @property
    def detected_instrument(self) -> InstrumentProfile | None:
        return self.detection.instrument if self.detection else None


@dataclass
class ProcessResult:
    inspect_result: InspectResult
    selected_source_instrument: InstrumentProfile
    selected_target_instrument: InstrumentProfile
    source_musicxml: Path
    output_files: list[Path]
    correction_recorded: bool
    logs: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)


def inspect_pdf_instrument(pdf_path: Path) -> InspectResult:
    extracted_text = extract_header_text(pdf_path)
    detection = detect_instrument_with_confidence(extracted_text)
    return InspectResult(extracted_text=extracted_text, detection=detection)


def process_pdf_transposition(
    pdf_path: Path,
    working_dir: Path,
    selected_source_instrument_id: str | None = None,
    target_instrument_id: str = DEFAULT_TARGET_INSTRUMENT_ID,
    piano_mode: str = PIANO_MODE_SOL_ONLY,
    export_pdf: bool = True,
    history_path: Path | None = None,
) -> ProcessResult:
    logs: list[str] = []
    warnings: list[str] = []
    inspect_result = inspect_pdf_instrument(pdf_path)
    detection = inspect_result.detection

    if inspect_result.extracted_text:
        logs.append("Texto do cabecalho extraido para deteccao de instrumento.")
    else:
        logs.append("Nao foi possivel extrair texto do cabecalho. Selecao manual sera usada.")

    if selected_source_instrument_id:
        selected_source = get_instrument_by_id(selected_source_instrument_id)
        logs.append(f"Instrumento de origem selecionado manualmente: {selected_source.display_name}.")
    elif detection:
        selected_source = detection.instrument
        logs.append(
            "Instrumento detectado automaticamente: "
            f"{selected_source.display_name} (confianca {detection.confidence:.0%})."
        )
    else:
        raise ValueError(
            "Nao foi possivel detectar o instrumento. Informe o instrumento manualmente na interface."
        )

    selected_target = get_instrument_by_id(target_instrument_id)
    logs.append(f"Instrumento de destino: {selected_target.display_name}.")

    correction_recorded = False
    if selected_source_instrument_id and history_path:
        manual_changed = detection is None or selected_source.instrument_id != detection.instrument.instrument_id
        if manual_changed:
            append_correction(
                history_path=history_path,
                pdf_name=pdf_path.name,
                detected_instrument_id=detection.instrument.instrument_id if detection else None,
                selected_instrument_id=selected_source.instrument_id,
                detection_confidence=detection.confidence if detection else None,
            )
            correction_recorded = True
            logs.append("Correcao manual registrada no historico.")

    omr_dir = working_dir / "omr"
    output_dir = working_dir / "output"
    source_musicxml = convert_pdf_to_musicxml(pdf_path, omr_dir)
    logs.append(f"MusicXML de origem gerado em: {source_musicxml.name}.")

    source_score = load_score(source_musicxml)
    artifacts = transpose_score(
        source_score=source_score,
        source_instrument=selected_source,
        target_instrument=selected_target,
        piano_mode=piano_mode,
    )
    output_files, export_warnings = write_artifacts(
        artifacts=artifacts,
        output_dir=output_dir,
        export_pdf=export_pdf,
    )
    warnings.extend(export_warnings)

    if export_pdf:
        logs.append("Geracao de MusicXML e tentativa de exportacao em PDF concluida.")
    else:
        logs.append("Geracao de MusicXML concluida.")

    return ProcessResult(
        inspect_result=inspect_result,
        selected_source_instrument=selected_source,
        selected_target_instrument=selected_target,
        source_musicxml=source_musicxml,
        output_files=output_files,
        correction_recorded=correction_recorded,
        logs=logs,
        warnings=warnings,
    )


def process_pdf_to_trumpet(
    pdf_path: Path,
    working_dir: Path,
    selected_instrument_id: str | None = None,
    piano_mode: str = PIANO_MODE_SOL_ONLY,
) -> ProcessResult:
    return process_pdf_transposition(
        pdf_path=pdf_path,
        working_dir=working_dir,
        selected_source_instrument_id=selected_instrument_id,
        target_instrument_id=DEFAULT_TARGET_INSTRUMENT_ID,
        piano_mode=piano_mode,
        export_pdf=False,
    )

