# Set Pieces — Build 30527

## Game facts

Current client state explicitly stores Captain, Left/Right Corner Kicker, Left/Right Free Kicker, Penalty Kicker and ordered penalty takers. Current Special Ability enum includes Penalty Kick Specialist, Free Kick Specialist, Corner Specialist and Set Piece Taker.

The inspected client proves assignment/display/save behaviour and specialist identities, **not** an official automatic ranking or Captain formula.

## v0.5.15 calibration — companion logic

Every candidate XI receives a complete automatic package before Team Plan selection:

- penalties: Penalty Kick Specialist -> Set Piece Taker -> Finishing/Shooting -> Creativity;
- free kicks: Free Kick Specialist -> Set Piece Taker -> Shooting/Finishing/Passing/Creativity;
- corners: Corner Specialist -> Set Piece Taker -> Crossing/Passing/Creativity;
- Captain: highest OVR -> assigned-role mean -> assigned-role floor -> stable key **for convenience only**.

**Set Piece Taker calibration:** the current client still exposes this distinct Special Ability. Historical Top Eleven community evidence consistently describes it as a composite ability covering penalties, free kicks and corners. No current exact coefficient proves that it is numerically equal to the dedicated specialist abilities, so the companion ranks the dedicated role-specific specialist first and Set Piece Taker as the conservative second specialist tier for all three dead-ball families.

Captaincy is treated as **gameplay-neutral**. Historical Nordeus Support explicitly stated that choosing a captain does not make him stronger/better and does not change player stats, while the recovered current client exposes Captain assignment/save state but no performance consumer/ranking formula. Therefore Captain contributes **zero** to Formation, Tactics, Mentor, Set-Piece readiness and final Team Plan ranking. Highest OVR is only a deterministic auto-fill default; any starter can be manually selected without a modeled performance penalty. No age, Bravery, invented leadership/personality or hidden captain coefficient is used.

Set-piece readiness is a late deterministic Team Plan tie-break only, never an additive score. Captain is explicitly excluded from that tie-break. Manual assignments persist until explicit refresh/off-XI.

Left and right slots are independent state, but preferred foot is not captured; therefore the optimiser may legitimately choose the same player for both and must not invent a foot advantage.

## Current boundary

No captain-performance formula is required by the current evidence: Captain is modeled as performance-neutral unless a future game update or direct current evidence proves a new effect. An official hidden ranking formula for the other set-piece takers and any dominant-foot rule remain unresolved.
