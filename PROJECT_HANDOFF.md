# Top Eleven Tool — v0.5.0 Phase Handoff

**Status:** v0.5.0 is the official start of the next development phase.  
**Date:** 13 September 2026  
**Current proven source build:** `top-eleven-tool-v0.4.18.zip`

This handoff exists because the project has accumulated a large amount of reverse-engineering, scanner, UI and logic work and must **not be restarted, simplified, or reconstructed from memory** in a new chat.

---

## 1. Non-negotiable project rules

1. **Do not guess Top Eleven game data, formulas, symbols, tactics rules, mentor effects, or hidden relationships.**
2. When game behaviour can be recovered from APK/Windows binaries, IL2CPP metadata, serialized assets, native code, game captures, or other authoritative data, use that first.
3. If something cannot be proven, mark it **unresolved** rather than inventing a value.
4. Community research is useful for current meta/strategy, but it must be clearly distinguished from game-code facts.
5. **Do not replace working code unnecessarily.** Make narrow, traceable changes.
6. Preserve the current visual design unless the task specifically concerns that area.
7. Versioning is numeric. This phase is officially **v0.5.0**. Do not continue as another v0.4.x scanner patch.
8. The scanner reached a known-good state in v0.4.18. **Freeze that pipeline unless a new real screenshot proves a regression.**

---

# 2. Current project state

## v0.4.18 is the baseline to build v0.5.0 from

The scanner was the major blocker at the end of the v0.4.x phase. It is now working correctly in live user testing.

The user tested v0.4.18 and reported:

> **100% clearance — no mistakes at all.**

That means v0.4.18 should be treated as the stable scanner baseline for v0.5.0.

### Important warning

Do **not** casually refactor scanner code while working on Team Plan, tactics, mentors, or set pieces. The long scanner debugging path finally produced a clean result.

---

# 3. Scanner — solved / frozen baseline

This section is included so a future chat does not accidentally undo the work.

## Final scanner architecture in v0.4.18

### Native source resolution

The user's normal Top Eleven screenshots are **2688 × 1216**.

Earlier scanner builds resized the whole screenshot to 1536 × 695, which destroyed small playstyle-level detail. In v0.4.18 this was removed.

Current rule:

- **2688 × 1216 is the scanner's native baseline.**
- A normal 2688 × 1216 screenshot is cropped **1:1 from original source pixels**.
- No whole-image downscale occurs before scanning.
- If a future screenshot uses the same layout at another resolution, ROI coordinates can scale proportionally, but the source image itself should not be resized first.

This applies to:

- name
- OVR
- age
- roles
- all skill values
- playstyle identity
- playstyle level
- Special Abilities

### Playstyle recognition

The game has multiple playstyle renderer contexts. Mixing them was a major source of failures.

The scanner screenshot uses the **compact/small renderer**, so scanner recognition now uses references from the real `PlaystyleSmallAtlas`, not the large PlaystyleTab/HQ renderer.

The approved large HQ references remain valid for display/profile use and must not be replaced.

### Compact playstyle level handling

Level recognition now accounts for:

- Standard
- Intermediate
- Advanced
- Master
- Locked
- Ready / max-XP arrow as a separate overlay
- Boosted as a separate overlay
- Wrong Position as a separate overlay

The max-XP/Ready arrow previously confused Intermediate and Advanced. It is now isolated/masked during level classification.

A deterministic pixel-comparison stage supports the AI classification so Gemini is not the only judge of very small level-ring differences.

### Important scanner lesson

For yellow/midfield playstyles such as Mezzala, the difference between Standard and Intermediate can be only a small right-hand coloured segment. Preserving native pixels and comparing to the correct compact renderer solved this.

### Special Ability references

- 19 coloured Special Ability references are used.
- Gold/boosted Special Ability recognition was deliberately removed because the user will capture the coloured version.
- Do not reintroduce the gold SA path unless explicitly requested.

### Approved reference assets

The earlier approved playstyle and Special Ability reference files were preserved unchanged through the final scanner fixes.

---

# 4. Other recent work that should NOT be redone

The project has already moved well beyond the old v5 beta / early scanner state.

Recent completed or established work includes:

