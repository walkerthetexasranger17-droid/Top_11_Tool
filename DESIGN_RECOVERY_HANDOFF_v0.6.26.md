# Top Eleven Tool — v0.6.26 Recovery Handoff

## Fixed pass scope
Branding/header refinement, Home top-presence redesign, background tone treatment, Squad action relocation and cache/version refresh only. No football/scanner/training/decision logic changes.

## Implemented in v0.6.26
- Kept the corrected official tactics-board app logo from v0.6.25.
- Replaced the ordinary header title treatment with a crisp CSS-rendered TOP ELEVEN TOOL wordmark styled after the approved logo: metallic white TOP, lime ELEVEN, spaced TOOL with cyan/lime line accents. This is vector-like browser text and remains sharp on high-density phone displays.
- Added a centered Home hero branding overlay using the same wordmark plus a small functional `HOME` pill. No motivational slogan was added.
- Added one `Today at a glance` bar containing Players, Avg OVR and Training Opportunities.
- Removed the four duplicate Home cards (Players, Avg OVR, Highest OVR, Training Opportunities) that previously sat beneath the hero.
- Pulled the existing Home workspace up so Recent Players, Training Builder and Team Plan Snapshot follow the new glance bar directly.
- Added a subtle dark-blue photographic tone (`--v626-photo-tint` plus `--v626-photo-filter`) to calm the bright background imagery. Home and Squad use it now; the tint token is also applied to the existing page hero backgrounds so later approved portrait conversions inherit the same visual tone. Player Profile is deliberately excluded from the approved background programme.
- Removed Add Player / Update Players from the Squad hero. Both actions now live in a dedicated management row between Squad stats and the Players roster.
- Runtime/cache markers bumped to v0.6.26 / `0626`; service-worker cache is `te-v0-6-26-branding-tone-actions`.

## Preserved
- Home and Squad approved portrait background composition/crops.
- Squad compact player rows, role artwork, flags, position badges, Playstyle and Special Ability imagery.
- Squad Role Order: `GK → DL → DC → DR → DMC → ML → MC → MR → AML → AMC → AMR → ST`.
- Official corrected logo master: `assets/v0624/branding/top-eleven-tool-logo.png`.
- Approved portrait reference pack: `assets/v0624/reference-backgrounds/`.
- Decision/calibration baseline v0.5.17.
- Scanner VERSION=12.

## Locked visual rules
- Mobile app first.
- No motivational slogans.
- Home may use functional branding/status, but not marketing copy.
- Background photography should remain visible but slightly toned for UI readability.
- Page titles should remain concise and functional.
- Do not place management buttons over important hero subjects when a content-level action row is more natural.

## Next step
User tests v0.6.26 on the phone. After acceptance, continue the remaining approved pages one at a time, beginning with Training. Do not start Player Profile; it remains reserved for its own separate redesign.
