# Top Eleven Tool v5.2.16 — Build 30527 Release Report

## Scope
Targeted Scanner v3 reference-library replacement only. Existing training, tactics, formation, squad, navigation, queue, storage and Build 30527 calculation logic is retained.

## Scanner reference change
The obsolete generated playstyle/tier combinations and the two old playstyle example assets have been removed from the package.

Production Scanner v3 now uses three separate reference sets:

1. **20 playstyle identity PNGs** copied byte-for-byte from the user-supplied `top-eleven-scanner-assets-preview.rar` asset pack.
2. **4 playstyle-level PNGs** — Locked, Intermediate, Advanced and Master — copied byte-for-byte from the same user-supplied asset pack. These four references intentionally use False Nine; Gemini is instructed to ignore the centre symbol and compare only the frame/segments/padlock.
3. **19 existing individual Special Ability references**.

The source playstyle and level files were verified against the RAR archive metadata by file size and CRC32 before packaging. No cropping, generation, redraw, recolour or substitution is performed by this build step.

## Scanner behaviour
- Gemini 3.8 Flash only.
- No 3.5/3.6/3.7 or paid fallback.
- Retryable 3.8 busy/rate-limit/network/quota conditions stay queued and retry with backoff until success or user removal.
- Playstyle identity and playstyle level are two independent visual classifications.
- Scanner visual level choices are **Locked / Intermediate / Advanced / Master** only.
- Multiple Special Abilities remain supported.
- AI-read values are never rewritten merely to force displayed totals or OVR to match.

## Removed obsolete components
- 80 generated `playstyle--tier.webp` references.
- `references/examples/` playstyle workaround assets.
- Scanner prompt logic that treated identity and tier as one combined reference.

## Known asset-pack fact
The supplied playstyle asset pack is used exactly as provided. It contains `holding-midfielder.png` and does not contain `wing-back.png`; v5.2.16 does not silently reintroduce the old Wing Back artwork or manufacture a replacement.

## Release checks
- Core deterministic suite: PASS — 255 assertions.
- Scanner v3 offline contract: PASS.
- Gemini 3.8-only retry tests: PASS — 11 assertions.
- Navigation/queue contract: PASS — 18 targeted hooks + route invariants.
- Static integrity: PASS — 145 IDs, 9 pages, 135 direct DOM refs, 29 static paths.
- PWA/package integrity: PASS — 112/112 required runtime files precached.
- All 24 packaged user-supplied playstyle/level PNGs match the RAR archive metadata exactly by file size + CRC32.
- JavaScript syntax: PASS.
