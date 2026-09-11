# Top Eleven Tool v5.2.18 — Build 30527 Release Report

## Scanner simplification

- Switched scanner model from Gemini 3.8 Flash to Gemini 3.6 Flash.
- Gemini receives one player screenshot only.
- Scanner extracts only name, age, OVR, natural roles, group totals and all 15 skills.
- Playstyle and Special Ability recognition were removed from the scanner.
- Playstyle, level and Special Abilities remain manual Review fields.
- Removed production scanner visual-reference manifest, playstyle-level assets, playstyle reference assets, Special Ability reference assets and local visual matching code.
- No OCR/template engine was added.
- Added automatic retry for temporary/network/rate-limit/timeout/malformed/incomplete/inconsistent scan results.
- Retry backoff becomes 2s → 4s → 8s → 12s → 15s and remains at 15s until success or cancellation.
- Daily quota, authentication, invalid-image and unavailable-model errors stop immediately.

## Validation

A Gemini result is not released to Review until all required core fields and skill values are present and existing arithmetic checks pass. The scanner never edits a returned number to force a pass.

## Regression status

Run locally before packaging:
- core deterministic suite
- scanner retry/error-classification suite
- simplified scanner contract regression
- static integrity checks
- navigation/queue contract
- PWA package integrity
