# Top Eleven Tool v5.2.10 — Build 30527

Static GitHub Pages/PWA companion app. The application contract remains `docs/TOP_ELEVEN_TOOL_BIBLE_BUILD_30527_v1.md`; v5.2.10 changes only the Scanner v3 connection model and keeps the rest of the app intact.

## Scanner v3 — Gemini free-tier path

The old Scanner v2 digit-template/reconciliation engine is not in the production scan path.

- Gemini 3.8 Flash reads the original Top Eleven Skills screenshot directly.
- The scan request includes the recovered official 20-playstyle × 4-level reference sheet and the canonical 19-special-ability reference sheet.
- Players may have zero, one, two, three or more special abilities. The scanner contract returns an array and explicitly requires every visible icon in left-to-right order.
- The app never rewrites a detected number to make OVR or group totals fit. Cross-checks only flag discrepancies for review.
- No Cloud Vision, Cloud Run, Vertex AI or paid fallback is used in v5.2.10.
- The Gemini API key is entered in Settings and stored only in this browser (`localStorage`). It is not in the ZIP or source code.

## £0 setup

See `SETUP_GEMINI_FREE.txt` or `docs/SCANNER_V3_GEMINI_FREE.md`.

The user must keep the Google AI Studio project on the **Free Tier**. If free quota/rate limits are exhausted, the app reports the 429 error and stops; it does not switch to another paid API. If the user later upgrades that Google project to paid billing, Google pricing can apply.

## Tests

Run from the project root:

```bash
node tests/core-tests.js
python tests/scanner_regression.py
python tests/static_checks.py
python tests/package_integrity.py
```

A live Gemini acceptance test is included as `tests/gemini_scanner_live.py`; it runs only when `GEMINI_API_KEY` is present in the environment.
