# v0.5.17 DEV PASS8 — Automatic Existing-Player Update

## Product contract

Bulk **Update Players** requires no per-screenshot player selection. The normal successful path is:

`screenshot → read visible name → match My Squad → read age + skills → verify → save age + skills only → remove row → continue`

The screenshot name is a routing identifier only. It is never written to the saved player. OVR, natural/related roles, Playstyle, Playstyle level and Special Abilities remain preserved byte-for-byte through the update mutation boundary.

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

## Automatic save gate

An update auto-saves only when all of the following hold:

- exactly one safe name match exists;
- saved-player GK/outfield identity agrees with screenshot layout;
- age and all 15 skills are present and within 0–520;
- scanner validation resolves;
- aggregate checks do not fail;
- scanner uncertainty list is empty.

A match/verification failure gets one automatic re-scan. If still unresolved, the row remains for attention and no player record is modified.

## Persistence migration

Pass7 queue entries that were waiting in `needs-target` state are migrated to `queued` on restore. Old ready update scans are rescanned under the new v2 name-match scope instead of being trusted without a visible-name check.
