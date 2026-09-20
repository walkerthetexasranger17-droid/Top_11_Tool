# v0.5.9 — Community tactics / Mentor logic checkpoint

Date: 14 September 2026

## Scope

This checkpoint mines the Top Eleven Tutorials & Guides/forum archive and, more importantly for the current meta, `r/topeleven` across roughly September 2024 to September 2026. The goal is not to recover hidden Nordeus coefficients from anecdotes. It is to create a transparent **COMMUNITY / COMPANION LOGIC** layer for ranking sensible Formation + Tactics + Mentor plans where the client exposes semantics but not private effectiveness maths.

Game/native evidence still wins whenever community claims conflict with it. Current 2026 reports are weighted above older recipes. One-off formation claims are not promoted to universal rules.

## What the community evidence actually supports

### 1. Midfield structure matters more than formation-name popularity

Across 2024-26, the recurring failure mode is a thin or empty central midfield. Current examples explicitly diagnose one MC being overrun by three central midfielders even where headline possession was 53%. DMC/MC reinforcement, diamond midfields, 3-1-4-1-1 / 3-1-5-1 families and double-DMC structures recur because they improve central coverage, not because a formation code is magically optimal.

**Companion rule:** heavily penalise central numerical mismatch and reward DMC/MC coverage. Possession is a secondary signal, not the objective function.

### 2. DMC is the strongest repeated structural recommendation

A DMC is repeatedly recommended against AMC/central overloads. Double-DMC structures appear in successful stronger-opponent reports. This agrees with the extracted role semantics and with the current app's preference for a screened defensive line.

**Companion rule:** reward at least one DMC against AMC/central concentration; consider a second DMC when materially weaker or facing strong central/transition threats.

### 3. Exploit the opponent's weak lane

The most durable rule across forum and Reddit is spatial: attack flanks when the opponent is narrow/central-heavy; attack centrally with AMC/through-middle pressure when the opponent lacks a DMC or central screen. This also agrees with shipped Assistant Feedback semantics.

**Companion rule:** lane focus must be opponent-aware. Do not choose Mixed simply because no own-team lane has a large skill lead.

### 4. 3CB versus back four must remain conditional

2024/early-2026 community meta often favours 3CB + DMC + a heavy midfield. Late-2026 discussion contains both continued 3DC use and renewed back-four preference. There is not enough evidence for a universal post-update winner.

**Companion rule:** keep both families. Back four gains value against explicit AML/AMR/wide threats; 3CB gains value when extra midfield control is valuable and ML/MR/wingback support provides width.

### 5. Passing style is a system choice

Short passing is repeatedly paired with close central support and possession/combination structures. Mixed/long distribution is used to bypass a congested midfield, feed counters or reach Target-Man/aerial outlets.

**Companion rule:** distribution follows structure and intended route to goal; do not hard-code Short or Long globally.

### 6. Against stronger/equal opposition, structural risk matters

Current stronger-opponent reports often succeed by adding DMC cover or reducing an over-attacking shape. The community does not support simply selecting Hard Attacking because the opponent is stronger.

**Companion rule:** increase screening/redundancy and transition value as opponent strength rises; only retain aggressive shape if the actual matchup supports it.

### 7. Mentor value is plan-dependent

This is the strongest current-2026 Mentor consensus and directly corroborates the extracted Mentor families.

- **Cesc Fàbregas** — short/possession/combination plans.
- **Rubén Herrera** — counterattack/direct-transition plans, especially versus stronger opponents.
- **Lewis Green** — wide/crossing plan with an aerial/Target-Man outlet; current reports align unusually well with his extracted Signature semantics.
- **Jonas Braun** — increased value as a halftime adaptation option rather than a universal pre-match winner.
- **Makélélé / Vidić / Shearer** — current matchup anecdotes exist, but evidence is too sparse for hard counter tables. Keep their ranking primarily game-semantic until more results accumulate.

**Companion rule:** Mentor is scored after/with the tactical plan, never independently.

### 8. ST Playstyle should modify the system, not choose it alone

Current Reddit discussion aligns with the current-client Playstyle semantics:

- Target Man — crossing/aerial/hold-up service.
- Poacher — primary scoring outlet.
- False Nine — deeper linking/space manipulation where surrounding attackers can score.

These are system-fit modifiers, not global rankings.

## Claims deliberately rejected

Do **not** encode any of these as facts:

- `3-1-5-1 is always best`.
- `back four is always best after the 2026 update`.
- `max possession = best tactic`.
- `one high-press/offside/man-marking recipe is always optimal`.
- `one Mentor is globally best`.

Community reports conflict on all of them.

## Machine-readable result

See `data/build_30527/index/community_logic_2024_2026.json`. It contains the rules, confidence levels and source IDs. Raw/structured source records remain in `community_evidence_2026-09-14.json` and `data/current_windows_client_2026-09-14/community_evidence_v2.json`.

## Product implication

The next implementation should score a **complete plan** rather than independently selecting Formation, then Tactics, then Mentor. The transparent plan dimensions should include at least:

- squad/XI role fit;
- central midfield control;
- DMC/defensive coverage;
- opponent weak-lane exploit;
- tactic/formation coherence;
- Playstyle fit;
- Mentor tactical + Signature-context fit;
- condition-drain/risk penalties.

The numeric values used to combine these are **COMPANION LOGIC** and must be visible/testable, not presented as recovered Nordeus percentages.
