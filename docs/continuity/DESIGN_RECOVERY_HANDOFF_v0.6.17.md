# Top Eleven Tool — v0.6.17 Recovery Handoff

## Pass scope
Narrow mobile Home correction only: fix the Highest OVR player portrait alignment/scale reported from the real deployed phone build.

## Changes completed
- Highest OVR role/player artwork no longer stretches down the right edge of the stat card.
- Phone portrait uses a small square crop anchored to the upper-right of the Highest OVR card, matching the approved mobile reference treatment.
- Reserved text space prevents the OVR/name block colliding with the portrait.
- Tablet portrait receives the same square-thumbnail treatment at a larger size.
- Runtime/cache identity bumped to v0.6.17 so deployed clients do not retain the v0.6.16 CSS.
- No scanner, training, formation, tactics, Mentor, Team Plan, Best-in-Slot, strategy or calibration logic changed.

## Mobile product priority
Phone/tablet remains the product/design target. Desktop only needs to remain functional.

## Next step
Deploy v0.6.17 with the user's real cloud squad and verify the Highest OVR thumbnail on-device. Continue mobile Home polish only from real-device feedback; do not move to another page until Home is accepted.
