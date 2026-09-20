# Top Eleven Tool — v0.6.37 Recovery Handoff

## Current baseline
- v0.6.37 is the current development baseline.
- Home, Squad, Training, Add Player and Settings remain visually/behaviourally preserved from v0.6.36.
- Manager Profile has now received its approved background and account/security layout redesign.
- Global branded page titles remain on the compact Home-referenced size/position established in v0.6.35.
- Decision/football baseline remains frozen at v0.5.17.
- Scanner calibration remains VERSION=12.
- Continue split packaging: lean deploy ZIP + full recovery ZIP.

## v0.6.37 scope — Manager Profile
### Background
- Runtime asset: `assets/v0637/backgrounds/manager-profile.webp`.
- Source: approved `assets/v0624/reference-backgrounds/manager-account-approved.png`.
- The portrait scene is used as a fixed full-page surface below the account UI.
- The Manager Profile hero is transparent so the approved background remains visible.
- Mobile hero depth is intentionally long enough to expose the touchline manager figure before the cards begin.

### Profile identity
- `#accountAvatar` now renders the signed-in Firebase/Google profile image using `user.photoURL`, with provider-data fallback and the existing initial fallback if no remote photo exists.
- The profile image is deliberately larger than the top-bar avatar but remains compact enough for mobile.
- Manager name, email, verification state, sign-in methods and cloud-sync state are grouped into one identity card.
- Display-name editing is integrated into the same card.
- Google linking, verification resend and sign-out remain available where applicable.

### Security consolidation
The previous five separate profile/security blocks are reduced to two main cards:
1. Manager identity/profile card.
2. Security & sign-in card.

The Security & sign-in card contains:
- Two-step verification status/setup/removal.
- One shared identity confirmation area.
- Change email.
- Change password.

For Google-only accounts the current-password field is hidden because Firebase reauthentication uses Google sign-in. Email/password accounts still show and use the current-password field.

### Behaviour preserved
- No Firebase authentication policy was weakened.
- Sensitive email/password changes still require enrolled TOTP plus fresh reauthentication.
- No cloud data model changes.
- No scanner/football/training/formation/tactics/mentor logic changes.

## Deferred
- Update Player still awaits its dedicated background/title artwork based on the user-supplied player-assessment reference.
- Login/splash redesign remains deferred until image generation is available / appropriate.
