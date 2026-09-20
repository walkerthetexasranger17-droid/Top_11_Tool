# Top Eleven Tool — v0.6.35 Recovery Handoff

## Current baseline
- v0.6.35 is the current development baseline.
- Home, Squad and Training remain approved in their current visual structure.
- Add Player uses the approved portrait scanner background.
- Home is the optical reference for page-title artwork; all other branded page-title assets are now recomposed to the same visible width and use the same compact top-left placement.
- The calibrated decision/football baseline remains v0.5.17.
- Scanner calibration remains VERSION=12.
- Continue split packaging: lean deploy ZIP + full recovery ZIP.

## v0.6.35 scope
### Global branded page-title normalization
- The v0.6.34 CSS wrapper sizing alone was insufficient because the transparent source artwork had very different internal bounds.
- Home remains unchanged and is the reference.
- Squad, Add Player, Training, Drills, Team Plan, Manager Profile and Settings are recomposed into `assets/v0635/headers/` on the same 1774x887 canvas with the same 835px visible alpha width as Home.
- All page titles therefore render with the same 205px mobile wrapper, top-left at 8px / 4px, without overpowering the page backgrounds.
- The global top-bar wordmark remains separate and unchanged.

### Add Player scan-review polish
The user reported that the role and Playstyle dropdown controls in the scan-review card looked like generic fields with a separate little box attached to the right.

- Scanner Primary/Second/Third Role selectors now use an integrated field treatment.
- Scanner Playstyle and Playstyle Tier selectors use the same integrated treatment.
- The separate boxed dropdown-chevron treatment is removed for these scanner-review fields; a simple cyan down-arrow remains.
- Primary role is visually highlighted in lime, secondary roles remain restrained, Playstyle remains bright and Playstyle Tier uses cyan.
- Related Roles has been removed from the Add Player scan-review UI entirely.
- Scanner OCR/model/prompt/schema/reference/calibration logic is unchanged.

### Home Team OVR correction
The Home dashboard previously averaged OVR across the entire saved squad. This was not the intended meaning of team overall.

- The dashboard metric is now labelled **Team OVR**.
- Team OVR is calculated only from the 11 players in the currently saved Team Plan starting XI (`plan.starters`).
- It uses each starter's current saved player OVR, so bench/reserve players do not affect the figure.
- If there is no complete saved XI of 11 valid players, Team OVR displays an em dash rather than inventing a squad-wide value.
- Tapping Team OVR routes to Team Plan.

## Frozen boundaries
- No scanner recognition/calibration changes.
- No player OVR calculation formula changes.
- No formation-selection/tactics/mentor/training-calculation changes.
- No Home/Squad/Training layout redesign.
- Update Player's dedicated background/title remains deferred until its approved artwork is created.

## Next step
User should test the Add Player scan-review controls and confirm Home Team OVR matches the selected starting XI. After approval, continue Scanner/Add Player polish or move to the next page with ready assets.
