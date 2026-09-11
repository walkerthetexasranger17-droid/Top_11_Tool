# Top Eleven Tool v5.2.14 — Build 30527 Release Report

## Changes
- `js/scanner-engine.js`: Gemini 3.8-only production path; playstyle Locked/Potential support; stricter badge-state visual rules.
- `js/app.js`: indefinite automatic retry for retryable Gemini 3.8 conditions with capped backoff; Locked added to manual playstyle tier selector/save path.
- `assets/scanner/playstyles-reference.png`: augmented with real Ariel Bravo Locked and François Roelandt Intermediate badge examples.
- `tests/`: added Locked/Intermediate fixtures and updated 3.8-only retry contracts.
- `index.html`, `sw.js`, docs: v5.2.14 labels/cache/copy.

## Retry behaviour
Gemini 3.8 Flash is the only model. Temporary busy/overloaded/rate-limit/network errors are automatically retried. Backoff is 10s, 20s, 45s, 90s, then 120s between subsequent attempts, respecting longer provider Retry-After values. Daily quota uses at least a 15-minute delay. Retryable items remain queued until success or explicit user removal. Hard authentication/request/image/schema failures stop and require correction. No paid fallback is used.

## Playstyle regression
- Ariel Bravo: Winger — Locked/Potential (level 1).
- François Roelandt: False Nine — Intermediate (level 3).
The scanner now explicitly treats a padlock as Locked and a 1-bar unlocked frame as Intermediate.
