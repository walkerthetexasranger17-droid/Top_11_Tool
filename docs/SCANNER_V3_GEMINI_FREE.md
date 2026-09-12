# Scanner v4 — Gemini 3.1 Flash Live — v5.2.20

This filename is retained for compatibility with earlier documentation links. The production implementation is Scanner v4.

## Transport and model
- Model: `gemini-3.1-flash-live-preview`
- Gemini Live WebSocket (`BidiGenerateContent`)
- Thinking level: `HIGH`
- API key stored locally in the browser as `te:scanner:geminiApiKey`

## Scan pipeline
1. Build a coordinate-labelled core board from the standard 1536×695 Skills screenshot.
2. Run a dedicated core-data Live pass.
3. Run an independent playstyle-identity pass against the official playstyle reference.
4. Run an independent playstyle-level pass against the user-approved level reference.
5. Detect occupied Special Ability slots locally.
6. Run one independent Live classification pass per occupied ability slot against exact-geometry standard and boosted references.
7. Prefill the existing Review form; the user can correct any result before saving.

Benchmark answers are not shipped in the production scanner and are never sent to Gemini.
