from wflyer.instrument import (
    detect_instrument_from_text,
    detect_instrument_with_confidence,
    get_instrument_by_id,
    semitones_from_source_to_target,
)


def test_detect_piano_from_header_text() -> None:
    header = "Arranged for piano\nHikaru Nara\nBy Goose House"
    detected = detect_instrument_from_text(header)
    assert detected is not None
    assert detected.instrument_id == "piano"


def test_detect_trumpet_from_header_text() -> None:
    header = "Concerto Piece\nTrumpet in Bb"
    detected = detect_instrument_from_text(header)
    assert detected is not None
    assert detected.instrument_id == "trumpet_bb"


def test_detection_returns_confidence_and_candidates() -> None:
    header = "Lead Sheet\nArranged for piano and violin"
    detection = detect_instrument_with_confidence(header)
    assert detection is not None
    assert detection.instrument.instrument_id == "piano"
    assert 0.0 < detection.confidence <= 1.0
    assert len(detection.candidates) >= 1


def test_unknown_instrument_returns_none() -> None:
    header = "Work Song for ensemble"
    detected = detect_instrument_from_text(header)
    assert detected is None


def test_transposition_interval_source_to_target() -> None:
    source = get_instrument_by_id("concert_c")
    target = get_instrument_by_id("trumpet_bb")
    semitones = semitones_from_source_to_target(source, target)
    assert semitones == 2

