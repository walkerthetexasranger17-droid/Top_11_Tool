# Top Eleven Tool v5.2.22 — Build 30527

Static GitHub Pages/PWA companion app. The canonical application contract remains `docs/TOP_ELEVEN_TOOL_BIBLE_BUILD_30527_v1.md`. v5.2.22 is a targeted scanner replacement; training, tactics, formation, mentor and Build 30527 calculations are unchanged.

## Scanner v4 — Gemini 3.1 Flash Live

Scanner v4 replaces the previous core-only Gemini 3.6 path with the tested Gemini 3.1 Flash Live pipeline from the standalone scanner lab.

It uses HIGH thinking and separate visual passes for:
- core player data from fixed 1536×695 Skills screenshots;
- playstyle identity against the official playstyle index;
- playstyle level against the user-approved level reference;
- each occupied Special Ability slot independently against exact-geometry standard and boosted indexes.

The production scanner never receives benchmark answers or known-player expected results. Every detected visual field remains editable before save.

The Gemini API key remains stored only in the browser under `te:scanner:geminiApiKey`.

## Native phone screenshot normalisation

The production scanner measures the original screenshot dimensions in code. Screenshots with the standard Top Eleven Skills layout (including 2688×1216 phone originals) are normalised internally to the proven 1536×695 coordinate frame before any crop or Gemini Live request. Gemini receives a factual size note but does not choose the scale.
