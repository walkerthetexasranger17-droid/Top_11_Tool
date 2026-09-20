# v0.5.17 DEV PASS8 — Automatic Existing-Player Update

## Product contract

Bulk **Update Players** requires no per-screenshot player selection. The normal successful path is:

`screenshot → read visible name → match My Squad → read age + skills → derive OVR from all 15 skills → verify/write/read-back → remove row → continue`

The screenshot name is a routing identifier only. It is never written to the saved player. OVR is not scanned in update mode: it is deterministically recalculated as the rounded arithmetic mean of the complete 15-skill set. Natural/related roles, Playstyle, Playstyle level and Special Abilities remain preserved byte-for-byte.

## Matching boundary

`TE.Players.matchPlayerByName()` performs:

1. Unicode-aware, case/accent/punctuation-insensitive exact-name matching.
2. If no exact match exists, conservative Levenshtein OCR tolerance (`>= 0.90`) with a minimum separation (`>= 0.08`) from the next candidate.
3. Duplicate exact names, near-tie fuzzy candidates, blank names and unrelated names return no player.

The queue never picks an arbitrary first candidate.

## Scanner boundary

`scanUpdate()` remains the lightweight update scanner. Its v2 response contains only:

- visible name — match only;
- age;
- displayed group totals for aggregate verification;
- the 15 visible skills for the detected GK/outfield layout;
- uncertainty/notes.

It does not request OVR, roles, Playstyle or Special Abilities. When no profile target is pinned, the client detects GK vs outfield from the screenshot before building the update board.

## Automatic save gate — PASS9 corrected

Pass8 incorrectly treated **any** scanner uncertainty string as a hard veto. Live testing showed the consequence: screenshots could visibly scan/match while never reaching the persistence call.

Pass9 requires the deterministic boundary first:

- exactly one safe name match exists;
- saved-player GK/outfield identity agrees with screenshot layout;
- age and all 15 skills are present and within 0–520;
- scanner validation resolves;
- all displayed-total aggregate checks exist and pass.

If the scanner uncertainty list is empty, the update may save immediately. If uncertainty remains despite the deterministic checks passing, the queue runs a **second independent read**. It auto-saves only when the second read is clean or reproduces the same matched target, normalized detected name, age, layout and all 15 skills exactly. Any disagreement stops for review rather than guessing.

Persistence is a verified boundary: `Players.updateAgeSkillsOnly()` writes age + the complete visible skill set + derived OVR to the existing player key, reloads the player and compares age, OVR and every saved skill before the queue can report success/remove the row.

## Persistence migration

Pass7 queue entries that were waiting in `needs-target` state are migrated to `queued` on restore. Old ready update scans are rescanned under the new v2 name-match scope instead of being trusted without a visible-name check.
