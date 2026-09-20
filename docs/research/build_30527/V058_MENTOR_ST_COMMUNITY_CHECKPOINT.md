# v0.5.8 — Mentor + ST evidence / community comparison checkpoint

**Date:** 14 September 2026  
**Scope:** research/continuity only. No speculative Mentor ranking or ST numeric match-engine weights were added to production runtime.

## Why this checkpoint exists

v0.5.7 closed Formation + Tactics as the first stable companion baseline and moved active research to role/Playstyle attribute priorities. The next question exposed a narrow unfinished dependency: each Mentor has three effect families, but the current companion recommender does not yet reason over the *meaning and activation condition* of each Signature Move.

This pass therefore did two things in parallel:

1. audit the current Mentor recommender against the already recovered build-30527 Mentor data; and
2. begin the ST role/Playstyle priority model by comparing game-extracted evidence with current/historical community evidence.

No community anecdote is promoted to GAME FACT.

---

## 1. Mentor status — NOT fully finished

### What is already strong GAME/LIVE evidence

Build-30527 research already has all seven captured Mentor identities and the exact meaning of their three families:

| Mentor | Tactical family | Attribute family | Signature condition/effect |
|---|---|---|---|
| Rubén Herrera | Counter Attack | Creativity + Passing | Blind Side applies during counters |
| Lewis Green | Wing Attacks | Crossing + Heading | Aerial Dominance applies on crosses |
| Jonas Braun | Long Pass | Strength + Positioning | Adaptive Blueprint identifies/boosts attacks through the weakest defensive zone after halftime |
| Cesc Fàbregas | Short Pass | Dribbling + Shooting | Momentum Chain builds through successful pass chains with a midfield Stamina cost |
| Alan Shearer | Solo Dribble | Strength + Shooting | Ankle Breaker improves corners/free kicks/penalties and penalises the opponent attack after a miss |
| Nemanja Vidić | Defensive Actions | Tackling + Bravery | Iron Check triggers on successful defensive checks and carries extra card risk |
| Claude Makélélé | Defence vs Short Passes | Bravery + Positioning | Parking the Bus activates while leading and trades attacking output for defender boosts |

Exact captured arrays remain in `data/build_30527/index/mentor_effects.json`. Exact selected-level progression values outside the captured states remain unresolved.

### What v0.5.7 production logic actually does

`js/mentor-engine.js` is still `mentor-synergy-v3` and ranks unlocked Mentors lexicographically by:

1. direct Tactical-family match;
2. Attribute-family key/white-skill coverage in the selected XI;
3. whether Signature is unlocked at Level 10;
4. stable Mentor order.

The third effect is therefore **not truly integrated yet**. Signature is only a Boolean tie-break. A Lewis Signature does not currently gain extra relevance because the plan uses crosses; Claude does not gain extra relevance because the team is protecting a lead; Vidić's card-risk trade-off is not exposed; Jonas's halftime/weak-zone condition is not reasoned over.

**Conclusion:** Mentor state handling and effect extraction are mature, but Mentor *decision logic* is not complete.

---

## 2. Current official Mentor progression adds a new gap

Current official Top Eleven documentation states that Mentors have:

- Levels 1–10;
- Tactical Boost across the early level progression;
- Attribute Boost unlocked from Level 5;
- Signature Move unlocked at Level 10;
- **3 additional Prestige levels** after Level 10, using XP + Signature Seals to improve the Signature Move;
- the ability to swap Mentor at halftime.

Sources:
- https://nordeus.helpshift.com/hc/en/3-top-eleven-be-a-soccer-manager/faq/1805-leveling-up-mentors/?l=en
- https://nordeus.helpshift.com/hc/en/3-top-eleven-be-a-soccer-manager/faq/1803-top-eleven-2027-is-here/

The embedded build-30527 research/source archive contains no recovered `Prestige` / `Signature Seal` structures. The large external `TopEleven_Full(4).zip` was also not available in the Library during this pass, so the static/protocol representation remains **UNRESOLVED**.

Do not fabricate a Level 11–13 protocol mapping. Treat the 3 Prestige levels as **GAME FACT from current official documentation**, while the exact build-30527 field/state representation is unresolved until the full game package is available again or a fresh official-client capture exposes it.

---

## 3. Safe architecture for finishing Mentor recommendations

Do not force every Signature Move into one invented numeric score. Their activation conditions are not comparable units.

The recommended future companion architecture is:

### Pre-match Mentor fit
Use only transparent condition matches:
- Tactical-family match to the planned tactics;
- Attribute-family coverage across the XI;
- Signature-context compatibility as a named/rule-based reason, not a fake percentage.