- Mobile-first professional Top Eleven Tool UI.
- Player scanner / squad workflow.
- Successful scan queue handling work.
- Manual Standard playstyle level restored.
- Exact playstyle/SA reference packs integrated.
- Player profile playstyle and SA display path updated.
- Android/navigation/refresh improvements from recent app-fix work.
- Swipe-delete player workflow work.
- Account/cloud/login/security foundation work, including stronger security direction.
- Tactic Calculator / Team Plan work has already begun.
- Set Pieces page has already been rebuilt visually once, but its **selection logic still needs work**.

Do not assume an old backlog item is still outstanding without inspecting the current v0.4.18 source first.

---

# 5. v0.5.0 focus — TEAM PLAN PAGE

The next development phase is specifically focused on **Team Plan**.

The user has reset the immediate priorities as follows.

## A. Formation

**Formation is fine.**

Do not redesign or rework Formation unless a specific bug is found later.

This frees the v0.5.0 work to focus on Set Pieces, Tactics, and Mentor logic.

---

# 6. Set Pieces — current problem

The current Set Pieces screen is visually populated but the user does **not trust the recommendation logic** yet.

A current screenshot is embedded in the app recovery material at:

`docs/handoff/Team_Plan_Set_Pieces_Captain_Bug.png`

Visible current assignments include examples such as:

- Corner Kick R — Kilroy
- Corner Kick L — Kilroy
- Free Kick R/L — Kazachenko
- Penalty assignments across several players
- **Captain — ADD PLAYER**

## Confirmed visible bug

### Captain is not being selected

The screenshot clearly shows the Captain slot remaining empty even though the rest of the set-piece plan has populated players.

This should be traced as a real code/data-flow bug before changing any recommendation formula.

### First technical task

Trace the captain path end-to-end:

1. Team Plan / Set Pieces UI render.
2. Data structure used for recommendations.
3. Any captain-specific filter or score.
4. Candidate player list.
5. Whether captain is absent from generated recommendations or lost when rendering/saving.
6. Whether an unexpected eligibility rule filters every player.
7. Whether the engine has no captain algorithm at all and the UI is simply waiting for manual input.

Do not paper over this by assigning a random/highest-OVR player.

## Wider Set Pieces audit

The user is unsure whether the current logic is choosing the **correct players for each role**, even where a player is populated.

The logic therefore needs a proper audit for:

- Corner Kick R
- Corner Kick L
- Free Kick R
- Free Kick L
- Penalty hierarchy / ordered penalty takers
- Captain

For each role, determine what evidence the app currently uses:

- attributes
- position
- dominant foot if applicable
- Special Ability
- playstyle
- form / OVR / other data
- hard-coded weights
- arbitrary heuristics

Then compare that logic with any recoverable game data and current community strategy.

---

# 7. Tactics — main v0.5.0 research task

This is expected to need **substantial work**.

The user does not only want a UI tweak. The goal is to improve the logic that chooses the **best tactics for the actual team composition**.

The existing tactics system should be inspected before making changes.

Potential questions include:

- How should tactics adapt to the selected formation?
- How should tactics adapt to the actual players filling each role?
- Should player attributes, playstyles, Special Abilities, footedness, or relative strengths affect tactic selection?
- How should the app balance tactical effectiveness against condition drain?
- Which tactical choices interact with each other rather than being independently scored?
- Can known game/native logic tell us what each tactic changes or costs?
- Are current app recommendations merely heuristic when stronger evidence is available?

## Existing static reverse-engineering context

Previous APK/native work established that the client contains real tactics-drain systems including:

- `TacticsConditionDrainRepo`
- `TacticsConditionDrainService`
- `TacticsConditionDrainSettings`
- `TacticsConditionDrainSpec`
- `ConditionDrainIntensity`
- tactics drain override support

`CalculateConditionDrain` was found to evaluate multiple tactical dimensions. Earlier work identified eleven dimensions, including concepts such as:

- passes
- shooting tendency
- focus passing
- crossing tendency
- possession lost
- possession
- and additional tactical dimensions in that recovered path

There was already a dedicated reverse-engineering effort around tactics drain. **Do not start from internet guesses if the code can answer a question.**

