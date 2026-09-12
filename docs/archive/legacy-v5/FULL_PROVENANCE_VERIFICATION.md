# v5.2.20 note

The Scanner v2 verification row below is retained as historical provenance for the superseded v5.2.8 engine. v5.2.20 does not execute that engine; Scanner v4 is documented in `../../setup/SCANNER.md`.

# Top Eleven Build 30527 — Full Verification Audit

**Audit date:** 2026-09-10  
**Companion result:** v5.2.7 candidate  
**Scope:** production-relevant game facts, live facts, companion algorithms, historical corrections, current code and regression coverage.

## Verification method

This audit did **not** assume the consolidated Bible was correct. It cross-checked the current app against the recovered saved reverse-engineering conversation, Build 30527 implementation ledger, full mine report, native formula passes 1–8, official-client training capture artifacts, controlled Windows runtime capture, and the current source/tests. Historical claims that were later corrected were treated as superseded.

The original APK binary itself is not mounted in this current session, so native claims were checked against the preserved direct-binary transcript/disassembly reports rather than re-disassembling the APK from scratch. The saved evidence records the exact APK SHA-256 and the direct ARM64 inspection that produced the relevant constants. This is the main remaining provenance limitation.

## Audit result by subsystem

| Subsystem | Classification | Result | Notes |
|---|---|---|---|
| Current roles | GAME FACT | VERIFIED | 12 current roles. DML/DMR remain legacy/internal only and have zero-sized current role zones. |
| Role enum IDs | GAME FACT | VERIFIED | Football Engine and communication IDs remain separate. |
| Pitch geometry | GAME FACT | VERIFIED | Exact 0–1000 role rectangles and half-open membership preserved. |
| White/key attributes | GAME FACT | VERIFIED | 25 attributes and 12 current role maps match recovered APK data. Multi-role UI whites use natural-role union. |
| Natural/Related/Wrong | GAME/LIVE FACT | VERIFIED | No invented adjacency or numeric related-position penalty. Wrong excluded by normal optimiser. |
| Formation Role Score | COMPANION LOGIC | VERIFIED | Target-role key-skill arithmetic mean; OVR does not alter Role Score. |
| Formation assignment | COMPANION LOGIC | CORRECTED | Global one-player-per-slot assignment retained. v5.2.6 had an undocumented whole-XI playstyle-level-sum tie; v5.2.7 removes it and keeps level only in the documented per-slot tie. |
| Formation templates | COMPANION DATA | VERIFIED / LIMITED | Five documented templates only. UI now says “Auto best of 5 templates”; it does not claim every possible Top Eleven shape is searched. |
| Playstyle enum/schema | GAME FACT | VERIFIED | Current enum/level schema preserved. Ball Playing GK is not offered. |
| Playstyle eligibility | LIVE FACT + client architecture | VERIFIED | Chooser uses current captured role eligibility for natural roles. Exact hidden performance multipliers remain unresolved. |
| Special-ability enum | GAME FACT | VERIFIED | IDs 1–19; Shadow Striker absent; array not capped at two. |
| SA training eligibility | SERVER-RUNTIME | VERIFIED BOUNDARY | No universal role matrix is invented. Player-specific availability remains the authoritative path when captured. |
| Tactic dimensions/options | GAME FACT | VERIFIED | All 11 current dimensions and labels present. |
| Tactic protocol IDs | GAME FACT | CORRECTED | v1.0 Bible/current v5.2.6 had Tackling IDs wrong. Direct evidence: Balanced=0, Stay On Feet=1, Aggressive=2. v5.2.7 fixes IDs and enum order. |
| Tactic drain table | GAME FACT | VERIFIED | Counter-intuitive values retained: all Cross choices Low; Stay On Feet High. |
| Drain arithmetic | GAME FACT | VERIFIED | 15 base, 100 normalizer, Low/Med/High contributions 0/5/7, strict >0.40/>0.65. |
| Drain overrides | GAME FACT plumbing | CORRECTED | Native override fields are ConditionDrainIntensity 0/1/2. v5.2.7 maps them correctly to 0/5/7 while retaining direct contribution compatibility. |
| Tactics checksums | DERIVED REGRESSION | VERIFIED | Recomputed 97,200 total: Low 963 / Medium 77,823 / High 18,414; 19,440 per fixed mentality with documented counts. |
| Tactic recommendation fit | COMPANION LOGIC | VERIFIED AS COMPANION | Lineup metrics/style index are transparent tool logic, not Nordeus match-engine weights. |
| Mentor raw data | LIVE FACT | VERIFIED | Seven captured mentor IDs/levels/effect arrays preserved without reinterpreting multi-value arrays. |
| Mentor display mappings | MIXED | VERIFIED WITH BOUNDARY | Four name↔ID mappings live-confirmed; three retained from app asset/display mapping. Effects remain live data. |
| Mentor recommendation | COMPANION LOGIC | VERIFIED | Lexicographic direct tactic match → attribute coverage → mentor level → stable order. No hidden magnitude guessed. |
| Normal drill catalogue | LIVE/OFFICIAL CLIENT FACT | VERIFIED | 29 normal drills. Fixed IDs/type/intensity/XP/condition/attributes kept separate from user level/unlock snapshot. |
| Masterclass catalogue | LIVE/OFFICIAL CLIENT FACT | VERIFIED | Four consumables, +80 captured additional effect, stock treated as user quantity. |
| Intensity system | GAME/LIVE FACT | VERIFIED | Very Easy→Very Hard XP 1–5 and condition .75–3.75 match capture. |
| Regular drill levels | GAME FACT | VERIFIED | Semi-pro/Pro/World-class +10/+20/+30 via Level×10. |
| Exact normal-training gain | PRIVATE SERVER LOGIC | CORRECTLY UNRESOLVED | Native Pass 5 corrected earlier interpretation: ExecuteTraining returns authoritative per-player AttributeGain. Companion does not predict exact +X%. |
| Individual Training | COMPANION LOGIC | VERIFIED | Natural-role white union, top-3 mean target, grey=0, strength model, diminishing credits, six-slot beam width 250, Master stock. |
| Team Training | COMPANION LOGIC | VERIFIED WITH ONE PRODUCT AMBIGUITY | Uses actual players/per-player white needs/credits and beam 250. Spec does not explicitly say whether Masterclass consumables belong in Team Training; current implementation uses normal drills only. No game fact is fabricated. |
| TeamPlayTrainingDrill | SEPARATE GAME SYSTEM | VERIFIED BOUNDARY | Kept separate; no invented TeamPlay optimiser. |
| Scanner v2 | APPLICATION LOGIC | VERIFIED | 12 real screenshots / 204 numeric fields pass; aggregate/OVR reconciliation blocks unresolved saves and does not synthesize values. |
| Player data migration | APPLICATION LOGIC | VERIFIED | Roles/related roles/playstyle object/full SA array/player attributes/images/scanner metadata preserved; stale recommendation caches invalidated. |
| Squad Balance | LIVE FACT + PRIVATE FORMULA | VERIFIED BOUNDARY | Controlled values/determinism preserved as evidence; formula not reverse-engineered or used to fake XI scoring. |
| Hidden Talent | PROTOCOL FACT / EFFECT UNRESOLVED | VERIFIED BOUNDARY | Field exists; no proven local training/performance multiplier, so excluded. |
| Specialists | COMPANION LOGIC | VERIFIED | Penalty/FK/corner rules transparent; captain remains user-selected/no fake formula. |

