# Top Eleven Tool — v0.6.53 Recovery Handoff

## Release state
- **UI/runtime:** v0.6.53
- **Decision baseline:** v0.5.18 Drain Band Intent Fix.
- **Scanner:** VERSION 12.

## v0.6.53 — Home manager briefing
Home was rebuilt inside the existing approved Home visual language. No new generated page/background asset was required.

### User constraint
Home must be useful without inventing analysis. Every displayed value is either stored app data or a direct deterministic calculation from data the app already has. Home summaries link to the supporting page that exposes the underlying information.

### Home content now
- Today at a glance: Starting XI OVR (11 selected starters only), squad player count, current saved formation, saved drill-level count.
- Team Plan Snapshot: current formation, approach, drain limit and set-piece configured state. Rows route to the relevant Team Plan tab.
- Squad Snapshot: squad count, current-XI count, remaining-squad count, plus the three highest-OVR players in the current XI. Player rows open the existing Player Profile; View Squad opens Squad.
- Training Snapshot: saved drill levels, Master card stock and complete skill-profile count; Open Training routes to Training.
- Data Status: factual saved-player/profile/drill/Mastercard/set-piece state with supporting routes.
- Quick Links: Add Player, Update Players, Team Plan, Training and Drills.

### Explicitly NOT added
No invented player-development status, squad strength rating, positional priority, recommendation ranking, "needs improvement" judgement, mentor-coverage score or subjective playstyle-quality assessment was added to Home.

## Carried-forward v0.6.52 Team Plan contract
- Locked approved Team Plan visual assets remain unchanged: `assets/v0649/team-plan/formation-pitch.png`, `player-shirt.png`, `player-nameplate.png`.
- Tactics retains the game-inspired three-phase board and corrected selector chevrons.
- Drain Limit retains v0.5.18 target-band semantics.
- Opponent information remains permanently out of scope.
