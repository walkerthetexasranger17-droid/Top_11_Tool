# Build 30527 Compatibility Notice

## Canonical implementation contract

The single implementation source of truth for this application is:

`docs/reference/TOP_ELEVEN_TOOL_BIBLE_BUILD_30527_v1.md`

This file remains at the historical path because earlier builds and research packages referenced it. It is **not a second contract** and must not override the Bible.

## Current final training rules

For Build 30527, the final companion training model is the Bible §§15–16 model:

- white/key attributes are the union across the player's **natural roles**;
- `target = mean(top 3 current white-skill values)`;
- `need[a] = max(1, target - current[a] + 1)`;
- grey/non-key attributes have **zero utility and no fabricated dilution penalty**;
- normal drill strength is `XP * (1 + levelEffect/100)`;
- Master drill strength is `XP * (1 + additionalTrainingEffectPercent/100)`;
- six slots are selected using deterministic **beam search width 250**, not the superseded greedy selector;
- normal drills may repeat; Master duplicates are limited by user-owned stock;
- the recommendation score is companion logic, **not an exact prediction of server-side percentage-point gain**.

Team Training uses the actual players in the selected group, each player's natural-role white union and per-player diminishing credits, then the same six-slot beam-search approach. Protocol `TeamPlayTrainingDrill` remains a separate system.

## Evidence boundary

Do not invent private Nordeus formulas or values. GAME FACT and LIVE FACT data come from the Build-30527 Bible/provenance package. Companion calculations must remain transparent and must not be presented as hidden Top Eleven match-engine logic. Values classified by the Bible as UNRESOLVED remain unresolved unless new legitimate evidence specifically proves them.
