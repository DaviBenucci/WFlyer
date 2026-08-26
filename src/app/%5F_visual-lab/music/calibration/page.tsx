import { DRAFT_GLYPH_CALIBRATIONS } from "../_fixtures/draft-calibration";
import { CalibrationWorkbench } from "./CalibrationWorkbench";

export default function MusicCalibrationPage() {
  return (
    <section aria-labelledby="calibration-heading" data-fixture-page="calibration">
      <h2 id="calibration-heading">Gate-B draft glyph calibration</h2>
      <p>
        Proposed nominal sizes and semantic anchors are review data only. This
        workbench cannot modify source path geometry or approve runtime status.
      </p>
      <CalibrationWorkbench
        initialCalibrations={DRAFT_GLYPH_CALIBRATIONS}
      />
    </section>
  );
}
