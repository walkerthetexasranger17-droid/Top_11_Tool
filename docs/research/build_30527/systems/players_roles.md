# Players, Roles and Key Attributes — Build 30527

## Current playable roles

`GK, DL, DC, DR, DMC, ML, MC, MR, AML, AMC, AMR, ST`

DML/DMR remain legacy/internal and have no current playable role rectangle.

## Pitch space

Internal pitch geometry is 0–1000 × 0–1000. Exact current role rectangles are stored in `data/build_30527/roles_pitch_30527.json`.

## Natural / Related / Wrong

The current game explicitly distinguishes natural, related and wrong position state. Use server/player-derived roles; do not restore a hand-authored adjacency matrix.

## Key/white attributes

The role→key-attribute map is game data. Multi-role players use the union of the key attributes of all natural roles.

Current map:
- GK: Reflexes, Agility, Anticipation, Rushing Out, Communication, Throwing, Kicking, Punching, Aerial Reach, Concentration, Fitness
- DL/DR: Crossing, Tackling, Marking, Positioning, Bravery, Fitness, Aggression, Speed
- DC: Tackling, Marking, Positioning, Heading, Bravery, Fitness, Strength, Aggression
- DMC: Passing, Tackling, Marking, Positioning, Heading, Bravery, Fitness, Strength, Aggression, Creativity
- ML/MR: Passing, Dribbling, Crossing, Positioning, Fitness, Speed, Creativity
- MC: Passing, Dribbling, Shooting, Tackling, Marking, Positioning, Bravery, Fitness, Speed, Creativity
- AML/AMR: Passing, Dribbling, Crossing, Shooting, Finishing, Fitness, Speed, Creativity
- AMC: Passing, Dribbling, Shooting, Finishing, Heading, Fitness, Speed, Creativity
- ST: Passing, Dribbling, Shooting, Finishing, Positioning, Heading, Strength, Speed, Creativity

Native `PlayerWrapper.IsKeyAttribute` recovered at `0x4A592E0`.

No unproven role-specific attribute weighting should be called game fact.
