# v0.6.45 Green-Button Parity Validation

## Scope
Focused visual consistency correction only. No logic recalibration and no redesign of already-approved surfaces.

## Authoritative reference
The **Individual Training** active segmented tab is the source of truth. Enabled green primary actions must match its computed background image, transparent base, border colour, box shadow, text colour and no-backdrop-filter behaviour exactly.

## Protected behaviours
- All enabled `.btn.primary` controls use the same green glass treatment as Individual Training.
- Squad Add Player uses the same treatment.
- Scanner/upload and training CTA-like green controls use the same treatment.
- Team Plan active segmented tabs cannot retain the older black-text treatment.
- Disabled primary controls remain visibly disabled.
- v0.6.42-v0.6.44 glass hierarchy, generated Training category cards, Drills category colours, gold Mastercards and swipe-delete protections remain unchanged.

## Automated coverage
- `tests/v0645_green_button_parity.py` — direct computed-style parity against the live Individual Training reference.
- Existing current release/static/core/scanner/navigation/cloud/player-update/Mastercard/package audits.
