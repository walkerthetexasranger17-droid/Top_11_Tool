# Top Eleven Tool — v0.6.40 Recovery Handoff

## Current baseline
- v0.6.40 is the current development baseline.
- This is a global visual-polish pass: manager-avatar fidelity + slightly more transparent app surfaces.
- v0.6.39 drill colour treatment is preserved.
- Decision/football baseline remains frozen at v0.5.17.
- Scanner calibration remains VERSION=12.
- Continue split packaging: lean deploy ZIP + full recovery ZIP.

## Manager/account avatar contract
The manager image is one shared account identity and must render consistently in both places:
- top-right account control on every app page;
- larger Manager Profile identity card.

### Image fidelity
- `js/cloud.js` resolves the Firebase/Google photo from `user.photoURL` or provider data.
- For `googleusercontent.com` URLs that expose a size token such as `=s96-c`, the client requests a larger source (`s256` for chrome, `s384` for Manager Profile) rather than stretching the small avatar.
- Non-Google image URLs are left unchanged.
- If the high-resolution Google URL fails, the original photo URL is retried.
- The top-right control still falls back to the bundled manager placeholder when no account photo exists.
- Manager Profile still falls back to the manager's initial when no account photo exists.

### Alignment
- Shared account images use a square box, `object-fit: contain`, exact centred `object-position`, and the circular frame clips the image.
- The same alignment rule applies globally rather than being patched per page.

## Global surface transparency contract
The user wants more of the approved backgrounds visible through the UI. v0.6.40 therefore reduces opacity of the dark navy base on the major app cards/panels while keeping readable foreground contrast.

Applies to the major surfaces used by Home, Squad, Player Profile, Scanner, Training, Drills, Team Plan, Settings and Manager Profile, plus common secondary rows/tiles and form fields.

### Performance rule
Do not add heavy blur to every list row/card. This pass changes surface alpha primarily; existing limited blur on selected large panels remains. Mobile scrolling/navigation should stay smooth.

### Drill exception
The v0.6.39 category language remains authoritative:
- Attack red
- Defence green
- Possession yellow
- Physical & Mental blue
- Master Cards retain gold framing plus their category colour

The dark base underneath those category colours is slightly more transparent, but category hue strength and drill artwork remain intact.

## Frozen / deferred
- No change to v0.5.17 football/decision logic.
- No change to Training optimiser calculations or Master Card consumption behaviour.
- No change to Scanner VERSION=12 or scanner references.
- No change to account-security requirements or Firebase data model.
- Remaining image-dependent redesign areas: Team Plan, Update Player, Login/Splash, Player Profile.
