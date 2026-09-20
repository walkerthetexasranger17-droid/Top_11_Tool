# Top Eleven Tool — v0.6.39 Recovery Handoff

## Current baseline
- v0.6.39 is the current development baseline.
- This pass is a focused visual correction to drill cards only.
- Drills structure/background/master-card inventory behaviour from v0.6.38 is preserved.
- Training recommendation logic is unchanged.
- Decision/football baseline remains frozen at v0.5.17.
- Scanner calibration remains VERSION=12.
- Continue split packaging: lean deploy ZIP + full recovery ZIP.

## v0.6.39 scope — drill card category surface tint
The user clarified that the category colour must tint the **card/container surface** that holds the drill image and text. The drill artwork itself must not be recoloured, filtered or overlaid.

### Category visual contract
- Attacking = red translucent card surface + red category border/accent.
- Defending = green translucent card surface + green category border/accent.
- Possession = yellow translucent card surface + yellow category border/accent.
- Physical & Mental = blue translucent card surface + blue category border/accent.
- The tint is deliberately visible across the whole card/container while preserving the dark app theme and text readability.

### Master Drill Cards
- Gold remains the visual signal that a drill is a consumable Master Card.
- The interior card surface still uses the drill category colour underneath the gold frame.
- Attacking Masterclass = red interior tint + gold frame.
- Midfield Masterclass = yellow/Possession interior tint + gold frame.
- Physical Masterclass = blue interior tint + gold frame.
- Defending Masterclass = green interior tint + gold frame.
- v0.6.38 had a CSS specificity issue where Master Cards inherited the generic cyan fallback; v0.6.39 corrects that by making the category custom properties authoritative.

### Training
- The six generated Individual Training drill cards use the same category-tinted container surfaces as the Drills library.
- Master recommendations keep the gold frame plus their underlying category tint.
- Team Training drill rows use the same category language for consistency.
- Drill images remain visually untouched.

## Preserved / deferred
- No drill catalogue/game-data changes.
- No Master Card stock/consumption logic changes.
- No training scoring, OVR, formation, tactics, mentor, scanner or cloud behaviour changes.
- Remaining image-dependent redesign areas: Team Plan, Update Player, Login/Splash, Player Profile.
