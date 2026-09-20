# v0.6.37 Manager Profile Validation

Scope: visual/information-architecture redesign of Manager Profile only.

Validation requirements:
- approved manager-account portrait background is packaged and displayed as the page surface;
- Manager Profile header remains the compact global branded title treatment;
- profile identity and security are consolidated into two main cards;
- Google/Firebase `photoURL` is rendered in `#accountAvatar` with safe fallback;
- all existing account action IDs remain present;
- current-password input is hidden for accounts without the Firebase password provider;
- Firebase two-step and sensitive-change rules remain unchanged;
- v0.5.17 decision baseline and Scanner VERSION=12 remain unchanged;
- no mobile horizontal overflow or console errors.
