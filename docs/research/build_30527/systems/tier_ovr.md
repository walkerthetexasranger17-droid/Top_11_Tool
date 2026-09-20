# Tier / OVR Formula — build 30527

## Evidence status

**GAME UI FACT + arithmetic cross-check**

The current game UI states that Tier grants a fixed permanent increase to **all key attributes**, and that the Tier increase on OVR depends on the number of the player's key attributes.

For outfield players there are 15 displayed attributes total (5 Defence + 5 Attack + 5 Physical). Therefore, if a Tier grants `B` points to each of `K` key attributes, the underlying OVR contribution is:

```text
Tier OVR contribution (underlying) = (B × K) / 15
```

Displayed integer OVR is rounded from the underlying average; the displayed `Tier increase` is consistent with the difference between displayed rounded post-Tier OVR and displayed rounded base/total quality.

## Confirmed examples

### Gosling Lataille — ST — Stellar

- ST key attributes: 9
- Stellar bonus: +50 to every key attribute
- Expected underlying Tier OVR contribution: `50 × 9 / 15 = 30`
- UI: `127 + 30 Tier increase = 157 OVR`
- Attribute arithmetic: displayed 15-attribute mean = 156.6 -> 157; subtracting 50 from the 9 ST key attributes gives mean 126.6 -> 127.

### Sergey Kazachenko — AML — Rare

- AML key attributes: 8
- Rare bonus: +10 to every key attribute
- Expected underlying Tier OVR contribution: `10 × 8 / 15 = 5.333...`
- UI: `110 + 5 Tier increase = 115 OVR`
- Attribute arithmetic: displayed mean = 114.8 -> 115; subtracting 10 from the 8 AML key attributes gives mean 109.466... -> 110.

### Fidel Sánchez — AMC + AMR — Rare

The player-wide key set is the **union** of natural-role key attributes:

- AMC keys: Passing, Dribbling, Shooting, Finishing, Heading, Fitness, Speed, Creativity
- AMR keys: Passing, Dribbling, Crossing, Shooting, Finishing, Fitness, Speed, Creativity
- Union size: 9 (Heading and Crossing are both included)
- Rare bonus: +10 to every key attribute
- Expected underlying Tier OVR contribution: `10 × 9 / 15 = 6`
- UI: `110 + 6 Tier increase = 116 OVR`
- Attribute arithmetic: displayed mean = 115.666... -> 116; subtracting 10 from the 9 union-key attributes gives mean 109.666... -> 110.

## Important implications

1. Different players receive different **OVR increases from the same Tier** because their natural-role key-attribute count differs.
2. Multi-natural-role players can receive a larger Tier OVR increase because their key set is the union of all natural-role key attributes.
3. Tier OVR increase is therefore not evidence that the player received a stronger Tier effect per attribute; the per-key-attribute Tier bonus is the same, but it applies to more attributes.
4. For research/training-profile analysis, a useful **pre-Tier profile** can be reconstructed by subtracting the Tier bonus from each current player-wide key attribute.
5. For match selection, do **not** assume Tier should be removed: the UI calls the increases permanent, so actual tier-adjusted values should remain the default match-facing attributes unless match-engine evidence proves otherwise.
6. A player's displayed OVR can be inflated differently by Tier depending on role count/key-count. Direct OVR comparisons across different role profiles therefore need care.

## Relation to role-priority research

This formula does **not** prove that some white/key attributes are more important in match resolution than others. It only proves how Tier changes displayed attributes and OVR. The separate role-priority investigation should compare both:

- actual post-Tier match-facing attributes; and
- reconstructed pre-Tier trained profiles,

while seeking native/action-consumer evidence for primary vs secondary skill importance.

## Evidence images

Stored under `../evidence/tier_ovr_formula_2026-09-14/`.

## Preserved genuine Tier asset source

The original user-supplied Top Eleven Tier asset archive is preserved intact at:

`docs/research/build_30527/source_archive/tier_assets/TopEleven_Tier_Assets_Source.rar`

This source is for future UI implementation. Do not replace its Tier symbols with generated artwork.