The v0.5.0 investigation should build on those findings and distinguish:

1. **What the client proves** about tactics and condition drain.
2. **What may be server-owned/unresolved.**
3. **What current high-level players/community strategies recommend.**

The user is willing to perform legitimate future live/server captures if something genuinely cannot be recovered statically, but the instruction remains: **exhaust the game package/client side first.**

---

# 8. Mentor logic — main v0.5.0 research task

The current Mentor recommendation logic is also suspect.

The user reports that many players online appear to favour mentors such as **Shearer** and **Green**, while the current app logic does not choose them at all.

Important: this is a **lead to investigate**, not proof that Shearer or Green are universally optimal.

The task is to determine why community players favour them and whether the app is failing to model something important.

## Mentor investigation should cover

- What mentors exist in the current game/build.
- Exact mentor effects / modifiers recoverable from game data.
- Whether effects are static, conditional, formation-dependent, role-dependent, player-dependent, or tactic-dependent.
- Any stacking or interaction rules.
- Whether mentor recommendations should depend on the actual XI/team composition.
- Whether mentor choice should be considered jointly with tactics rather than as a separate isolated score.
- Whether current app weights omit important mentor benefits.

## Research sources

Use two evidence tracks:

### Track 1 — authoritative game data

Mine the full game ZIP / APK/native metadata/assets for:

- mentor classes
- repositories
- definitions/configs
- effect specs
- IDs/names
- condition/trigger logic
- UI description strings
- server DTO/protobuf structures
- calculation methods

### Track 2 — current community/meta research

Search current sources for why skilled players choose specific mentors, especially Shearer and Green.

Useful sources can include:

- active Top Eleven communities
- Reddit
- forums
- current YouTube strategy discussion where technically useful
- guides that are current for the same game generation/build

Do not convert popularity into a hard-coded rule. Use the community evidence to identify hypotheses, then see whether the game data supports them.

---

# 9. Full game package / reverse-engineering source

The user has the full Top Eleven Windows package available from previous work. In Library it has appeared as names such as:

- `TopEleven_Full(2).zip`
- equivalent duplicate versions such as `TopEleven_Full(1).zip`

This package was previously confirmed to contain authoritative material including:

- `GameAssembly.dll`
- IL2CPP metadata (`global-metadata.dat`, metadata v39)
- `resources.assets`
- asset bundles / StreamingAssets
- real game UI and playstyle atlases
- code/metadata needed for static reverse engineering

Use this package for the tactics/mentor/set-piece investigation before inventing logic.

---

# 10. Important related reverse-engineering files already created

If available in the user's Library / earlier chats, potentially useful supporting files include:

- `BUILD_30527_IMPLEMENTATION_LEDGER.md`
- `BUILD_30527_IMPLEMENTATION_LEDGER(1).md`
- `TOP_ELEVEN_TOOL_BIBLE_BUILD_30527_v1.1_VERIFIED.md`
- `TOP_ELEVEN_TOOL_BIBLE_BUILD_30527_v1.md`
- previous Tactics Drain reverse-engineering chat/archive/capture material
- `te_v39_training_metadata.json`
- `te_training_identifiers.txt`

Search the user's Library for these rather than asking the user to recreate work that already exists.

---

# 11. Source files to inspect first in the app

Before changing anything, extract and inspect `top-eleven-tool-v0.4.18.zip`.

Likely relevant files include at least:

- `js/team-plan-engine.js`
- `js/tactics-engine.js`
- `js/mentor-engine.js`
- `js/formation.js`
- `js/app.js`
- current data/Bible files used by the Team Plan engines
- any Set Pieces-specific module or scoring code found during source search

Do not assume these filenames contain all of the logic. Search the whole source for:

- captain
- set piece
- penalty
- corner
- free kick
- tactic
- drain
- mentor
- Shearer
- Green
- approach
- team plan

First document the existing flow before patching it.

---

# 12. Recommended v0.5.0 execution order

## Phase 1 — Preserve baseline

- Extract v0.4.18.
- Run existing regression tests.
- Confirm scanner remains green.
- Create v0.5.0 working copy.

