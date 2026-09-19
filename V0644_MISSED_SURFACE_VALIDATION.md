# v0.6.44 Missed-Surface Validation

## Scope
Focused visual cleanup only. No redesign of already-correct surfaces and no decision/scanner/training-logic recalibration.

## Protected visual contracts
- Full-width lime primary actions use a translucent lime-glass fill and cyan frame; no navy/dark half-fill.
- Generated Training session shell is glass rather than the legacy near-opaque training panel.
- Generated drill cards retain category-specific red/green/yellow/blue glass treatments; Mastercards retain gold framing.
- Efficiency & Resources metric tiles are glass.
- Scanner Skills Screenshot upload well/progress area is glass.
- Home/Squad v0.6.43 corrections remain intact.

## Automated coverage
- `tests/v0644_missed_surface_contract.py`
- `tests/v0644_missed_surface_visual.py`
- Existing static/core/scanner/navigation/cloud/player-update/Mastercard/visual contracts.
