# v0.5.9 — Full Windows client evidence checkpoint

Date: 2026-09-14

## Scope

This checkpoint continues the v0.5.x research phase without changing production recommendation behaviour. It compares the older build-30527 Android/native archive with the newly supplied `TopEleven_Full(5).zip` Windows/WSA client and current 2026 official/community evidence.

Evidence classes remain separate:

- **GAME STATIC CLIENT** — directly recovered from shipped current-client metadata/resources.
- **GAME/LIVE FACT** — directly observed in captured runtime state or protocol.
- **OFFICIAL CURRENT** — current Nordeus Help/official material.
- **COMMUNITY CORROBORATION** — player reports; never promoted to hidden game maths.
- **COMPANION LOGIC** — our transparent interpretation from multiple evidence layers.

## Full-client identity

The supplied Windows/WSA client uses **Unity 6000.3.13f1**, IL2CPP metadata **v39**, and exposes `BundleVersionCode = 10599`. It is materially richer than the earlier static archive for Mentor Prestige, current Special Abilities, Playstyle match feedback and live-match trigger instrumentation.

## Major correction — Shadow Striker is current

v0.5.8 research text incorrectly concluded Shadow Striker was absent because the raw enum contains `LongShots`.

The current client proves the intended interpretation:

- raw/internal enum: `LongShots`
- `special_ability_6 = Shadow striker`
- `{sa-long-shots} Shadow striker`
- inventory title: `Shadow striker`

Therefore **Shadow Striker is the current player-facing Special Ability**. `LongShots` is only a historical/internal enum/localisation token for that entry and must never be presented as a separate ability. This checkpoint corrects the earlier research-layer naming confusion.

Current client also contains **Rebound Specialist, Cross Expert and Counter Attack Stopper**, and supports first/second/third Special Ability slots.

## Special Ability eligibility boundary

The current client contains:

- `GetEligibleSpecialAbilitiesForRole`
- `GetAvailableSpecialAbilities`
- `AvailableSpecialAbilitiesForTrainingFetched`
- protocol/state `EligibleSpecialAbilitiesAndPlaystylesForRole`
- repeated `AvailableSpecialAbilities`

This proves role/player eligibility is an explicit runtime concept. The pass did **not** recover one universal immutable role→SA table from static files. The safe companion rule remains: use the player's/server-provided availability when choosing a trainable SA; never invent universal eligibility.

## Live match activation instrumentation

The current Football Engine stream exposes dedicated activation records:

- `StreamingSpecialAbilityEventDescriptor.SpecialAbilityType`
- `StreamingPlaystyleTriggerDescriptor.PlaystyleTriggerType`
- `StreamingPlaystyleTriggerDescriptor.PlaystyleOutcomeType`
- `SpecialAbilityTriggeredInLiveMatch`
- `PlaystyleTriggeredInLiveMatch`

This is a major route forward. Controlled future captures can count the exact ability/playstyle activations and Playstyle outcomes instead of guessing activation from goals, commentary or 3D animation. These fields do **not** expose a universal SA effectiveness multiplier, so that remains unresolved.

## Mentor Prestige and Signature Seals — now client-proven

The full client contains `MentorProgress`, `PrestigeStep`, `MentorBoost`, `MentorPrestigeExtensions`, `PriceForNextPrestige`, repeated `PrestigeProgress`, `CurrentEffects`, `NextLevelEffects`, `LastUnlockedTier` and three UI prestige milestone/tier assets.

Resource strings additionally prove that **Signature Seals are the Mentor gating currency used to Prestige a Mentor and further improve Signature Move**.

This upgrades the old v0.5.8 boundary from “official-current but static-unresolved” to **GAME STATIC CLIENT + OFFICIAL CURRENT** for the existence of three Prestige stages and Signature Seal progression.

The exact Signature formulas are also present as game-authored localisation. In compact form:

| Signature | Game-authored condition/effect semantics |
|---|---|
| Blind Side | Counterattack; opposing Marking, Positioning and Speed become less effective. |
| Aerial Dominance | Crosses become extremely precise; defender Heading becomes less effective in aerial duels. |
| Adaptive Blueprint | At halftime finds opponent weakest defensive zone; attackers through that zone receive All Attribute boost for rest of match. |
| Momentum Chain | Each successful pass makes next pass harder to intercept; midfielders pay extra Stamina per attack. |
| Ankle Breaker | Corners/FKs/penalties more effective; on miss, opponent attackers get a next-attack penalty. |
| Iron Check | Successful defensive checks drain opponent attacker Condition; card risk rises. |
| Parking the Bus | While leading, defenders gain defensive attributes while team attacking attributes are penalised. |

The exact current/next values remain runtime state (`CurrentEffects[]` / `NextLevelEffects[]`), so we do not invent a universal level ladder.

## Playstyle evidence upgraded substantially

The client contains all 20 current Playstyle descriptions plus Playstyle-specific post-match feedback and trait-test strings. These are game-authored evidence of situations the game associates with each style.

For the current ST model this materially strengthens the distinctions:

- **Poacher:** repeated box/defensive-line threat language; direct scoring focus.
- **False Nine:** ball control, movement around central defence and difficulty for DCs.
- **Target Man:** repeated high-ball/aerial control, crosses, long passes and hold-up play.

The Target Man connection is especially strong: current game strings explicitly say long passes are received/held up, crosses reach the Target Man, aerial space is controlled, and high balls find the player. Therefore `Target Man -> aerial/long-pass/cross service` is no longer dependent on community anecdote.

Game-authored feedback also strongly characterises Winger (flank speed/crosses), Enganche/Regista (precise passing/line breaking), Ball Winner (interceptions/pressure), Wing Back (flank/cross contribution), Full Back (flank defence), Stopper (preventing close chances), Ball-playing DC/GK (build-up), and Sweeper Keeper (intercepting long balls/cross threats).

These semantics are **not numeric skill coefficients** and do not justify inventing hidden percentages.

## Tactics condition cost current-client confirmation

The full client contains `TacticsConditionDrainSettings`, `TacticsDrainOverrides`, `TacticsConditionDrainRepo` and `TacticsConditionDrainService.CalculateConditionDrain` across all 11 tactic dimensions. This confirms stamina/Condition cost is a real current tactic consideration.

The current numeric override table was not safely recovered in this pass. Older build-30527 arithmetic remains archived evidence for that build, but do not silently assume every old numeric value is identical in this newer Windows client until verified.

## Community comparison

Current 2026 player reports independently align with several extracted relationships:

- Cesc Fàbregas for possession/short-passing plans and Rubén Herrera for counterattack.
- Lewis Green paired with high crossing and a Target Man.
- Target Man favoured in cross/aerial setups; Poacher favoured as a primary scorer; False Nine used as a deeper creator/space manipulator.

This is useful corroboration, not hidden-engine proof. Historical 2023–2024 Special Ability opinions remain contradictory and are kept as legacy evidence only.

## Production decision

No production scanner, formation, tactics or Mentor ranking logic is changed in v0.5.9. The purpose of this build is to preserve the stronger evidence before implementation.

The next research priorities are:

1. exhaust the current client for any recoverable static role→SA eligibility map or exact new-SA action hooks;
2. trace Playstyle trigger/outcome types toward exact style→trigger mappings;
3. continue current community/player-result collection as corroboration;
4. design capture parsing around explicit SA/Playstyle activation events;
5. only then productionise Signature-aware Mentor pre-match + halftime recommendation rules.
