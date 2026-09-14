# v0.5.4 Research Checkpoint — Role-Specific Attribute Priority Hypothesis

**Date:** 14 September 2026  
**Game reference:** build 30527 / Windows package 27.3.0.0  
**Purpose:** preserve the new Formation/Training hypothesis before continuing reverse engineering.

## Why this checkpoint exists

A controlled Lineup Balance substitution produced a result that cannot be explained by player OVR or by an equal-weight average of every white/key attribute for the assigned role.

### Controlled ST comparison

The same formation/slot was tested with two natural STs:

| Player | Quality | Passing | Dribbling | Shooting | Finishing | Positioning | Heading | Strength | Speed | Creativity | Equal-weight ST key mean |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Gosling Lataille | 51 | 52.62 | 52.74 | 53.08 | 57.34 | 54.17 | 55.71 | 53.52 | 54.43 | 50.95 | 53.84 |
| François Roelandt | 44 | 58.37 | 57.44 | 63.46 | 67.82 | 40.82 | 44.99 | 45.37 | 57.10 | 40.94 | 52.92 |

Server Lineup Balance changed from approximately **9.8298** with Lataille to **10.0000** with Roelandt.

Important observations:

- Roelandt had the **lower displayed Quality/OVR**.
- Roelandt also had the **slightly lower equal-weight mean across all nine ST key/white attributes**.
- Roelandt had a very large advantage in **Shooting and Finishing**: 63.46 / 67.82 versus 53.08 / 57.34.
- Both were natural STs, so this was not a natural-vs-related-position explanation.
- Their Playstyles differed (Poacher vs False Nine), so Playstyle remains a possible confounder and must not be silently ruled out.

## What is proven

### LIVE FACT

For this captured test, a lower-OVR natural ST with a slightly lower equal-weight average across all ST white skills produced the better Lineup Balance result.

Therefore neither of these rules can explain the observed server result:

1. `best ST = highest OVR`
2. `best ST = highest equal-weight average of every ST white skill`

### GAME FACT already known

Build 30527 has an exact role -> key/white-attribute map. For ST the current key attributes are:

`Passing, Dribbling, Shooting, Finishing, Positioning, Heading, Strength, Speed, Creativity`.

The client does **not** currently expose a proven equal-weight statement for match importance. The existing white-skill map only proves membership in the role's key set.

## Working research hypothesis — DO NOT PROMOTE TO GAME FACT YET

Top Eleven may assign **unequal importance to key/white attributes within a role**, with a smaller primary subset carrying more role performance / Lineup Balance value than the remaining white attributes.

For ST, the strongest current hypothesis is that **Shooting and Finishing are primary attacking attributes**, with other ST white skills still valuable but not necessarily equal in weight.

The user has independently observed similar behaviour with other in-game player comparisons, which increases the value of testing this hypothesis, but those observations are not yet an authoritative formula.

## Training consequence if the hypothesis is proven

The Training optimiser should not blindly aim to make every white skill equal.

The intended future model is **priority tiers**, for example:

- Primary role skills — trained highest.
- Secondary role skills — kept strong and developed behind the primaries.
- Supporting white skills — maintained rather than neglected.

Numbers such as "primary to 250, others behind" are **illustrative only**. No target values, ratios, caps or per-role weightings are approved until evidence is recovered.

## Formation / recruitment consequence if proven

Target Formation recruitment should eventually evaluate not only:

- natural role;
- OVR;
- all white skills;

but also the **role-specific primary attribute profile**.

This would allow recommendations such as "buy an ST whose primary ST attributes are stronger" rather than simply "buy the highest OVR ST".

## Next research target

Search the exact game package/native metadata/assets for any evidence of a hierarchy inside each role's key attributes, including concepts such as:

- role attribute weights / importance / priorities;
- Football Engine role or action attribute subsets;
- action-specific attribute consumers (shooting, finishing, tackling, marking, passing, crossing, etc.);
- role evaluation/scoring methods;
- Lineup Balance capability/profile inputs;
- training or player-tier definitions that distinguish key attributes by importance.

If no static hierarchy exists, design controlled live Balance experiments that isolate attributes as far as practical. Do not infer exact weights from one ST comparison.

## App rule until resolved

- Preserve the existing exact white-skill membership map.
- Do not assign unequal role weights in production yet.
- Do not use equal-white average as if it were a Nordeus player-role score.
- Record any future role-priority evidence in the permanent build-30527 index.
