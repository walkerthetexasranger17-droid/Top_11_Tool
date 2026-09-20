# Build 30527 — Native Formation Validator Pass

Evidence classes used below:
- **GAME FACT** — native `GameAssembly.dll` logic plus matching shipped localisation.
- **CALCULATION** — deterministic enumeration from recovered game rules.
- **COMPANION LOGIC** — transparent Top Eleven Tool robustness/target-selection policy; not claimed as Nordeus match-engine logic.

## Native methods

`SquadUtil` (Windows package 27.3.0.0 / build-30527 matched binary):

- `GetFormationStatusKey` — `0x18185DAD0`
- `GetIllegalFormationStatusKey` — `0x18185DB00`
- `GetIrregularFormationStatusKey` — `0x18185E0C0`
- `IsCurrentFormationLegal` — `0x18185E6C0`
- `NumberOfPlayersInFieldRole` — `0x18185E6E0`
- `NumberOfPlayersInFieldRoles` — `0x18185E7A0`

Internal Football Engine role IDs used by this validator align with:
`GK=0, DL=1, DC=2, DR=3, DML=4 (legacy), DMC=5, DMR=6 (legacy), ML=7, MC=8, MR=9, AML=10, AMC=11, AMR=12, ST=13`.
Current playable protocol roles exclude DML/DMR.

## Hard illegal-formation rules — GAME FACT

The current validator/localisation combination establishes:

1. exactly **1 GK**;
2. at least **3 defenders** across `DL/DC/DR`;
3. at least **2 midfielders** across current midfield roles `DMC/ML/MC/MR/AML/AMC/AMR`;
4. at least **1 central-midfield player** across `DMC/MC/AMC`;
5. left/right flank counts may differ by at most **2**, where left=`DL/ML/AML`, right=`DR/MR/AMR`;
6. at least **1 player in attacking areas** across `AML/AMC/AMR/ST`;
7. at least **1 central defending player** across `DC/DMC`;
8. positional crowding limits:
   - `DL/DR/ML/MR/AML/AMR <= 1` each;
   - `DMC/AMC <= 2` each;
   - `DC/MC/ST <= 3` each.

Shipped localisation directly supports the reconstructed group meanings, including:
- `formation_not_enough_players_in_midfield_illegal` — at least 2 midfield players;
- `formation_not_enough_players_in_central_defending_areas_illegal` — at least one DC or DMC;
- `formation_not_enough_players_in_central_midfield_illegal` — at least one DMC, MC or AMC;
- `formation_not_enough_players_in_attacking_areas_illegal`;
- `formation_unbalanced_flanks_illegal`;
- `formation_not_enough_defenders_min_3_illegal`.

## Softer irregular/performance warnings — GAME FACT

`GetIrregularFormationStatusKey` checks a second layer after hard legality. Current shipped messages establish these groups:

- attacking presence: at least one `ST` or `AMC`;
- left flank: at least one `DL`, `ML` or `AML`;
- right flank: at least one `DR`, `MR` or `AMR`;
- central defender: at least one `DC`;
- defensive midfield presence: at least one `DMC` or `MC`;
- offensive midfield presence: at least one `MC` or `AMC`.

The non-illegal localisation explains gameplay intent, e.g. attackers help retain possession, defensive midfielders make it harder for opponents to start attacks, and offensive midfield presence makes it harder for opponents to retain possession in that zone.

## Exhaustive role-count enumeration — CALCULATION

Using only the recovered hard rules and current playable roles for ten outfield slots:

- hard-legal role-count configurations: **2,843**;
- also free of all current irregular warnings: **1,893**;
- warning-free and exactly left/right symmetric: **249**.

Top Eleven Tool additionally tested a transparent **one-slot advisory robustness** policy: every irregular-warning group begins with at least two occupants, so losing any one relevant outfield slot still leaves the warning satisfied. This is COMPANION LOGIC, not a game rule.

Under warning-free + exact symmetry + one-slot advisory robustness, **12** role-count shapes remain. The reproducible enumerator is `docs/research/build_30527/tools/formation_validator_30527.py`.

## Target-formation implication

The following familiar shapes are among those 12 robust symmetric candidates:

- `GK DL DC DC DR / MC MC / AML AMC AMR / ST` — 4-2-3-1 with MC+MC;
- `GK DL DC DC DR / DMC MC / AML AMC AMR / ST` — **4-1-1-3-1**, also reasonably described as the DMC+MC variant of the 4-2-3-1 family;
- `GK DL DC DC DR / ML MC MC MR / ST ST` — 4-4-2.

No shape is labelled an official Nordeus “best formation”. Target selection is companion logic layered on proven structural constraints.
