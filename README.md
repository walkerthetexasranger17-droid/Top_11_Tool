# Top Eleven Tool v5.2.19 — Build 30527

Static GitHub Pages/PWA companion app. The canonical application contract remains `docs/TOP_ELEVEN_TOOL_BIBLE_BUILD_30527_v1.md`. v5.2.19 is a targeted scanner simplification release; training, tactics, formation, mentor and Build 30527 calculations are not redesigned.

## Scanner v3 — core data only

The scanner now has one job: read the player's visible core data from the supplied Top Eleven screenshot. It sends one screenshot to Gemini 3.6 Flash and asks for name, age, OVR, natural roles, group totals and all 15 skills.

Playstyle, playstyle level and Special Abilities are no longer scanned or matched. Those fields remain available during Review and are entered manually. The old scanner visual-reference manifest/assets and local icon-matching code are not packaged in this build.

There is no Tesseract/custom OCR, digit-template repair, Cloud Vision, Cloud Run, Vertex AI or paid fallback.

Temporary API failures and incomplete/inconsistent reads retry automatically every 2 seconds until a valid result is returned or the user cancels the queued scan. Auth errors, invalid images, unavailable-model errors and exhausted daily free quota stop immediately.

## Existing app behaviour preserved

- My Squad, Player Profile, Formation, Training, Team Training, Team Plan/Tactics and mentor logic remain intact.
- Player records retain the existing local storage keys and migrations.
- Manual playstyle and Special Ability editing remains available.
- Scanner queue/review persistence, rescan cancellation, swipe-to-delete, navigation drawer and back/refresh behaviour remain intact.

## Scanner configuration

Open **Settings → Gemini Scanner · Free Tier**, paste the Google AI Studio API key and use **Test Connection**. The key remains in browser local storage and is not included in this package.