## Phase 2 — Set Pieces / Captain bug

- Trace the current Set Pieces engine.
- Fix the **missing Captain** issue based on actual cause.
- Audit recommendation inputs for all set-piece roles.
- Do not redesign Formation.

## Phase 3 — Static tactics research

- Mine app logic and full game ZIP.
- Recover as much actual tactics/condition/effect logic as possible.
- Reuse previous tactics-drain findings rather than restarting.
- Produce an evidence ledger: proven / inferred / unresolved.

## Phase 4 — Mentor research

- Mine game package for mentor definitions/effects.
- Research current community choices, specifically investigating the user-observed Shearer/Green preference.
- Determine whether the current app's mentor scoring is missing important variables.

## Phase 5 — Design improved recommendation model

Only after research:

- define Set Pieces recommendation logic;
- define tactics recommendation logic based on team/formation composition;
- define mentor recommendation logic;
- decide whether tactics + mentor should be jointly optimized;
- identify any data that still needs a live capture.

## Phase 6 — Implement v0.5.0

- Make narrow changes.
- Preserve Formation.
- Preserve scanner v0.4.18.
- Add deterministic regression fixtures/tests for the new Team Plan logic.
- Package as **v0.5.0**.

---

# 13. Files to give the new chat

## Mandatory

1. **`Top_Eleven_Tool_v0.5.0_Handoff.md`**  
   This file.

2. **`top-eleven-tool-v0.4.18.zip`**  
   Current stable application baseline. Build v0.5.0 from this.

3. **`TopEleven_Full(2).zip`** (or the equivalent full game ZIP)  
   Authoritative Windows game package for tactics, mentor and set-piece research.

4. **`docs/handoff/Team_Plan_Set_Pieces_Captain_Bug.png`**  
   Embedded in the app package; current Team Plan screenshot showing Set Pieces populated but Captain empty.

## Useful optional files

- latest build 30527 implementation ledger/Bible
- previous tactics-drain reverse-engineering archive/files
- any live capture packages used during tactics investigation

A new chat should search the user's Library for those files before asking for them again.

---

# 14. Copy/paste starter prompt for the next chat

> Continue the Top Eleven Tool project from the attached **v0.5.0 handoff**. Do not restart the project and do not use old backlog assumptions without checking the current source.
>
> **v0.5.0 officially starts the next development phase.** Use `top-eleven-tool-v0.4.18.zip` as the stable source baseline.
>
> The v0.4.18 scanner is now proven in live testing with a 100% clean scan. **Do not refactor or redesign the scanner unless a new real screenshot proves a failure.**
>
> The current focus is the **Team Plan page**:
>
> 1. **Formation is fine — leave it alone.**
> 2. **Set Pieces:** trace the current recommendation logic and fix the missing Captain shown in the supplied screenshot. Audit whether corners, free kicks and penalties are choosing the correct players rather than just filling slots.
> 3. **Tactics:** this needs substantial research. Determine how the best tactics should be chosen for the actual formation/team composition. Use the full game ZIP / IL2CPP/native data and reuse previous tactics-condition-drain research. Do not invent game formulas.
> 4. **Mentors:** audit/rebuild the recommendation logic. The user observes that many players online favour mentors such as Shearer and Green, while the app currently does not recommend them. Research why, using both current community evidence and authoritative game data. Do not hard-code popularity as truth.
>
> Use `TopEleven_Full(2).zip` as an authoritative source. Search the user's Library for prior build-30527 ledgers, Bible files and tactics-drain reverse-engineering work before recreating anything.
>
> Before modifying code, inspect and document the current Team Plan flow in `team-plan-engine.js`, `tactics-engine.js`, `mentor-engine.js`, `app.js` and any related data modules. Then trace the Captain bug. Keep an evidence ledger of **proven / inferred / unresolved** logic.
>
> Do not guess. If client/static analysis cannot prove something, mark it unresolved and only then decide whether a legitimate live capture is required.

---

# 15. Golden checkpoint

At the moment this handoff was created:

