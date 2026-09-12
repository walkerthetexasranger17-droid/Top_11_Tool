# Top Eleven Tool v5.2.20 — Build 30527 Release Report

## Scanner replacement

- Replaced Scanner v3 / Gemini 3.6 Flash `generateContent` with Scanner v4 / `gemini-3.1-flash-live-preview`.
- Uses Gemini Live WebSocket transport and HIGH thinking.
- Ported the scanner lab pipeline that passed the eight-player regression set.
- Core data uses fixed coordinate-labelled evidence from the standard 1536×695 Top Eleven Skills screenshot.
- Playstyle identity is a separate Live visual pass.
- Playstyle level is a separate Live visual pass using the restored level reference that produced successful regression results.
- Special Abilities are detected by code for occupied slots, then each occupied slot is classified independently.
- Added four production reference assets under `assets/scanner/`.
- Reference matching includes global lookalike guidance for similar playstyles and Special Abilities.
- Scanner results now prefill playstyle, level and Special Abilities in Review while remaining editable.
- No benchmark player answers are present in production scanner code.

## Unchanged

Training, tactics, team plan, formation, mentors, storage schema and Build 30527 optimiser logic were not redesigned.
