# Top Eleven Tool v0.6.52

> **Current branch: v0.6.52 / Drain Limit behavior fix.** Team Plan visuals from v0.6.49–v0.6.51 remain authoritative. The active football decision baseline is v0.5.18, which changes Drain Limit from a widening ceiling to an explicit Low/Medium/High intent band while preserving the existing own-squad scoring model inside each band. Scanner VERSION=12 is unchanged.

## Important current behavior
- Formation and Set Pieces use the locked pitch/shirt/nameplate assets.
- Tactics uses the phased Top Eleven-inspired layout.
- Changing Approach or Drain Limit keeps the selected XI fixed and recalculates tactics only.
- Low / Medium / High now return tactics inside the requested drain class.
- Opponent information remains permanently out of scope.

Read `START_HERE.md`, `DESIGN_RECOVERY_HANDOFF_v0.6.52.md`, and `CALIBRATION_RECOVERY_HANDOFF_v0.5.18.md` before changing anything.
