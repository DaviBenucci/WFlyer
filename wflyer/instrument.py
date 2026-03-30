from __future__ import annotations

import re
from dataclasses import dataclass

from unidecode import unidecode


@dataclass(frozen=True)
class InstrumentProfile:
    instrument_id: str
    display_name: str
    written_to_concert: int
    aliases: tuple[str, ...]
    is_harmonic: bool = False
    target_enabled: bool = True


@dataclass(frozen=True)
class DetectionCandidate:
    instrument: InstrumentProfile
    alias: str
    score: float


@dataclass(frozen=True)
class InstrumentDetection:
    instrument: InstrumentProfile
    confidence: float
    matched_alias: str
    candidates: tuple[DetectionCandidate, ...]


INSTRUMENTS: tuple[InstrumentProfile, ...] = (
    InstrumentProfile(
        instrument_id="piano",
        display_name="Piano (Do/Concerto)",
        written_to_concert=0,
        aliases=("arranged for piano", "for piano", "piano", "teclado", "keyboard"),
        is_harmonic=True,
        target_enabled=False,
    ),
    InstrumentProfile(
        instrument_id="concert_c",
        display_name="Instrumento em Do (Concerto)",
        written_to_concert=0,
        aliases=(
            "concert c",
            "in c",
            "flauta",
            "flute",
            "violino",
            "violin",
            "oboe",
            "trombone",
            "c instrument",
        ),
    ),
    InstrumentProfile(
        instrument_id="trumpet_bb",
        display_name="Trompete em Sib",
        written_to_concert=-2,
        aliases=("trumpet", "trompete", "trp. bb", "in bb", "bb trumpet"),
    ),
    InstrumentProfile(
        instrument_id="clarinet_bb",
        display_name="Clarinete em Sib",
        written_to_concert=-2,
        aliases=("clarinet", "clarinete", "cl. bb", "bb clarinet"),
    ),
    InstrumentProfile(
        instrument_id="sax_alto_eb",
        display_name="Sax Alto em Mib",
        written_to_concert=-9,
        aliases=("alto sax", "sax alto", "eb alto sax", "mib alto", "eb"),
    ),
    InstrumentProfile(
        instrument_id="sax_tenor_bb",
        display_name="Sax Tenor em Sib",
        written_to_concert=-14,
        aliases=("tenor sax", "sax tenor", "bb tenor sax", "sax tenor in bb"),
    ),
    InstrumentProfile(
        instrument_id="horn_f",
        display_name="Trompa em Fa",
        written_to_concert=-7,
        aliases=("f horn", "horn in f", "trompa"),
    ),
)

INSTRUMENTS_BY_ID = {instrument.instrument_id: instrument for instrument in INSTRUMENTS}
DEFAULT_TARGET_INSTRUMENT_ID = "trumpet_bb"


def normalize_text(value: str) -> str:
    lowered = unidecode(value or "").lower()
    return " ".join(lowered.split())


def detect_instrument_with_confidence(raw_text: str) -> InstrumentDetection | None:
    normalized = normalize_text(raw_text)
    if not normalized:
        return None

    best_by_instrument: dict[str, DetectionCandidate] = {}
    for instrument in INSTRUMENTS:
        for alias in instrument.aliases:
            alias_norm = normalize_text(alias)
            if not alias_norm:
                continue

            if alias_norm in normalized:
                score = _score_alias_match(normalized, alias_norm)
                current = best_by_instrument.get(instrument.instrument_id)
                if current is None or score > current.score:
                    best_by_instrument[instrument.instrument_id] = DetectionCandidate(
                        instrument=instrument,
                        alias=alias,
                        score=score,
                    )

    if not best_by_instrument:
        return None

    ranked = sorted(best_by_instrument.values(), key=lambda item: item.score, reverse=True)
    best = ranked[0]
    second_score = ranked[1].score if len(ranked) > 1 else 0.0
    confidence = _estimate_confidence(best.score, second_score)

    if best.score < 0.35:
        return None

    return InstrumentDetection(
        instrument=best.instrument,
        confidence=confidence,
        matched_alias=best.alias,
        candidates=tuple(ranked[:3]),
    )


def detect_instrument_from_text(raw_text: str) -> InstrumentProfile | None:
    detection = detect_instrument_with_confidence(raw_text)
    return detection.instrument if detection else None


def get_instrument_choices() -> list[InstrumentProfile]:
    return list(INSTRUMENTS)


def get_target_instrument_choices() -> list[InstrumentProfile]:
    return [instrument for instrument in INSTRUMENTS if instrument.target_enabled]


def get_instrument_by_id(instrument_id: str) -> InstrumentProfile:
    return INSTRUMENTS_BY_ID[instrument_id]


def semitones_from_source_to_target(source: InstrumentProfile, target: InstrumentProfile) -> int:
    return source.written_to_concert - target.written_to_concert


def _score_alias_match(normalized_text: str, alias: str) -> float:
    position = normalized_text.find(alias)
    token_count = len(alias.split())
    length_score = min(0.40, len(alias) / 28.0)
    token_score = min(0.20, max(0, token_count - 1) * 0.06)
    position_score = 0.17 if position >= 0 and position < 280 else 0.07

    boundary_pattern = r"(^|\W)" + re.escape(alias) + r"($|\W)"
    boundary_bonus = 0.10 if re.search(boundary_pattern, normalized_text) else 0.0

    return min(0.98, 0.20 + length_score + token_score + position_score + boundary_bonus)


def _estimate_confidence(best_score: float, second_score: float) -> float:
    margin = max(0.0, best_score - second_score)
    raw_confidence = 0.42 + (best_score * 0.35) + (margin * 0.55)
    return round(min(0.99, max(0.05, raw_confidence)), 3)