- **Official development line:** v0.5.0
- **Stable source:** v0.4.18
- **Scanner:** working 100% in latest user test; freeze it
- **Formation:** fine; no work required
- **Set Pieces:** current UI exists, but recommendation quality is uncertain; Captain visibly not selected
- **Tactics:** major research/rebuild target
- **Mentors:** major research/rebuild target
- **Research priority:** game ZIP/native data first, current community meta second, live capture only for genuinely unresolved/server-owned behaviour

That is the correct place to resume the project.

# 16. Permanent in-app handoff / continuity rule

Starting with the v0.5.0 phase, the project must carry its own current recovery document inside the application package.

## Canonical file

`PROJECT_HANDOFF.md` at the root of the app/project.

This is not optional documentation. Treat it as part of the build/release contract.

## Update it whenever meaningful work changes project state

Before handing over or packaging any future build, update `PROJECT_HANDOFF.md` with:

- current app/build version and the stable source it came from;
- what was completed in the current development pass;
- exact files/modules changed;
- important implementation decisions and why they were made;
- authoritative research findings and their source/provenance;
- anything inferred or still unresolved;
- regression/tests run and their result;
- known bugs or items deliberately left untouched;
- the next recommended task and execution order;
- any external files a new chat still needs that cannot sensibly live inside the app ZIP.

## Recovery behaviour for a new chat

If conversation history is lost, a new chat should:

1. unzip the latest app package;
2. read `PROJECT_HANDOFF.md` **before modifying code**;
3. inspect the current source to verify the handoff;
4. continue from the stated checkpoint rather than restarting old investigations;
5. search the user's Library for named external research/game-package files referenced by the handoff before asking the user to recreate or re-upload them.

## Keep it current, not historical only

The embedded handoff should be rewritten/updated as the project advances. It may retain critical historical lessons where they prevent regressions, but its main job is to describe the **current state and next work**. Do not leave a stale v0.5.0 handoff inside a later build.

## Current v0.5.0 research start

At this exact checkpoint, the next fresh-chat objective is **Team Plan tactics selection research**. Formation is considered good. Set Pieces has a visible Captain-selection bug and recommendation logic still needs an audit, but the large research task is to determine how tactics and mentors should be chosen for the actual team composition using authoritative game data first and current community/meta evidence second.

The scanner remains frozen at the v0.4.18 known-good behaviour unless a new real screenshot demonstrates a regression.


---

# v0.5.0 research checkpoint — 13 September 2026

A new authoritative Windows game package, `TopEleven_Full(4).zip`, was supplied for v0.5.0 research. Its `GameAssembly.dll` and `global-metadata.dat` hashes exactly match the previously reverse-engineered v27.3.0.0/build-30527 binaries, so prior native tactics findings are valid for this package.

A detailed evidence ledger now exists at:

`docs/development/V050_TEAM_PLAN_EVIDENCE_LEDGER.md`

Important new findings:

- Captain is not currently lost by render/storage. `js/recommendations.js` deliberately returns `captain: null` because no authoritative Captain formula is known.
- The official client proves Captain/corners/free-kicks/penalty duties are explicit assigned/saved fields, but no authoritative automatic ranking formula has yet been recovered.
- `ensureSetPieces()` has a stale-state problem: prior assignments are retained while the player stays in the XI, so generated recommendations do not necessarily refresh after player/XI/logic changes. The next state model must distinguish auto recommendations from manual user overrides before recalculating them.
- `Set Piece Taker` is confirmed as a current build-30527 Special Ability, not a stale legacy tag.
- Exact tactics condition-drain findings remain confirmed for the matching binaries. The app's “best tactic” scoring remains transparent companion logic, not a recovered match-engine formula.
- Mentor level handling has a confirmed modelling defect: changing the level override changes only the level number while retaining raw boost arrays captured at a different level. Attribute coverage is currently scored regardless of unlock state. Current official Top Eleven documentation proves Mentor progression gates Tactical Boost, Attribute Boost and Signature Move by level, so v0.5.0 must model effect-family availability separately and must not invent per-level values.
- Previous live Alan Shearer -> Lewis Green halftime capture remains useful: the server accepted the switch and the next MatchPeriod contained Green. The strong crossing signal after the switch is evidence/hypothesis only, not causal proof.

