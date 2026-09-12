# Scanner setup — v0.4.11

The production scanner is the already-tested scanner retained from the previous build. Repository cleanup must not replace or simplify its logic.

## Configure it

1. Open **Settings** in the app.
2. Paste the Google AI Studio API key into **Gemini Scanner**.
3. Select **Save Key**.
4. Select **Test Connection**.
5. The app should report the Gemini 3.1 Flash Live connection and HIGH-thinking scanner configuration.

The key is stored only in the browser under `te:scanner:geminiApiKey`; it is not packaged in the repository or synced to Firestore.

## Production scan pipeline

- Gemini 3.1 Flash Live (`gemini-3.1-flash-live-preview`).
- HIGH thinking.
- Native phone screenshots are normalised internally.
- Dedicated goalkeeper/outfield layout handling.
- Separate core-data pass.
- Separate playstyle-identity pass.
- Separate playstyle-level pass.
- Independent classification for each occupied Special Ability slot.
- Special Ability learning/progress (for example `3/50`) remains distinct from an unlocked ability.
- Every result remains editable in Review before saving.

The four packaged visual reference indexes are under `assets/scanner/`.

Benchmark answers are not shipped inside the production scanner and are not sent to Gemini.
