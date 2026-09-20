# Top Eleven Tool — v0.6.46 Recovery Handoff

## Current baseline
- **UI/runtime:** v0.6.46.
- **Football/decision baseline:** frozen at v0.5.17.
- **Scanner:** VERSION=12; recognition/calibration is unchanged.
- v0.6.42-v0.6.45 glass hierarchy and green-action parity remain authoritative.
- This pass is visual integration only: **Update Player + Login**.

## Approved assets — do not regenerate or restyle
These four files are the exact user-approved visual sources for this pass:

1. `assets/approved/backgrounds/update-player.png`
   - Dedicated Update Player portrait background.
   - Physio/coach treating a seated player; subjects intentionally high in frame so they remain visible behind the page header.
   - Lower field is deliberately dark/soft for glass UI content.
2. `assets/approved/headers/update-player.png`
   - Dedicated `UPDATE PLAYER` header art.
   - Compact two-line silver/lime/cyan treatment matching the approved Add Player title language.
3. `assets/approved/backgrounds/login.png`
   - Dedicated Login stadium background.
   - Continuous coherent stadium architecture; no embedded logo/text/UI.
4. `assets/approved/branding/login-logo.png`
   - Transparent clipboard/tactics-board `TOP ELEVEN TOOL` logo for Login.

Do not replace these with newly generated variants unless the user explicitly asks.

## Update Player implementation
Update Player intentionally remains the existing scanner/update workflow. No duplicate scanner implementation was created.

When `#page-add-player` enters `.update-mode`:
- Add Player background is hidden.
- Update Player approved background is shown.
- Add Player header art is hidden.
- Update Player approved title art is shown.
- The existing update queue/automatic name-match workflow remains intact.
- Existing scanner panels continue using the approved translucent glass treatment.

The mobile/tablet background is a fixed full-page portrait surface below the app header. The approved physio/player focal area stays at the top; the body content scrolls over the darker grass region.

## Login implementation
The auth gate now uses:
- approved stadium background;
- approved transparent Login logo;
- one centered v0.6.42-style glass shell;
- existing Google and Email/Password auth actions unchanged;
- v0.6.45 green-action parity for the Email/Password action.

Old decorative/pseudo marketing copy on the auth gate is disabled. No Firebase/auth flow logic changed.

## Visual contract still in force
- Main glass panels: translucent navy gradient, cyan keyline, blur.
- Enabled green primary actions exactly match the Individual Training active tab treatment from v0.6.45.
- Training/Drills category tint system and Mastercard gold treatment remain untouched.
- Do not add decorative lines, slogans, text, logos, advertisement-board copy or other invented artwork to approved backgrounds.
- For portrait page backgrounds, key people/subjects belong in the upper section so header art and focal photography work together.

## Frozen logic
No changes to football recommendations, Team Plan calculations, training optimiser scoring, drill availability, Mastercard rules, scanner extraction/calibration, player data model, Firebase/cloud sync or authentication behaviour.

## Remaining visual work
- **Player Profile:** dedicated imagery / final redesign still pending.
- **Team Plan:** the approved changing-room/player background already exists; do not regenerate it. Only page finalisation/integration should be revisited if still required.
- **Splash/loading:** can reuse the approved Login visual language in a future focused pass; v0.6.46 changes the Login/auth gate only.

## Recovery rule
Continue from v0.6.46. Preserve these four approved assets byte-for-byte and preserve the frozen v0.5.17 decision baseline + scanner VERSION=12.
