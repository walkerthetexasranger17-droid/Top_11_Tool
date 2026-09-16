# v0.5.17 development pass3 validation

Status: **UNPUBLISHED DEVELOPMENT CHECKPOINT**

Pass3 adds the current Special Ability role-eligibility matrix and role-filtered Add/Edit pickers as a prerequisite for Best-in-Slot.

Key guarantees:

- all 19 current Special Abilities have one explicit eligibility row;
- multi-role players receive the union of natural-role eligibility;
- related roles do not grant eligibility;
- saved/detected abilities remain visible and preserved outside the role filter;
- scanner visual recognition still uses all 19 references and never infers identity from role;
- no Formation/Tactics/Mentor/Training calibration values were changed.

New gates:

- Special Ability role eligibility: **PASS — 65 assertions**
- Special Ability picker contract: **PASS — 11 assertions**

Full existing calibration/release/scanner regression matrix remains green.