## Historical conclusions explicitly rejected

- “All tactics drain values are server-only” — superseded by direct APK constructor/default-map recovery.
- “Stay On Feet is low drain” — false; direct Build 30527 map says **High**.
- “Tackling IDs are Stay=0/Aggressive=1/Balanced=2” — false; direct enum is **Balanced=0/Stay=1/Aggressive=2**.
- “Normal Execute Training raw points are distributed locally into final gains” — overstatement; the normal response already contains authoritative per-player AttributeGain.
- Old formation adjacency/OVR weighted scoring — companion invention, removed.
- Universal role→SA eligibility — not proven and not implemented.
- Exact playstyle/SA/mentor hidden multipliers — not proven and not implemented.
- Squad Balance delta observations as a universal formula — rejected.

## Remaining unresolved facts that should stay unresolved

Exact private match-engine attribute/playstyle/SA weighting; playstyle level magnitude; mentor Football Engine magnitude and signature-array semantics; universal role→SA eligibility; Squad Balance formula; Hidden Talent effect; normal-training hidden development/age/RNG/boost-stack formula; exact future training percentage-point gain; private backend code/endpoints. None is required for the companion to provide transparent decision support.

## Test result after corrections

- Core deterministic suite: **PASS — 245 assertions**
- Scanner regression: **PASS — 12 screenshots / 204 numeric fields**
- Static/integrity checks: **PASS**
- Service-worker/package integrity: **PASS — 69/69 runtime files**
- JavaScript/service-worker syntax: **PASS**

## Production judgement

The v5.2.6 “production-candidate” label was premature because its tests encoded at least one wrong inherited protocol mapping. After the provenance audit and v5.2.7 corrections, no additional production-relevant contradiction was found in the evidence reviewed. The build can be treated as a **logic-verified production candidate**, with two explicit caveats: (1) the original APK binary was not re-mounted/re-disassembled in this session, so native verification relies on preserved direct-binary evidence; and (2) Team Training Masterclass inclusion remains an under-specified companion-product choice rather than a game-data question. A real-device UI/PWA smoke remains advisable before deployment.
