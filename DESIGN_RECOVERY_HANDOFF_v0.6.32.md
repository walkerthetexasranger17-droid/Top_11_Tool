# Top Eleven Tool — v0.6.32 Recovery Handoff

## Current baseline
- v0.6.32 is the current development baseline.
- Home and Squad are user-approved and visually frozen.
- Training visual pass from v0.6.31 remains in force.
- The calibrated decision/football baseline remains v0.5.17.
- Scanner calibration remains VERSION=12.
- Keep the split packaging model: lean deploy ZIP plus full recovery ZIP.

## v0.6.32 interaction polish
### App-owned dropdown system
The user rejected the Android/browser-native select sheet because it visually breaks the app theme. v0.6.32 keeps each real HTML `<select>` in the DOM as the existing logic source, but hides its native UI and presents an app-owned chooser.

The themed chooser:
- uses the current navy/cyan/lime visual language and v0.6.27 typography;
- renders as a mobile sheet with a dim/blur backdrop and selected-state indicator;
- supports long lists with scrolling;
- updates the underlying native select and dispatches the same `change` event existing code already consumes;
- applies to existing and dynamically generated selects through a MutationObserver;
- therefore covers Training, Squad sort, Scanner/Profile, Drills and Team Plan without duplicating business logic.

Do not revert these selectors to native Android pickers unless explicitly asked.

### Training pre-generate behaviour
- `renderTrainingPicker()` clears the visible recommendation state.
- Selecting a player clears the visible recommendation state.
- A previously saved recommendation is not automatically shown when Training opens or when a player is selected.
- The user must press Build/Generate Session before drill cards appear in the current visit.
- The persisted-session code is retained for data compatibility; only auto-display was removed.
- Training scoring, drill ranking, Master stock logic and white/grey skill rules remain unchanged.

### Squad sort contract
Default and display order is now:
1. Role (GK → ST)
2. OVR (High → Low)
3. OVR (Low → High)
4. Age (Young → Old)
5. Name (A → Z)

The underlying role ordering remains GK, DL, DC, DR, DMC, ML, MC, MR, AML, AMC, AMR, ST.

## Inherited approved visual state
- Global top bar: `assets/v0629/headers/topbar.webp`.
- Home stacked header: `assets/v0629/headers/home.webp`.
- Squad header: `assets/v0629/headers/squad.webp`.
- Training header: `assets/v0629/headers/training.webp`.
- Training background: `assets/v0631/backgrounds/training.webp`.
- Home/Squad background transition fix from v0.6.31 remains active.
- Drill colour contract remains Attack red, Defence green, Possession yellow, Physical & Mental blue; Master = category colour plus gold border.

## Do not change accidentally
- Approved Home or Squad layouts.
- v0.5.17 decision/calibration logic.
- Scanner VERSION=12 or scanner visual indices.
- Individual/Team Training scoring algorithms.
- Role/playstyle/Special Ability contracts.

## Next page
After the user tests v0.6.32, continue with the next asset-ready visual page. The planned sequence was Drills, Settings, Manager Profile, Add Player, Team Plan. Player Profile remains excluded for its later dedicated redesign.