### Halftime / live Mentor switch advisor
This is where Signature conditions become much more useful because official game behaviour allows Mentor swaps at halftime:
- **Herrera:** counter plan becomes relevant / opponent is leaving counter space.
- **Green:** wide/cross plan + aerial target.
- **Braun:** second-half weakest-zone exploitation / lane flexibility.
- **Fàbregas:** short-pass possession chain, with Stamina trade-off shown.
- **Shearer:** dribbling/set-piece plan or a match likely to generate dead-ball value.
- **Vidić:** defensive-check plan; explicitly surface the extra card-risk/Condition cost.
- **Makélélé:** opponent Short Passes and especially protecting a lead; explicitly surface the -attacking-attributes trade-off.

This is COMPANION LOGIC built directly on game-authored effect wording. It is not a recovered Football Engine formula.

---

## 4. Formation × Mentor attribute coverage check

A deterministic companion-only check compared the two 18/19-Playstyle resilient frontier shapes. It simply counts whether each Mentor's two boosted attributes are key/white for each occupied role; it does **not** claim those hits have equal match value.

| Mentor | Target frontier #7: AML/AMR | Alternative #9: ML/MR |
|---|---:|---:|
| Herrera — Creativity+Passing | 12 | 12 |
| Green — Crossing+Heading | 9 | 9 |
| Braun — Strength+Positioning | 11 | 13 |
| Fàbregas — Dribbling+Shooting | 10 | 8 |
| Shearer — Strength+Shooting | 9 | 7 |
| Vidić — Tackling+Bravery | 12 | 12 |
| Makélélé — Bravery+Positioning | 13 | 15 |
| **Total raw key-skill hits** | **76** | **76** |

This does **not** overturn the v0.5.7 Target Formation. It reveals a useful bias instead:
- the AML/AMR target naturally gives Fàbregas and Shearer more role-key overlap;
- the ML/MR alternative naturally gives Braun and Makélélé more;
- Herrera, Green and Vidić are unchanged by that particular wide-band swap.

That relationship can eventually become an explanation/tie-break, not a hidden formation score.

---

## 5. Game extraction vs community — Formation/Tactics

### Current target remains

`GK / DL DC DC DR / DMC MC / AML AMC AMR / ST`

v0.5.7 chose it because of current native legality/advisory rules, symmetry, one-slot advisory resilience and 18/19 current Playstyle coverage. The web pass does not replace that evidence.

### Community corroboration

A February 2026 Reddit discussion supplied by the user contains two recurring structural ideas:
- managers report needing stronger midfield control against similar/stronger teams;
- one contributor specifically says a single DMC feels safer with a back four, while another reports success with double-DMC structures.

Source: https://www.reddit.com/r/topeleven/comments/1rekkxs/most_successful_formations_tactics/

That is independently compatible with the current target's back four + DMC + MC + three attacking-midfield roles. It does **not** prove the target is the game's best formation.

The old forum `Top 10 FORMATIONS & TACTICS Guide` includes a 4-5-1 V shape with back four, DMC, central midfield and two wide attackers, but it is from an older game era and its own long thread contains conflicting reports and subsequent tactical revisions. Use it for pattern history, not current numeric truth:
https://forum.topeleven.com/tutorials-guides/37076-top-10-formations-tactics-guide.html

A current 13 September 2026 Reddit thread also shows managers switching Mentor with strategy: Fàbregas for possession/short passing and Herrera for counterattack. That aligns exactly with the extracted Tactical families:
https://www.reddit.com/r/topeleven/comments/1wf6148/formation_tactics_help/

**Result:** community evidence currently supports the principle of a structurally sound platform plus dynamic tactics, rather than giving us a reason to reopen Formation v1.

---

## 6. ST evidence pass

### GAME FACT — ST key/white attributes

Build-30527 `PlayerAttributesUtils.KeyAttributesForRoles` proves ST has exactly these nine key attributes:

`Passing, Dribbling, Shooting, Finishing, Positioning, Heading, Strength, Speed, Creativity`

There is still no recovered private numeric weight saying one ST key attribute contributes `X%` more than another.

### GAME FACT / GAME ASSET FACT — action/training associations

Current drill records repeatedly cluster ST-relevant attributes around recognizable action families:

- `Shooting Technique` → Shooting + Strength + Finishing (plus GK Agility)
- `1-on-1 Finishing` → Dribbling + Finishing (plus Rushing Out/Tackling/Anticipation)
- `Wing Play` → Heading + Shooting + Finishing (plus Crossing/Punching)
- `Passes Before Shot` → Creativity + Positioning + Passing + Finishing (plus Anticipation)
- `Use Your Head` → Heading + Creativity + Positioning + Passing
- `Contact Play` → Dribbling + Strength (plus Aggression/Bravery/Marking)
- `Fast Counter-Attacks` → Creativity + Passing + Finishing (plus Communication/Crossing)
- `Slalom Dribble` → Speed + Dribbling + Passing (plus Fitness)

These groups prove training/action relationships, **not** private match-action coefficients.

### Official Playstyle semantics

Official Top Eleven Playstyle copy says:
- **Poacher**: scoring goals is the focus; waits on the defensive line and is dangerous with balls in the penalty area.
- **False Nine**: a skilled ball driver receiving deep and creating danger around the box, pulling DCs from position.
- **Target Man**: attracts aerial passes, then either finishes or holds the ball against DCs for teammates.

Source: https://forum.topeleven.com/tutorials-guides/83715-%5Bofficial%5D-playstyle-types.html

Official Help also confirms Playstyles actively contribute when the matching action occurs and only when the player is used in a compatible role; higher Playstyle level increases intensity/effectiveness:
https://nordeus.helpshift.com/hc/en/3-top-eleven-be-a-soccer-manager/faq/1099-how-do-playstyles-influence-live-matches/

### COMMUNITY CORROBORATION — recurring ST patterns

Current/historical player reports repeatedly split ST builds by Playstyle:
- Poacher commonly emphasises Shooting + Finishing, with Speed/Creativity recurring as supporting attributes;
- Target Man commonly emphasises Heading + Strength + Positioning + Finishing and is paired with wide delivery;
- False Nine commonly emphasises Dribbling plus scoring/mobility attributes, with more varied opinions on Passing/Creativity.

Useful sources:
- https://www.reddit.com/r/topeleven/comments/1w4c9co/which_playstyle_potential_is_the_most_effective/ (1 Sep 2026)
- https://www.reddit.com/r/topeleven/comments/1ahrrli/ (3 Feb 2024)
- https://www.reddit.com/r/topeleven/comments/13sf4ap/ (27 May 2023)
- https://forum.topeleven.com/tutorials-guides/80096-how-easiest-way-train-players-get-new-star-print.html

A current Mentor anecdote also reports Lewis Green + high crossing + a Target Man producing a large scoring/assist spike. This is **not causal proof**, but it independently matches Lewis's extracted Wing/Crossing/Heading/Aerial effect package and official Target Man semantics:
https://www.reddit.com/r/topeleven/comments/1vjfz4f/new_update_at_a_glance_mentors_within_squad/

### Draft ST companion bands — NOT production weights yet

The evidence is strong enough to preserve qualitative bands, but not a fake Nordeus percentage table:

| ST model | Foundation / elevated attributes | Status |
|---|---|---|
| **Base ST scoring core** | Shooting, Finishing | Strong cross-source candidate; COMPANION priority, not hidden weight |
| **Base ST structural support** | Positioning | Repeated action/community support; exact importance unresolved |
| **Poacher modifier** | elevate Shooting, Finishing; support Speed, Creativity; Positioning remains relevant | Strongest recurring community alignment with official scoring-only semantics |
| **Target Man modifier** | elevate Heading, Strength, Positioning, Finishing | Strong official semantic + drill + community alignment |
| **False Nine modifier** | elevate Dribbling; support Creativity/Speed; retain base Shooting/Finishing; Passing remains a candidate rather than promoted fact | Official ball-driver/deep-receive semantics + mixed community evidence |

Do **not** use player height, weight or foot as a companion requirement from these posts. Current app scanning is single-screenshot constrained, and the game evidence here does not prove those fields as the hidden Playstyle effectiveness input.

---

## 7. Mentor Signature rule design — evidence architecture complete

`data/build_30527/index/mentor_signature_rule_design.json` now records a non-numeric rule design for all seven Signatures. The key distinction is whether the Signature context is inferable before kickoff or only from live match state.

