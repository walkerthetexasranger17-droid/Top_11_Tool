# Scanner setup — v0.4.14

v0.4.14 uses the approved exact visual reference packs supplied for this build. The legacy composite playstyle/level indexes and the gold/boosted Special Ability reference path have been removed.

## Configure it

1. Open **Settings** in the app.
2. Paste the Google AI Studio API key into **Gemini Scanner**.
3. Select **Save Key**.
4. Select **Test Connection**.
5. The app should report Gemini 3.1 Flash Live, HIGH thinking, 260 exact playstyle-state references and 19 coloured Special Ability references.

The key is stored only in the browser under `te:scanner:geminiApiKey`; it is not packaged in the repository or synced to Firestore.

## Production scan pipeline

- Gemini 3.1 Flash Live (`gemini-3.1-flash-live-preview`).
- HIGH thinking.
- Native phone screenshots are normalised internally.
- Dedicated goalkeeper/outfield layout handling.
- Separate core-data pass.
- Playstyle identity is matched against a runtime board built from the 20 exact **Standard** reference PNGs.
- The app then automatically isolates the tiny playstyle badge from the player-name strip and supplies both raw-pixel and smoothed enlargements to the level pass.
- Level classification uses five **individual full-size exact references** for that same playstyle instead of the old 13-state collage.
- The model must judge the three real outer level-ring segments separately in **right / bottom / left** order: **000 = Standard, 100 = Intermediate, 110 = Advanced, 111 = Master**. Locked requires the real padlock.
- The app independently maps those three segment booleans to the level, so a contradictory text label or count cannot silently override the ring pattern.
- Ready, Boosted and Wrong Position are checked in a separate exact-reference overlay pass and cannot alter the already-resolved underlying level.
- Ball Playing DC versus No-Nonsense DC gets an additional exact two-reference confirmation when that lookalike pair is selected.
- Each occupied Special Ability slot is classified independently against the 19 **coloured** exact references only.
- Gold/boosted Special Ability references are intentionally disabled.
- Special Ability learning/progress (for example `3/50`) remains distinct from an unlocked ability.
- Every result remains editable in Review before saving.

## Reference assets

`assets/scanner/reference-manifest.json` is the integrity manifest for the reference pack.

- 20 playstyles × 13 exact states = **260 playstyle PNGs**.
- **19 coloured Special Ability PNGs**.
- **279 total scanner reference images**.

The manifest stores a SHA-256 for every reference PNG and the regression suite verifies those hashes before release.

Benchmark answers are not shipped inside the production scanner and are not sent to Gemini.
