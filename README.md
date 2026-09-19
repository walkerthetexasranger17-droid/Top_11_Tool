# Top Eleven Tool v0.6.50

> **Current branch: v0.6.50 / Team Plan Formation spacing + Set Piece pitch map.** The v0.6.42 glass hierarchy and v0.6.45 green-action styling remain authoritative. Frozen v0.5.17 football decision logic and Scanner VERSION=12 are unchanged.

## This pass
- Reduced Formation player shirt/nameplate footprint on portrait so the XI has more breathing room.
- Fixed the tab-state bug where Formation could remain visible underneath Set Pieces because of `display:block!important`.
- Rebuilt Set Pieces as its **own tactical pitch** rather than repeating the Formation XI or using a card grid.
- The Set Piece pitch displays only the assigned takers: Corner Kick L/R, Free Kick L/R, PEN 1–5 and Captain.
- Removed the redundant Set Piece `AUTO` chip, automatic-recommendation description and auto-refresh footnote.
- Continues to use the three exact locked v0.6.49 Team Plan assets without modification.
- Best-in-Slot XI, Squad Blueprint and Build Best Match Plan remain removed.
- Tactics and Mentor logic are unchanged.

Read `START_HERE.md` and `DESIGN_RECOVERY_HANDOFF_v0.6.50.md` before changing anything.

- The three high-resolution Team Plan assets are packaged and runtime-cached on demand rather than install-precached, keeping the PWA install cache bounded.
