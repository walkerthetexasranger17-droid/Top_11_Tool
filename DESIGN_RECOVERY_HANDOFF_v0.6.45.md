# Top Eleven Tool — v0.6.45 Recovery Handoff

## Current baseline
- v0.6.45 is the current UI/runtime baseline.
- It is a focused visual-consistency follow-up to the v0.6.42-v0.6.44 glass/surface work.
- Decision/football baseline stays frozen at v0.5.17.
- Scanner stays VERSION=12.
- v0.6.39 Training/Drills category tints and gold Mastercard treatment remain authoritative.
- v0.6.40 manager-avatar centring/high-resolution Google photo handling remains preserved.
- v0.6.43 Home/Squad phone-opacity correction and v0.6.44 missed-surface cleanup remain preserved.

## Why v0.6.45 exists
Phone review showed that the app glass system was now broadly correct, but green primary buttons still used their own translucent-lime approximation. The user explicitly selected the **Individual Training active tab** as the visual reference and asked for every green button to match that code exactly for consistency.

## Authoritative green-button contract
For every enabled green primary action, the final computed style must match the Individual Training active tab:
- Background: `linear-gradient(135deg, rgba(119, 200, 34, 0.25), rgba(4, 20, 32, 0.48))`
- Border: `rgba(168, 255, 25, 0.52)`
- Text: `rgb(244, 255, 220)` / `#f4ffdc`
- Shadow: bottom lime inset keyline plus subtle lime glow (`inset 0 -2px 0 var(--v6-lime), 0 0 18px rgba(168,255,25,.08)`)
- No extra backdrop blur on the button itself.

The v0.6.45 browser parity test compares computed styles rather than only checking CSS tokens. It verified 23 enabled green primary controls plus the Team Plan active segmented tab against the Individual Training reference.

## Scope
- All enabled `.btn.primary` controls now use the exact reference treatment.
- `squad-action-add`, scanner/upload CTA-like green controls and training CTA-like controls use the same treatment.
- Team Plan active segmented tabs no longer retain the old black-text variant; they match the same green active-tab language.
- Disabled primary controls remain subdued and are the deliberate exception.
- Button geometry, spacing, labels and functionality were not redesigned.

## Frozen logic
No football decisions, Team Plan recommendation logic, training optimiser scoring, drill availability, Mastercard consumption rules, scanner recognition/calibration, Firebase/cloud behaviour or squad data model were changed.

## Remaining redesign work
Still image-dependent / deliberately not final: Team Plan imagery, Update Player dedicated background/header, Login/Splash, and Player Profile dedicated imagery/redesign.

## Release rule
Do not introduce a separate green-button palette again. The Individual Training active tab is the canonical visual source for enabled green primary actions. `tests/v0645_green_button_parity.py` protects computed-style parity.
