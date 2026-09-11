# Scanner v3 — Gemini Developer API free-tier setup

## Architecture

v5.2.12 is a static browser/PWA scanner. The selected Skills screenshot is sent directly from the user's browser to the Gemini Developer API using `gemini-3.8-flash` first and `gemini-3.7-flash` only when 3.8 returns a transient capacity/high-demand error.

The request contains three images:

1. the player Skills screenshot;
2. `assets/scanner/playstyles-reference.png` — 20 playstyles across Standard, Intermediate, Advanced and Master visual levels;
3. `assets/scanner/special-abilities-reference.jpg` — all 19 current special ability icons with names.

The model is instructed to read exact visible numbers without repairing them, visually identify playstyle + level from the badge, and inspect the complete Special Ability row. `specialAbilities` is an array with no two-item cap.

## Free-tier setup

Use Google AI Studio. Import the existing project `top-eleven-scanner-shaun` if needed, then create a Gemini API key from Dashboard -> API Keys. Do not upgrade the project to paid billing if the requirement is £0 usage.

Paste the key in **More -> Settings -> Gemini Scanner · Free Tier**. The key is saved only to browser `localStorage` under `te:scanner:geminiApiKey`; it is not present in application source or the package.

## Cost boundary

This build has no Cloud Vision, Cloud Run, Vertex AI, or paid fallback. A genuine free-tier quota/rate-limit 429 is surfaced and the scan stops. Temporary overload/capacity errors automatically retry once on Gemini 3.7 Flash. The app itself cannot prevent charges if the user later upgrades the underlying Gemini project to a paid billing tier, so keeping the project on Free Tier is part of the deployment contract.

## Evidence / reconciliation boundary

The app calculates group-average and OVR consistency after the Gemini response. Those checks never mutate the AI result. A mismatch is shown to the user for correction/manual verification.
