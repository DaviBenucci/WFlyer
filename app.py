from __future__ import annotations

import tempfile
from pathlib import Path
from typing import Any, cast

import streamlit as _st

from wflyer.history import get_recent_corrections
from wflyer.instrument import (
    DEFAULT_TARGET_INSTRUMENT_ID,
    get_instrument_choices,
    get_target_instrument_choices,
)
from wflyer.omr import OMRConversionError
from wflyer.pipeline import inspect_pdf_instrument, process_pdf_transposition
from wflyer.transposer import PIANO_MODE_BOTH, PIANO_MODE_SOL_ONLY

st = cast(Any, _st)

st.set_page_config(page_title="WFlyer", layout="centered")

HISTORY_PATH = Path(__file__).resolve().parent / "wflyer_history.json"

st.title("WFlyer")
st.caption("Transposicao de partituras em PDF com deteccao de instrumento e exportacao em MusicXML/PDF.")

st.markdown(
    """
1. Envie uma partitura em PDF.
2. O WFlyer tenta detectar o instrumento pelo cabecalho/canto superior.
3. Se precisar, corrija o instrumento de origem manualmente.
4. Escolha o instrumento de destino.
5. Baixe o resultado em MusicXML e, opcionalmente, em PDF.
"""
)

uploaded_pdf = st.file_uploader("Partitura em PDF", type=["pdf"])
if not uploaded_pdf:
    st.stop()

with tempfile.TemporaryDirectory(prefix="wflyer_inspect_") as inspect_tmp:
    inspect_pdf_path = Path(inspect_tmp) / uploaded_pdf.name
    inspect_pdf_path.write_bytes(uploaded_pdf.getvalue())
    inspect_result = inspect_pdf_instrument(inspect_pdf_path)

all_instruments = get_instrument_choices()
instrument_by_id = {item.instrument_id: item for item in all_instruments}
source_display_map = {item.display_name: item.instrument_id for item in all_instruments}
source_display_options = list(source_display_map.keys())

target_instruments = get_target_instrument_choices()
target_display_map = {item.display_name: item.instrument_id for item in target_instruments}
target_display_options = list(target_display_map.keys())

selected_source_id: str | None = None
if inspect_result.detection:
    detection = inspect_result.detection
    st.success(
        "Instrumento detectado: "
        f"{detection.instrument.display_name} "
        f"(confianca {detection.confidence:.0%}, alias: {detection.matched_alias})"
    )
    if detection.candidates:
        st.caption(
            "Top candidatos: "
            + ", ".join(
                f"{candidate.instrument.display_name} ({candidate.score:.0%})"
                for candidate in detection.candidates
            )
        )

    use_manual_source = st.checkbox("Corrigir instrumento de origem manualmente")
    if use_manual_source:
        selected_source_label = st.selectbox("Instrumento de origem da partitura", source_display_options)
        selected_source_id = source_display_map[selected_source_label]
else:
    st.warning("Nao foi possivel detectar o instrumento automaticamente.")
    selected_source_label = st.selectbox("Selecione o instrumento de origem", source_display_options)
    selected_source_id = source_display_map[selected_source_label]

if selected_source_id:
    resolved_source_id = selected_source_id
elif inspect_result.detected_instrument is not None:
    resolved_source_id = inspect_result.detected_instrument.instrument_id
else:
    st.error("Nao foi possivel determinar o instrumento de origem. Selecione manualmente.")
    st.stop()

resolved_source = instrument_by_id[resolved_source_id]

default_target_label = next(
    (
        display_name
        for display_name, instrument_id in target_display_map.items()
        if instrument_id == DEFAULT_TARGET_INSTRUMENT_ID
    ),
    target_display_options[0],
)
target_label = st.selectbox(
    "Instrumento de destino",
    target_display_options,
    index=target_display_options.index(default_target_label),
)
selected_target_id = target_display_map[target_label]

piano_mode = PIANO_MODE_SOL_ONLY
if resolved_source.instrument_id == "piano":
    piano_mode_label = st.radio(
        "Partitura de piano: como deseja tratar as claves?",
        (
            "Transpor somente a clave de Sol (melodia)",
            "Separar e transpor as duas (melodia e base)",
        ),
    )
    piano_mode = (
        PIANO_MODE_BOTH
        if piano_mode_label.startswith("Separar e transpor")
        else PIANO_MODE_SOL_ONLY
    )

export_pdf = st.checkbox("Gerar tambem PDF final (alem de MusicXML)", value=True)

if st.button("Processar transposicao", type="primary"):
    with st.spinner("Processando partitura..."):
        with tempfile.TemporaryDirectory(prefix="wflyer_run_") as run_tmp:
            run_dir = Path(run_tmp)
            pdf_path = run_dir / uploaded_pdf.name
            pdf_path.write_bytes(uploaded_pdf.getvalue())

            try:
                result = process_pdf_transposition(
                    pdf_path=pdf_path,
                    working_dir=run_dir,
                    selected_source_instrument_id=selected_source_id,
                    target_instrument_id=selected_target_id,
                    piano_mode=piano_mode,
                    export_pdf=export_pdf,
                    history_path=HISTORY_PATH,
                )
            except OMRConversionError as error:
                st.error(str(error))
                st.info(
                    "O WFlyer depende do Audiveris no PATH para converter PDF em MusicXML."
                )
                st.stop()
            except Exception as error:  # noqa: BLE001
                st.exception(error)
                st.stop()

            st.success("Transposicao concluida.")
            st.write(f"Origem usada: {result.selected_source_instrument.display_name}")
            st.write(f"Destino usado: {result.selected_target_instrument.display_name}")

            for log in result.logs:
                st.write(f"- {log}")

            if result.warnings:
                for warning in result.warnings:
                    st.warning(warning)

            for output_file in result.output_files:
                extension = output_file.suffix.lower()
                if extension == ".pdf":
                    mime = "application/pdf"
                else:
                    mime = "application/vnd.recordare.musicxml+xml"

                st.download_button(
                    label=f"Baixar {output_file.name}",
                    data=output_file.read_bytes(),
                    file_name=output_file.name,
                    mime=mime,
                )

st.divider()
st.subheader("Historico recente de correcoes")
history_records = get_recent_corrections(HISTORY_PATH, limit=15)
if not history_records:
    st.caption("Nenhuma correcao registrada ainda.")
else:
    history_rows: list[dict[str, str]] = []
    for item in history_records:
        detected_name = (
            instrument_by_id[item.detected_instrument_id].display_name
            if item.detected_instrument_id and item.detected_instrument_id in instrument_by_id
            else "-"
        )
        selected_name = (
            instrument_by_id[item.selected_instrument_id].display_name
            if item.selected_instrument_id in instrument_by_id
            else item.selected_instrument_id
        )
        confidence_text = (
            f"{item.detection_confidence:.0%}" if item.detection_confidence is not None else "-"
        )
        history_rows.append(
            {
                "timestamp_utc": item.timestamp_utc,
                "pdf_name": item.pdf_name,
                "detectado": detected_name,
                "selecionado": selected_name,
                "confianca": confidence_text,
            }
        )
    st.dataframe(history_rows, use_container_width=True)
