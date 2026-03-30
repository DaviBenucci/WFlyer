from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path


@dataclass(frozen=True)
class CorrectionRecord:
    timestamp_utc: str
    pdf_name: str
    detected_instrument_id: str | None
    selected_instrument_id: str
    detection_confidence: float | None


def append_correction(
    history_path: Path,
    pdf_name: str,
    detected_instrument_id: str | None,
    selected_instrument_id: str,
    detection_confidence: float | None,
) -> None:
    history = _load_history_dict(history_path)
    records = history.setdefault("records", [])
    records.append(
        {
            "timestamp_utc": datetime.now(tz=timezone.utc).isoformat(),
            "pdf_name": pdf_name,
            "detected_instrument_id": detected_instrument_id,
            "selected_instrument_id": selected_instrument_id,
            "detection_confidence": detection_confidence,
        }
    )
    history_path.parent.mkdir(parents=True, exist_ok=True)
    history_path.write_text(json.dumps(history, indent=2), encoding="utf-8")


def get_recent_corrections(history_path: Path, limit: int = 15) -> list[CorrectionRecord]:
    history = _load_history_dict(history_path)
    raw_records = history.get("records", [])
    recent = raw_records[-limit:]
    return [
        CorrectionRecord(
            timestamp_utc=str(item.get("timestamp_utc", "")),
            pdf_name=str(item.get("pdf_name", "")),
            detected_instrument_id=_optional_str(item.get("detected_instrument_id")),
            selected_instrument_id=str(item.get("selected_instrument_id", "")),
            detection_confidence=_optional_float(item.get("detection_confidence")),
        )
        for item in reversed(recent)
    ]


def _load_history_dict(history_path: Path) -> dict:
    if not history_path.exists():
        return {"records": []}

    try:
        content = history_path.read_text(encoding="utf-8")
        parsed = json.loads(content)
        if isinstance(parsed, dict):
            parsed.setdefault("records", [])
            return parsed
    except Exception:
        pass

    return {"records": []}


def _optional_str(value: object) -> str | None:
    if value is None:
        return None
    return str(value)


def _optional_float(value: object) -> float | None:
    if value is None:
        return None
    try:
        return float(value)
    except Exception:
        return None

