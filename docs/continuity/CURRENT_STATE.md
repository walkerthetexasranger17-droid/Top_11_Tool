# CURRENT DESIGN OVERLAY — v0.6.29 Header Transparency Hotfix

- Current UI branch: v0.6.29.
- v0.6.28 exposed a header asset wiring bug: HTML referenced `.png` files while the packaged approved transparent artwork was `.webp`. A stale/non-transparent Home asset could therefore appear as a black rectangle.
- v0.6.29 moves the full header pack to `assets/v0629/headers/`, references only the packaged transparent WebP files, and precaches all nine header assets.
- Home now uses the approved stacked TOP / ELEVEN / TOOL artwork, positioned upper-left.
- The global app top bar continues to use the approved wide TOP ELEVEN TOOL wordmark.
- Squad, Training, Team Plan, Drills, Settings, Add Player and Manager Profile retain their approved header artwork.
- Player Profile remains excluded pending its separate redesign.
- Decision/logic baseline remains frozen at v0.5.17; scanner calibration remains VERSION=12.
