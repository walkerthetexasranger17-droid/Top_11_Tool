# v0.6.19 — START HERE

**CURRENT UI BRANCH:** v0.6.19 — Compact Mobile Squad + Nationality.  
**FROZEN DECISION BASE:** v0.5.17.  
**SCANNER BASE:** v12, with isolated nationality metadata extension v1.

Read `DESIGN_RECOVERY_HANDOFF_v0.6.19.md` first, then `V0619_SQUAD_COMPACT_NATIONALITY_VALIDATION.md`.

Phone/tablet is the product/design target. Desktop is functional-support only. The active page is **Squad**.

The approved mobile row is compact: rank → high-quality role art → name + flag + roles/age → glossy position badge → Playstyle image only → Special Ability image(s) only → OVR → chevron. No stars and no Playstyle/SA label text on the mobile row.

Nationality is optional scanner metadata. Read only the visible flag; never infer it from a name. Missing/uncertain nationality must not block save/update. Existing game-extracted Playstyle and Special Ability assets are authoritative and must not be regenerated.

**NEXT FIXED UNIT:** deploy v0.6.19 with the user's real cloud squad and do only Squad-mobile fidelity fixes until accepted. Every deliverable still ends with regression tests, handoff update, full ZIP, fresh extraction and verification.
