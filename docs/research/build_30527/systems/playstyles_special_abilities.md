# Playstyles and Special Abilities — Build 30527

## Playstyles

Current active communication catalogue:
Poacher, False Nine, Target Man, Enganche, Inside Forward, Winger, False Winger, Mezzala, Box-to-Box, Regista, Ball Winner, Anchor Man, No-Nonsense DC, Stopper, Ball Playing DC, Full Back, Wing Back, Ball Playing GK, Sweeper Keeper, Box Commander.

`Ball Playing GK` remains in a communication enum but current captured definitions give it no eligible roles and the current Football Engine enum omits it. The companion does not offer it.

Playstyle levels:
0 No Playstyle Level, 1 Locked, 2 Standard, 3 Intermediate, 4 Advanced, 5 Master.

Exact performance multipliers remain unresolved.

## Current Special Ability enum

1 Penalty Kick Stopper  
2 One-on-One Stopper  
3 Aerial Defender  
4 Defensive Wall  
5 Playmaker  
6 One-on-One Scorer  
7 Shadow Striker  
8 Dribbler  
9 Penalty Kick Specialist  
10 Free Kick Specialist  
11 Corner Specialist  
12 Set Piece Taker  
13 Versatile Attacker  
14 Intercepting Specialist  
15 Set Piece Stopper  
16 Blocker  
17 Rebound Specialist  
18 Cross Expert  
19 Counter Attack Stopper

Shadow Striker is not in the current enum.

## Eligibility boundary

The official client asks the server for `GetAvailableTrainingAbilitiesResponse.PlayerAbility[]` for a specific player. Therefore a universal role→trainable-SA matrix must not be invented.

Playstyles and Special Abilities are match-engine relevant (trigger/event structures exist), but exact hidden numerical performance multipliers remain unresolved.
