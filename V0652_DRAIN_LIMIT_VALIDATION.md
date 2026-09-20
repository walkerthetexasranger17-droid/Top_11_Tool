# v0.6.52 Drain Limit Validation

## Scope
Fix Medium/High producing identical tactics when the cheaper lower-drain package continued to win after the drain ceiling widened.

## Implemented
- Tactics model bumped to `30527-drain-fit-v6-drain-band-intent-v0518-affinity-dedup-sa-canonical-ps-gate`.
- Historical/default drain gate now selects the requested class exactly: Low / Medium / High.
- Existing scoring remains active within that class.
- `updatePlanOnly()` now uses `TeamPlan.updateRecommendations()` so Approach/Drain changes preserve the selected XI.
- Canonical decision data bumped to v0.5.18 and the browser bundle regenerated from it.

## Required regression
- `node tests/v0518_drain_band_intent.js`
- `node tests/core-tests.js`
- `python tests/strategy_logic_data_contract.py`
- current runtime/version/static/cloud contracts
- package cleanliness/integrity after ZIP extraction
