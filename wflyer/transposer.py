from __future__ import annotations

import copy
from dataclasses import dataclass
from pathlib import Path

from music21 import chord, clef, converter, metadata, note, stream

from .exporter import export_score_to_pdf
from .instrument import (
    InstrumentProfile,
    semitones_from_source_to_target,
)

PIANO_MODE_SOL_ONLY = "sol_only"
PIANO_MODE_BOTH = "both"
STAFF_TREBLE = "treble"
STAFF_BASS = "bass"
MIDDLE_C_MIDI = 60


@dataclass
class ScoreArtifact:
    label: str
    stem: str
    score: stream.Score


def load_score(musicxml_path: Path) -> stream.Score:
    parsed = converter.parse(str(musicxml_path))
    if isinstance(parsed, stream.Score):
        return parsed
    if isinstance(parsed, stream.Opus) and parsed.scores:
        return parsed.scores[0]
    raise ValueError("Arquivo MusicXML nao retornou uma partitura valida.")


def transpose_score(
    source_score: stream.Score,
    source_instrument: InstrumentProfile,
    target_instrument: InstrumentProfile,
    piano_mode: str = PIANO_MODE_SOL_ONLY,
) -> list[ScoreArtifact]:
    semitone_shift = semitones_from_source_to_target(source_instrument, target_instrument)

    if source_instrument.instrument_id != "piano":
        transposed = copy.deepcopy(source_score)
        transposed.transpose(semitone_shift, inPlace=True)
        return [
            ScoreArtifact(
                label=f"Partitura transposta para {target_instrument.display_name}",
                stem=f"wflyer_{target_instrument.instrument_id}",
                score=transposed,
            )
        ]

    if piano_mode == PIANO_MODE_BOTH:
        return _transpose_piano_both(source_score, semitone_shift, target_instrument)
    return _transpose_piano_sol_only(source_score, semitone_shift, target_instrument)


def write_artifacts(
    artifacts: list[ScoreArtifact],
    output_dir: Path,
    export_pdf: bool = False,
) -> tuple[list[Path], list[str]]:
    output_dir.mkdir(parents=True, exist_ok=True)
    paths: list[Path] = []
    warnings: list[str] = []

    for artifact in artifacts:
        musicxml_path = output_dir / f"{artifact.stem}.musicxml"
        artifact.score.write("musicxml", fp=str(musicxml_path))
        paths.append(musicxml_path)

        if not export_pdf:
            continue

        pdf_path = output_dir / f"{artifact.stem}.pdf"
        exported, warning = export_score_to_pdf(artifact.score, musicxml_path, pdf_path)
        if exported:
            paths.append(pdf_path)
        elif warning:
            warnings.append(warning)

    return paths, warnings


def _transpose_piano_sol_only(
    source_score: stream.Score,
    semitone_shift: int,
    target_instrument: InstrumentProfile,
) -> list[ScoreArtifact]:
    transposed = copy.deepcopy(source_score)
    parts = list(transposed.parts)

    if len(parts) >= 2:
        melody_part, _ = _pick_melody_and_bass_parts(parts)
        melody_part.transpose(semitone_shift, inPlace=True)
    else:
        _transpose_notes_by_staff(transposed, semitone_shift, target_staff=STAFF_TREBLE)

    return [
        ScoreArtifact(
            label=f"Piano (somente clave de Sol) para {target_instrument.display_name}",
            stem=f"wflyer_piano_sol_{target_instrument.instrument_id}",
            score=transposed,
        )
    ]


def _transpose_piano_both(
    source_score: stream.Score,
    semitone_shift: int,
    target_instrument: InstrumentProfile,
) -> list[ScoreArtifact]:
    parts = list(source_score.parts)
    if len(parts) >= 2:
        melody_source, bass_source = _pick_melody_and_bass_parts(parts)
        melody_part = copy.deepcopy(melody_source)
        bass_part = copy.deepcopy(bass_source)
        melody_part.transpose(semitone_shift, inPlace=True)
        bass_part.transpose(semitone_shift, inPlace=True)
        melody_score = _single_part_score(source_score, melody_part, "Melodia")
        bass_score = _single_part_score(source_score, bass_part, "Base")
    else:
        melody_score = _extract_single_staff_score(source_score, target_staff=STAFF_TREBLE)
        bass_score = _extract_single_staff_score(source_score, target_staff=STAFF_BASS)
        melody_score.transpose(semitone_shift, inPlace=True)
        bass_score.transpose(semitone_shift, inPlace=True)

    return [
        ScoreArtifact(
            label=f"Melodia (clave de Sol) para {target_instrument.display_name}",
            stem=f"wflyer_melodia_{target_instrument.instrument_id}",
            score=melody_score,
        ),
        ScoreArtifact(
            label=f"Base (clave de Fa) para {target_instrument.display_name}",
            stem=f"wflyer_base_{target_instrument.instrument_id}",
            score=bass_score,
        ),
    ]


