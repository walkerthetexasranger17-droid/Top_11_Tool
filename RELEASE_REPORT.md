
## v0.4.6 local squad recovery patch

- Keeps the existing `te:player:*` records as the primary squad source.
- Automatically scans legacy/migration backup player records on startup and restores any missing canonical player records without duplicating names.
- Resets obsolete/hidden squad filters to `ALL` after the restructure so saved players cannot remain hidden behind a stale filter state.
- Adds **Settings → Recover existing squad** for a manual recovery pass.
- Shows how many player records are currently found on the device.
- Does not clear or overwrite healthy player records.

# Top Eleven Tool v0.4.6 — Restructure Report

## Why the version reset

The previous 5.x numbering overstated product maturity. The public version line is reset to **0.4.5** while core functions are still being completed. `0.5.0` is reserved for the point where the required functions are stable and the project can move into a dedicated UI-polish phase.

## Navigation and page structure

- Replaced the old Home / Squad / Team Plan / Training / More pattern with six direct destinations: **Home, Squad, Training, Team Plan, Drills, Settings**.
- Scanner/Add Player and Player Profile are contextual flows rather than main navigation pages.
- Removed the Squad search/advanced-filter panel and replaced it with a prominent **Add Player** entry point.
- Individual and Team training remain on one Training page.
- Formation, Set Pieces and Tactics now share one Team Plan page.
- Removed the standalone Playmakers/Specialists surface.

## Player profiles

- Added **Update by Scan** for an existing player.
- Natural roles at the top of a profile are tappable; a DL/DC player can make DC primary without losing DL.
- Added icon-based Playstyle and Special Ability cards at the top of the profile.
- Multiple unlocked Special Abilities are supported.
- Special Ability learning/progress remains a separate state and is not treated as unlocked.
- Removed normal-profile scanner provenance badges.
- Role intelligence now displays the strongest three and weakest three key attributes with corrected spacing.

## Scanner / review workflow

- The proven Gemini 3.1 Flash Live HIGH-thinking scanner remains in production.
- Native phone screenshot normalisation, goalkeeper layout support and Special Ability learning-widget detection are retained.
- Review/Rescan/Save-and-Next actions remain after the attributes section.
- Opening a review item, advancing to the next player, or returning from a rescan scrolls to the Review Player area rather than the top of the page.
- Update-by-scan writes to the selected existing player instead of creating a duplicate.

## Team Plan

- Removed manual formation selection from Plan Inputs.
- Plan Inputs now sit **below** the football pitch.
- Removed redundant text Starting XI and Bench displays.
- Formation is automatically selected by the optimiser.
- Added provenance-labelled 2026 community candidate shapes: **4-1-4-1, 3-1-4-1-1, 3-1-2-1-3**. These expand the candidate pool; they do not bypass squad-based scoring or alter proven role legality/coordinate rules.
- Added a pitch-based Set Pieces mode for Captain, Penalty, FK L/R and Corner L/R.
- Rebuilt the visible tactics UI around **In Possession / In Transition / Out of Possession** and shows concise selections rather than long calculation output.

## Mentors

- Mentor levels default to a neutral user value rather than screenshot-captured levels.
- Every mentor has manual +/-/number level controls.
- Recommendation ranking re-runs using the user's stored levels.

## Data consistency

- Player identity/icon UI uses central playstyle/Special Ability data rather than page-specific hard-coded lists.
- Shadow Striker display alias and Ball Playing DC remain available.
- Added local playstyle and Special Ability icon packs used by player profiles.

## Public vs internal versioning

- Visible app version: **v0.4.6**.
- Internal game-data/reverse-engineering provenance remains packaged for calculations and audits but is not shown throughout normal app screens.

## Deferred intentionally

### Cloud login/sync
A cross-device account system needs a real backend and credentials. v0.4.6 therefore keeps local storage rather than shipping a fake login. The next architecture step is an authenticated cloud database plus local-to-cloud migration and offline caching.

### Broader formation-meta ingestion
Recent community research was used to expand the formation candidate pool conservatively. More shapes/tactic presets should only be added after they are evaluated against current game behaviour and the existing deterministic optimiser.
