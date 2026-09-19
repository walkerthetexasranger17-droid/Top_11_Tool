# v0.6.49 — Team Plan Formation + Set Piece Takers Validation

Scope is limited to the first two Team Plan tabs and removal of the obsolete Build Best Match Plan action.

Validated contracts:
- Formation tab contains only the current recommended XI presentation.
- Best-in-Slot XI, Squad Blueprint and Build Best Match Plan are absent from the live UI.
- Exact user-approved pitch, shirt and nameplate assets are fingerprinted and precached.
- Player names are dynamic UI text layered over the nameplate image.
- Set Pieces exposes Corner L/R, Free Kick L/R, PEN 1–5 and Captain.
- Existing automatic set-piece recommendation logic remains in use.
- Scanner VERSION 12 and v0.5.17 decision baseline remain unchanged.

Primary regression test: `tests/v0649_team_plan_contract.py`.
