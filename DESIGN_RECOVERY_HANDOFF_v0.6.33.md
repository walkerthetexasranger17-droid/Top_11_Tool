# Top Eleven Tool — v0.6.33 Recovery Handoff

## Current baseline
- v0.6.33 is the current development baseline.
- Home and Squad are user-approved and visually frozen.
- Training design from v0.6.31 and dropdown polish from v0.6.32 remain in force.
- The calibrated decision/football baseline remains v0.5.17.
- Scanner calibration remains VERSION=12.
- Continue split packaging: lean deploy ZIP + full recovery ZIP.

## v0.6.33 Training results persistence hotfix
User report: pressing **Build Session** caused the generated drills to appear briefly and then disappear.

### Root cause
`buildTrainingCore()` rendered the six-drill result and persisted `training:session:*`. That cloud-synced write was later echoed back by Firestore. `applyRemoteEntry()` previously reported every server-confirmed entry as a local change even when its value was byte-identical to localStorage. The resulting `te-cloud-data-changed` event scheduled a full current-page repaint. On Training, `renderTrainingPicker()` intentionally clears visible session results on page render (v0.6.32 pre-generate contract), so the just-generated result vanished.

### Fix
- `cloud.js/applyRemoteEntry()` now compares the incoming server value with the existing localStorage value. Identical server acknowledgements are no-ops and return `false`, so they do not emit a data-changed repaint.
- Explicit tombstones also no-op when the local key is already absent.
- `app.js/scheduleCloudUiRefresh(event)` now ignores `te-cloud-synced` events whose `detail.changed === false`.
- The v0.6.32 rule remains: entering Training/selecting a player does **not** pre-display an old saved session. Results become visible only after Build Session is pressed in the current visit.
- Training scoring, drill ranking, Master stock, white/grey skill rules and all football calibration are unchanged.

## Approved Training state retained
- approved Training portrait background
- themed Individual / Team Training segmented control
- no Manage My Drills links on Training
- no 6 Drills / Modes / Grey Score summary boxes
- category colours: Attack red, Defence green, Possession yellow, Physical & Mental blue
- Mastercards retain category colour plus gold border
- app-owned themed dropdown UI

## Next page
After user confirms this hotfix on phone, continue the asset-ready sequence with **Drills**, then Settings, Manager Profile, Add Player, Team Plan. Player Profile remains reserved for a dedicated redesign.
