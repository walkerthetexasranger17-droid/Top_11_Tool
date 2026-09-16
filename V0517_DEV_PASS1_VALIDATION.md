# v0.5.17 DEV PASS1 validation

**State:** UNPUBLISHED / TESTING  
**Base release:** v0.5.17  
**Decision model:** `companion-strategy-v2-own-squad-runtime-v0515` unchanged

## New pass1 contracts

- Existing-player update scanner: age + skills only; identity and OVR preserved.
- Bulk update queue: screenshots require explicit saved-player targets.
- Manual Edit Player remains full-record editing.
- Master Card Stock renders above normal drills.
- `player_update_scan_contract.py`: **18 assertions PASS**.
- `luiu_training_integrity.js`: **7 assertions PASS**; Creativity is highest need and Fast Counter-Attacks is first-ranked drill for the supplied Luiu profile.

## Existing regression gate

- Core: **353 PASS**
- Tactics: **178 PASS**
- Live drain: **52 PASS**
- Formation invariants: **27 PASS**
- Direct all-in-one: **5 PASS**
- Training profiles: **40 / failures 0**
- Team Training: **14 PASS**
- Set Pieces: **29 PASS**
- Mentor: **18 PASS**
- Stitched pipeline: **26 PASS**
- Stitched monotonicity: **8 PASS**
- Squad Blueprint: **21 PASS**
- Tactic UI labels: **33 selectable labels PASS**
- Strategy/data, release identity, package integrity, static, hardening, cloud, navigation, scanner/failover/native-resolution: **PASS**

No calibrated Formation/Tactics/Mentor/Set Piece/Training coefficient changed in DEV PASS1.
