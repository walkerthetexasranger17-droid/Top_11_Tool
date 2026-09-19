# Top Eleven Tool — v0.6.44 Recovery Handoff

## Current baseline
- v0.6.44 is the current UI/runtime baseline.
- It is a missed-surface cleanup after the v0.6.42 deep glass audit and v0.6.43 visual-verification correction.
- Decision/football baseline stays frozen at v0.5.17.
- Scanner stays VERSION=12.
- v0.6.39 Training/Drills category tints and gold Mastercard treatment remain authoritative.
- v0.6.40 manager-avatar centring/high-resolution Google photo handling remains preserved.

## Why v0.6.44 exists
Phone testing of v0.6.43 showed that most of the app matched the intended glass system, but a few interactive-state surfaces were still using legacy solid/near-opaque styling. The misses were concentrated in generated Training results and Efficiency & Resources, the scanner upload well, and primary lime actions that still read as opaque neon slabs.

## v0.6.44 corrections
- Primary actions stay lime from edge to edge with cyan/blue framing, but the lime fill is now translucent glass rather than an opaque slab. There is no half-lime/half-dark treatment.
- Generated Training drill cards keep the approved category colour language while using translucent category glass.
- The generated Training session shell no longer uses the old ~97–99% navy `--training-panel` paint.
- Efficiency & Resources metric tiles are translucent glass.
- Scanner Skills Screenshot upload well/progress surface is translucent rather than the old solid `#03101b`-style fill.
- Settings helper/status surfaces do not reintroduce legacy solid fills.
- Existing Home/Squad glass, swipe-delete underlay protection, Training/Drills category colours and gold Mastercard framing remain unchanged.

## Frozen logic
No football decisions, Team Plan logic, training optimiser scoring, drill availability logic, Mastercard consumption rules, scanner recognition/calibration, Firebase/cloud behaviour or squad data model were changed.

## Remaining redesign work
Still image-dependent / deliberately not final: Team Plan imagery, Update Player dedicated background/header, Login/Splash, and Player Profile dedicated imagery/redesign.

## Release rule
Do not regress the generated Training shell, Efficiency metrics or scanner upload well back to opaque legacy fills. `tests/v0644_missed_surface_contract.py` and `tests/v0644_missed_surface_visual.py` protect these states.