No Team Plan production logic has been changed at this checkpoint. Scanner and Formation remain frozen.

## v0.5.0-r1 implementation checkpoint — Set Pieces provenance

The first production code change of v0.5.0 is complete.

### Changed

- Runtime/public version moved to `v0.5.0` / `0.5.0-r1`.
- Set Piece storage moved from flat `teamplan:setpieces:v3` to provenance-aware `teamplan:setpieces:v4`.
- Automatic recommendations now recalculate against the current XI.
- Manual assignments are explicitly tagged and preserved.
- Existing v3/v2 values migrate as `legacy` rather than being silently overwritten.
- A `Refresh Recommendations` action resets all non-Captain slots to current companion recommendations.
- Captain remains manual and the UI explains that no authoritative Top Eleven Captain formula has been recovered.

### Tests

- Core suite: 270 assertions PASS (up from 263 before the change).
- Static checks PASS.
- Package integrity PASS.
- Cloud hydration/navigation contract PASS.
- Frozen v0.4.18 scanner native-resolution/reference contracts PASS unchanged.

### Next research target

Continue the v0.5.0 Tactics static/native trace. Preserve the exact recovered condition-drain model, but do not treat the current `rawSupports()`/option-fit recommendation model as Nordeus match-engine truth. After the Tactics evidence pass, correct Mentor level/effect-family modelling using official unlock rules and recovered/live boost state without inventing per-level values.


## v0.5.0-r2 implementation checkpoint — Tactics evidence pass

Tactics static research and the first evidence-led recommendation correction are complete.

### Authoritative findings

- `TopEleven_Full(4).zip` remains byte-identical at the critical IL2CPP binaries to the prior v27.3.0.0/build-30527 research.
- Exact recovered condition-drain architecture/formula/checksums remain unchanged.
- Current shipped `tactics_v2_tooltip_*` localisation provides authoritative semantic descriptions for all 11 tactic dimensions.
- Marking is explicitly opponent-dependent in the current game text: Man-to-Man is described as helping against faster attacks, while Zonal is described as better against longer-distance attacks.
- Current tutorial text says tactic changes expose expected behaviour + condition drain, but the current static metadata trace did not recover a separate numerical `best tactics for this XI` client service. Exact Football Engine effectiveness weights remain unresolved/private.

### `js/tactics-engine.js` changed

Model version: `30527-drain-fit-v2`.

- Removed invented `Approach styleIndex -> every non-Mentality setting` weighting. Approach now performs the proven job of locking Mentality.
- Preserved role/key-attribute XI support as transparent companion logic.
- Stopped inferring Marking from our own defenders; normal two-input UI keeps opponent attack type unknown and uses a neutral fallback. Engine API accepts explicit opponent context for future controlled use without adding UI clutter.
- Fixed equal-lane tie behaviour so symmetric teams no longer manufacture Left Flank because of enum order; all-lane equality prefers Balanced and equal strongest wings prefer Both Flanks when drain allows.
- Added game-semantic/playstyle/SA compatibility as lexicographic tie-break signals only. No hidden numerical Nordeus effect is claimed.
- Added explicit `evidencePolicy` to recommendation output.

### UI

The Tactic Calculator intentionally remains only **Approach + Drain Limit**. No opponent input was added. The explanatory note now states that recommendations use the XI, exact drain and evidence-backed tactic semantics, and that Approach sets Mentality rather than secretly weighting every other setting.

### Tests

- Core suite: **276 assertions PASS**.
- New regressions prove Approach no longer changes non-Mentality squad-fit, Marking is not fabricated from own-XI data, symmetric lanes choose Balanced, and explicit fast/long-distance opponent context maps to the current shipped Marking guidance.
- Exact drain checksum tests remain unchanged and green.
- Full static/package/scanner contracts must remain green before packaging r2.

### Next target

Proceed to the **Mentor correction/rebuild**. The known priority defect is that level overrides currently reuse effect arrays captured at different levels and score Attribute coverage before its proven unlock. Implement effect-family availability gating first, without inventing per-level magnitude curves, then reassess Green/Shearer/Fàbregas/etc. against the corrected v2 tactics output.
