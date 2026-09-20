# Top Eleven Tool — v0.6.38 Recovery Handoff

## Current baseline
- v0.6.38 is the current development baseline.
- Home, Squad, Training, Add Player, Settings and Manager Profile remain preserved from v0.6.37 except for the shared drill-card colour treatment on Training.
- Drills page now uses its approved portrait background and redesigned library structure.
- Decision/football baseline remains frozen at v0.5.17.
- Scanner calibration remains VERSION=12.
- Continue split packaging: lean deploy ZIP + full recovery ZIP.

## v0.6.38 scope — Drills + Master Card integration
### Drills background
- Approved source: `assets/v0624/reference-backgrounds/drills-approved.png`.
- Runtime asset: `assets/v0638/backgrounds/drills.webp`.
- The legacy Drills hero artwork is suppressed so the approved portrait artwork is the page surface.

### Top summary
The previous four counters were replaced by three purposeful cards:
1. Master Cards — total consumable Master Card stock currently owned.
2. Normal Drills Unlocked — unlocked normal drills shown as `x / 29`.
3. Max-Level Drills — number of unlocked normal drills at the verified maximum regular level (`World-class`, level id 3 in build 30527).

Do not confuse max-level normal drills with consumable Master Cards.

### Library order and category treatment
- Master Drill Cards are above the normal-drill library.
- Normal drills are grouped in this exact order: Attacking, Defending, Possession, Physical & Mental.
- Category colour contract:
  - Attacking = red
  - Defending = green
  - Possession = yellow
  - Physical & Mental = blue
- Normal drill cards receive a translucent category wash plus matching category border/accent.
- Master Drill Cards retain their category tint/accent but add a gold consumable frame.
- Training recommendation cards use the same category system; Master recommendations add the same gold treatment.

### Master Card consumption
- Building/rebuilding a recommendation does **not** consume stock.
- Leaving the page, refreshing, or abandoning a generated recommendation does **not** consume stock.
- Master Card usage is deducted only when `Mark Session Completed` is confirmed.
- Deduction is clamped at zero and occurs once per completed session.
- After deduction, future Build Session calculations read the updated stock. An exhausted Master Card is therefore excluded from the next recommendation automatically.
- The completed-session message explicitly notes when a used Master Card has reached zero stock.

## Preserved / deferred
- No training scoring, drill gain, white/grey-skill, formation, tactics, mentor, scanner or player-calibration changes.
- Update Player still awaits its dedicated background/title artwork based on the user-supplied player-assessment reference.
- Login/splash redesign remains deferred.
