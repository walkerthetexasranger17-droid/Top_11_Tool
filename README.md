# Top Eleven Tool v5.2.4 — Build 30527

Focused optimiser correction on top of the tested v5.2.x baseline. Scanner v2, player logic, tactics, visuals and the authoritative build-30527 drill/role data are unchanged.

## v5.2.4 change

Real-device testing showed the individual optimiser was undervaluing drills that hit several useful white/key attributes in one drill slot. The previous companion score divided useful white need by all applicable affected attributes. That made a strong five-white drill compete too closely with a drill that delivered only one useful white hit.

The ranking is deliberately revised as follows:

- Start from the selected player's union of authoritative white/key skills.
- Weakest white skills carry the largest need values.
- For each available drill, sum the current need of **every white/key attribute that drill can train**.
- Multiply that total useful need by the drill's authoritative strength (XP × saved Training Effect).
- Grey attributes neither add value nor reduce/dilute the score.
- Strong/high-intensity drills therefore gain a major advantage when they hit several weak white skills in the same slot.
- After each selected slot, balancing credit is applied to every white skill hit and the next slot is rescored, keeping the six-slot session focused on remaining weak white areas.
- Normal duplicates remain allowed; Master/Campus duplicates remain stock-limited.
- Condition cost remains display information, not the primary objective.

This is still a companion-app ranking model, not an exact server-side gain prediction.

## Unchanged

- Scanner v2 and its permanent regression fixtures
- Build-30527 authoritative JSON data
- My Drills / Master stock persistence
- Player CRUD and stable IDs
- Formation, tactics, playmakers and the current UI/theme