def _pick_melody_and_bass_parts(parts: list[stream.Part]) -> tuple[stream.Part, stream.Part]:
    scored = sorted(parts, key=_part_pitch_center)
    bass_part = scored[0]
    melody_part = scored[-1]
    return melody_part, bass_part


def _part_pitch_center(part_stream: stream.Part) -> float:
    midi_values: list[int] = []
    for element in part_stream.recurse().notesAndRests:
        if isinstance(element, note.Note):
            midi_values.append(int(element.pitch.midi))
        elif isinstance(element, chord.Chord):
            midi_values.extend(int(pitch.midi) for pitch in element.pitches)

    if not midi_values:
        return float(MIDDLE_C_MIDI)
    return sum(midi_values) / len(midi_values)


def _single_part_score(source_score: stream.Score, part_stream: stream.Part, title_suffix: str) -> stream.Score:
    result = stream.Score()
    result.insert(0, part_stream)
    result.metadata = copy.deepcopy(source_score.metadata) if source_score.metadata else metadata.Metadata()
    if result.metadata.title:
        result.metadata.title = f"{result.metadata.title} - {title_suffix}"
    else:
        result.metadata.title = f"WFlyer - {title_suffix}"
    return result


def _transpose_notes_by_staff(
    score_stream: stream.Score,
    semitone_shift: int,
    target_staff: str,
) -> None:
    for current_note in score_stream.recurse().getElementsByClass(note.NotRest):
        if _belongs_to_staff(current_note, target_staff=target_staff):
            current_note.transpose(semitone_shift, inPlace=True)


def _extract_single_staff_score(source_score: stream.Score, target_staff: str) -> stream.Score:
    extracted = copy.deepcopy(source_score)
    for element in list(extracted.recurse().getElementsByClass(chord.Chord)):
        selected_pitches = [
            pitch
            for pitch in element.pitches
            if _pitch_belongs_to_staff(
                pitch_midi=int(pitch.midi),
                event=element,
                target_staff=target_staff,
            )
        ]
        if not selected_pitches:
            _remove_element(element)
            continue

        replacement = (
            note.Note(selected_pitches[0])
            if len(selected_pitches) == 1
            else chord.Chord(selected_pitches)
        )
        replacement.duration = copy.deepcopy(element.duration)
        replacement.tie = copy.deepcopy(element.tie)
        replacement.style = copy.deepcopy(element.style)
        replacement.expressions = copy.deepcopy(getattr(element, "expressions", []))
        replacement.articulations = copy.deepcopy(getattr(element, "articulations", []))
        _replace_element(element, replacement)

    for element in list(extracted.recurse().getElementsByClass(note.Note)):
        if isinstance(element.activeSite, chord.Chord):
            continue
        if not _belongs_to_staff(element, target_staff=target_staff):
            _remove_element(element)

    return extracted


def _belongs_to_staff(event: note.NotRest, target_staff: str) -> bool:
    if isinstance(event, note.Note):
        return _pitch_belongs_to_staff(
            pitch_midi=int(event.pitch.midi),
            event=event,
            target_staff=target_staff,
        )

    if isinstance(event, chord.Chord):
        if target_staff == STAFF_TREBLE:
            return max(int(pitch.midi) for pitch in event.pitches) >= MIDDLE_C_MIDI
        return min(int(pitch.midi) for pitch in event.pitches) < MIDDLE_C_MIDI

    return False


def _pitch_belongs_to_staff(pitch_midi: int, event: note.NotRest, target_staff: str) -> bool:
    event_clef = event.getContextByClass(clef.Clef)
    if isinstance(event_clef, clef.TrebleClef):
        return target_staff == STAFF_TREBLE
    if isinstance(event_clef, clef.BassClef):
        return target_staff == STAFF_BASS

    if target_staff == STAFF_TREBLE:
        return pitch_midi >= MIDDLE_C_MIDI
    return pitch_midi < MIDDLE_C_MIDI


def _remove_element(element: note.NotRest) -> None:
    if element.activeSite is not None:
        element.activeSite.remove(element)


def _replace_element(old_element: note.NotRest, new_element: note.NotRest) -> None:
    if old_element.activeSite is not None:
        old_element.activeSite.replace(old_element, new_element)
