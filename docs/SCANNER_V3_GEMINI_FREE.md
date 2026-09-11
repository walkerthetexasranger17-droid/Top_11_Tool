# Scanner v3 — Gemini Developer API free-tier setup

## Architecture

v5.2.13 remains a static browser/PWA scanner. The selected Skills screenshot is sent directly from the user's browser to the Gemini Developer API. The app asks the Gemini `models.list` endpoint which documented full Flash models are available to the API key, then restricts scanning to the stable image-capable pool confirmed for this build: `gemini-3.5-flash`, `gemini-3.6-flash`, `gemini-3.7-flash`, and `gemini-3.8-flash`.

The suggested 3.4 generation is not used because no supported `gemini-3.4-flash` endpoint is documented by the provider. Flash-Lite models are not put into the automatic pool because scanner accuracy remains the priority.

The base preference is 3.7 → 3.6 → 3.5 → 3.8. It is adaptive rather than blindly fixed: the last successful model is preferred, and models that have just returned transient overload/rate-limit responses temporarily cool down before being tried again. The provider's model-list metadata does not expose live load, so the app uses actual responses from this device rather than inventing a load score.

The request contains three images:

1. the player Skills screenshot;
2. `assets/scanner/playstyles-reference.png` — 20 playstyles across Standard, Intermediate, Advanced and Master visual levels;
3. `assets/scanner/special-abilities-reference.jpg` — all 19 current special ability icons with names.

Every model uses the same prompt, normalisation, playstyle/Special Ability handling and numerical validation. `specialAbilities` remains an uncapped array.

## Availability and retry handling

Temporary provider conditions (`429` per-minute/rate-limit, `408`, and `5xx`/capacity responses) are distinguished from authentication/request/schema/scan failures. A temporary model response triggers immediate failover to another ready compatible model. The app stops model failover as soon as a valid response is obtained.

If the whole compatible pool is temporarily unavailable, the queue schedules a bounded delayed retry rather than immediately forcing a manual Retry. Delays use provider `Retry-After`/`RetryInfo` information when available and otherwise use conservative backoff. No infinite retry loop exists. Daily/free-quota exhaustion and actual scan/response failures are not treated as ordinary model congestion.

## Queue persistence

Queue metadata is saved in local app storage and queued screenshots are stored in IndexedDB. Navigation away from Scanner does not stop the queue. A page reload restores queued, waiting and completed results. An in-flight request interrupted by a full reload is deliberately not duplicated automatically; that single item is marked for manual Retry while the remaining queued items can continue.

## Free-tier setup

Use Google AI Studio. Import the existing project `top-eleven-scanner-shaun` if needed, then create a Gemini API key from Dashboard → API Keys. Do not upgrade the project to paid billing if the requirement is £0 usage.

Paste the key in **More → Settings → Gemini Scanner · Free Tier**. The key is saved only to browser `localStorage` under `te:scanner:geminiApiKey`; it is not present in application source or the package.

## Cost boundary

This build has no Cloud Vision, Cloud Run, Vertex AI, or paid fallback. Free-tier rate/quota errors are handled only inside the compatible Gemini free-model pool. The app itself cannot prevent charges if the user later upgrades the underlying Gemini project to a paid billing tier, so keeping the project on Free Tier is part of the deployment contract.

## Evidence / reconciliation boundary

The app calculates group-average and OVR consistency after the Gemini response. Those checks never mutate the AI result. A mismatch is shown to the user for correction/manual verification; availability failover never bypasses this validation path.