- **Herrera:** direct plan context when Force Counter Attack is selected; Blind Side explicitly says during a counter-attack.
- **Green:** direct action context when the plan deliberately creates wing/cross service; Aerial Dominance explicitly says on crosses.
- **Braun:** no pre-match Signature score; Adaptive Blueprint is explicitly halftime + opponent-weak-zone dependent.
- **Fàbregas:** pass-chain/possession context with the extra midfielder Stamina cost shown; do not claim only Short Passes can trigger the Signature.
- **Shearer:** dead-ball opportunity context only; never invent how many set pieces the match will produce.
- **Vidić:** defensive-disruption context with card-risk and extra Condition/Stamina costs shown; do not equate a Tackling setting to a “defensive check” without proof.
- **Makélélé:** no pre-match Signature score; **while leading** is an explicit match-state trigger, making him a strong halftime/live protect-the-lead candidate while surfacing the attacking-attribute penalty.

This completes the **research architecture** for using all three Mentor effect families. Production `mentor-engine.js` is intentionally unchanged in v0.5.8 so the rule set can be tested before recommendation behaviour changes.

---

## 8. ST Special Ability pass — boundary reached

The current build exposes **19** Special Abilities and explicitly records trainable eligibility as server/player-specific. Static searching recovered the current names and server availability boundary, but no current client-side table that assigns comparable effect multipliers to ST abilities.

Current official Help independently confirms that the Special Ability choices shown to a player **depend on that player's role** and that mastering an ability costs 40 or 50 skill points depending on the ability. It does not publish a current ST ranking or the private effect multiplier for each ability.

Source:
- https://nordeus.helpshift.com/hc/en/3-top-eleven-be-a-soccer-manager/faq/778-how-does-adding-a-new-special-ability-work/

Community evidence is not clean enough to fill that gap. Different managers strongly prefer One-on-One Scorer, Free Kick Specialist or Versatile Attacker. Some community explanations also rely on **Shadow Striker**, which is absent from the current build-30527 Special Ability enum. That is a concrete stale-schema warning.

**Decision:** ST Special Ability weighting remains **UNRESOLVED_FOR_WEIGHTING**. Do not add a role-based SA score and do not recommend a trainable SA unless the server says it is available for that player. When a player already owns an SA, future companion logic may explain contextual fit only where current game/official evidence supports it.

---

## 9. ST tactic-context pass

The tactic layer can advance qualitatively without inventing a hidden tactics multiplier.

### Target Man — strongest context match

Official Playstyle wording directly describes an aerial-pass target who either finishes or holds the ball against DCs. That makes **wide/cross delivery** the strongest current semantic match. It also creates an unusually clean Mentor interaction: Lewis Green's extracted package is Wing Attacks + Crossing/Heading + Aerial Dominance on crosses.

Current 2026 community reports independently pair Target Man with high crossing and wide creators, including a Lewis Green + high-crossing example with a large reported goal/assist increase.

This is strong enough for a transparent companion explanation such as **“Target Man fit improves when the plan deliberately creates crosses/aerial service”**.

It is **not** enough to state that Long Passing is mandatory. “Aerial passes” in the official Playstyle text does not prove the `Long Pass` tactic is the required engine trigger.

### False Nine — role semantics are stronger than tactic-setting evidence

Official wording proves deep receiving, ball driving and forcing DCs out. Community systems often use False Nine as an ST/AMC link with other scorers and central combinations.

Safe companion context: **creator/link + space-creation role around the box**.

Unsafe claims: fixed Short Pass, fixed Through Middle, universal two-striker requirement, or a hard lone-striker penalty. Those remain community strategies rather than recovered game rules.

### Poacher — scoring context, not a fixed tactic

Official wording makes the penalty-area scoring role clear. Recent community reports commonly treat Poacher as the primary scorer.

Safe companion context: **service into scoring areas / primary finisher**.

Unsafe claims: one mandatory passing style, mandatory Counter Attack, or mandatory crossing level.

---

## 10. What remains unresolved / next

1. **Mentor Prestige protocol/state:** recover from the full current game package or a legitimate official-client capture before implementing Level 10+ state.
2. **Signature-aware Mentor recommendation:** research rule design is complete in `mentor_signature_rule_design.json`; next step is a tested runtime implementation without invented cross-Mentor percentages.
3. **ST Special Ability modifier:** remains unresolved for weighting; next useful evidence is current effect/action hooks or controlled live captures, not more legacy ranking posts.
4. **ST tactic modifier:** Target Man now has a strong cross/aerial-service context; Poacher and False Nine remain qualitative only and must not be forced into fixed tactic presets.
5. ST is now stable enough as a research template to begin AML/AMR evidence research after the Mentor runtime-test contract is written.

## Production boundary

No `js/mentor-engine.js`, formation algorithm, tactics formula, scanner logic or training optimiser behaviour was changed by this checkpoint. v0.5.8 is an evidence/index/continuity build plus public version/cache marker bump.
