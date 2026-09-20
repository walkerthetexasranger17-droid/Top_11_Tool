# Top Eleven APK Full Static Mine — Build 30527

## Scope

Static analysis of the user-supplied APK `te_directapk_prod_30527.apk`. This report separates data physically recoverable from the APK from values whose **schema is in the APK but whose current numeric value is supplied by Top Eleven servers at runtime**.

APK SHA-256: `88bd2944a0ea2b3089e3425a8b325264609dfc9e38ef62f75ba6fc1ed74d2ab6  /mnt/data/te_directapk_prod_30527.apk`

## Package / engine inventory

- 6,121 APK entries unpacked (~681 MB).
- Unity IL2CPP application; Unity version recovered from bundles: **6000.3.13f1**.
- IL2CPP metadata version: **39**.
- Full metadata catalogue: **40,422 types, 187,721 fields, 329,019 methods**.
- **3,111 enum-like types / 20,243 enum members** decoded.
- **2,140 communication/protobuf-style messages** had field-number structures decoded in the complete protocol index.
- 72 Android Unity asset bundles were decompressed and their 137 internal UnityFS nodes extracted.

## High-confidence training findings

### Actual drill name catalogue embedded in localisation

Recovered **30 standard drill localisation IDs** and **48 Team Play drill localisation IDs**. Standard IDs include:

- 1: Pass, Go and Shoot!
- 2: Fast Counter-Attacks
- 3: Ball Control
- 4: Shooting Technique
- 5: Set-Piece Delivery
- 6: Slalom Dribble
- 7: Wing Play
- 8: 1-on-1 Finishing
- 9: Press the Play
- 10: Piggy in the Middle
- 11: Goalkeeper Training
- 12: Use Your Head
- 13: Stop the Attacker
- 14: Defending Crosses
- 15: Video Analysis
- 16: Hold the Line
- 17: Warm-Up
- 18: Stretch
- 19: Sprint
- 20: Carioca with Ladders
- 21: Long Run
- 22: Gym
- 23: Shuttle Runs
- 24: Hurdle Jumps
- 25: First Touch Play
- 26: Rapid Side Switch
- 27: Stay In Lane
- 28: Passes Before Shot
- 29: Contact Play
- 99: Ball Control

The standard catalogue includes ID 99 (`Ball Control`) as a duplicate/localisation variant; this does **not** by itself prove ID 99 is currently selectable.

### Training drill wire format

`BasicTrainingDrill` server record:

- #1 DrillId
- #2 Type
- #3 State
- #4 Level
- #5 IntensityLevel
- #6 ConditionDrop
- #7 Attributes
- #8 OrderingPriority
- #9 ExperiencePointsPerPlayer
- #10 TeamPlayPoints
- #11 Visibility
- #12 DrillIdForAssets

`ConsumableTrainingDrill` additionally exposes usages/max usages, source/client data and `AdditionalTrainingEffectPercent` (#13).

`TeamPlayTrainingDrill` exposes `SessionMultiplier` (#12), `CriticalMultiplier` (#15), `PerDrillMultiplier` (#17), legendary effect (#14) and match-day-coach boost (#16).

### Training result / preview protocol

`PreviewTrainingEffectRequest`: player IDs + drill IDs.

`PreviewTrainingEffectResponse`: PlayerRequirements, Affinity, BonusGainPreviews, Balance, Condition, TotalEffect and detailed tooltip data.

`ExecuteTrainingResponse`: AttributesPerDrills (#8), TrainedPlayers (#9), TrainingDrills (#12), bonuses, coach level/points, additional bonuses, special-coach state, over-train data and Team Play effect keys.

### Client-side skill distribution exists

The APK contains `DefaultAttributeCategoryStrategy` with:

- ApplySkillPoints
- ApplySkillPointsWithCap
- ApplyOverflowSkillPoints
- IncreasePlayerAttribute
- RoundUpThirdDecimalAttributeValue
- DistributePerAttributeGroup
- DistributePerAttribute
- ApplyDistributionToPlayer
- DistributePerAttributeWithCap

It also contains `PlayerAttributeCapCalculator` with local/global cap tests and distances. This proves the client contains real post-processing/distribution logic, even though some raw training results originate server-side.

### White/key attributes are explicit

`Nordeus.TopEleven.Domain.Player.PlayerAttributesUtils` contains `KeyAttributesForRoles`, `IsKeyAttribute` and `GetKeyAttributes`. The player domain also has recalculation methods using gain per key attribute. Therefore white/grey skill handling should ultimately follow this role-key-attribute model rather than UI colour guessing.

### Formal age-rate inputs exist

The login `ClubResponse` provides:

- #53 PlayerMaxRateAge
- #54 PlayerHalfRateAge
- #55 PlayerQuarterRateAge

These are **runtime server configuration values**. The APK proves the bands and their wire fields, but does not contain the account/current-server numbers as hardcoded constants.

### Other server-provided player/training constants

`ClubResponse` also supplies:

- #39 TrainingSpecialAbilityCostByType
- #40 TrainingRoleCost
- #41 MaxAttributesDefference
- #42 SkillPointsPackageSize
- #43 MaxPlayerAttributesSum
- #51/#52 skill-point price star thresholds
- #92 AttributeMultiplier
- #93 SkillPointsForOneAttribute
- #129 PlaystyleDefinitions
- #131 UserTrainingLevel
- #140 PreparationTrainingEnabled
- #141 TrainingFeatureSwitches
- #143 PlayerTiersConfiguration

This is the strongest proof so far of why adding empty fields to the companion app is insufficient: many authoritative figures are delivered dynamically.

## Tactics findings

The current tactics-v2 client has explicit option enums for passes, shooting tendency, passing focus, crossing, transition after losing/winning possession, mentality, marking, pressing, back line and tackling.

`ClubResponse` field **#154 `TacticsConditionDrain`** delivers a `TacticsConditionDrainSpec` containing all 11 tactical groups. The client contains `TacticsConditionDrainRepo` and `TacticsConditionDrainService.CalculateConditionDrain` / `ResolveTotalDrainIntensity`.

This means the APK exposes the **calculation architecture and protocol**, while the current drain values/intensities are server-configured.

## Player model findings

Current player protocol exposes, among other fields:

- Age #5, Quality #11, Condition #13
- Attributes #15, SkillPoints #16
- LastTrainingSkillPointsProgressIncrement #18
- TrainingSpecialAbility #21 / spent points #22
- TrainingRoleId #23 / spent points #24
- Roles #40
- PauseSpecialTraining #46
- NewQuality #51
- multiple special abilities #52/#54/#58
- Playstyle #55

Recovered player attribute enum contains 25 attributes (Fitness through Concentration). Role enum maps GK=0 through ST=13.

## Special abilities / playstyles

Current special-ability enum contains more abilities than the older 11-item companion-app list, including Long Shots, Set Piece Taker, Versatile Attacker, Intercepting Specialist, Set Piece Stopper, Blocker, Rebound Specialist, Cross Expert and Counter Attack Stopper.

The current FootballEngine playstyle enum includes Poacher, False Nine, Target Man, Enganche, Inside Forward, Winger, False Winger, Mezzala, Box-to-Box, Regista, Ball Winner, Anchor Man, No-Nonsense DC, Stopper, Ball Playing DC, Full Back, Wing Back, Sweeper Keeper and Box Commander. The exact communication/domain representations should be used rather than maintaining an old hand-written list.

## Teamplay rules that are literally embedded in localisation

The APK states that Teamplay Form has Attack, Defence, Possession and Condition; normal caps begin at 10 and can be advanced to 20 in steps of 2; each cap advancement adds **5%** gains up to **25%**; Teamplay Form is reduced daily by 2 under normal stated rules; and values above 14 can decrease more. These are literal user-facing rules in this build, unlike runtime drill multipliers which are server fields.

It also explicitly describes some Team Play effects, e.g. Rejuvenation Clinic restores **30% condition** and various drills create 24-hour effects. See the localisation JSON for exact current embedded copy.

## Asset-bundle findings

All 72 bundled Unity asset bundles were successfully unwrapped (outer Zstandard + UnityFS contents). Training assets confirm current categories/variants including attack-, defence-, physical-, possession-focused drills and titanium variants. Asset bundles are predominantly presentation data; they did not expose a simple authoritative numeric table containing all current drill condition/gain values.

## Network/protocol findings

The APK contains protobuf-generated communication classes, Centrifuge/WebSocket/RPC support, gameworld routing terminology, public CDN URLs and numerous development/test route strings. Those strings are useful for reconstructing client architecture, but internal/dev paths were **not probed** and should not be treated as public APIs.

## What a full static APK mine can and cannot recover

### Recoverable directly

- Complete client type/method/field catalogue
- Protocol message names and field numbers
- Enum IDs and option values
- Drill/localisation names and IDs
- Teamplay user-facing rules
- Client-side distribution/cap architecture
- Settings names / feature switches
- Asset identifiers and client presentation resources
- Exact list of runtime values the client expects from the server

### Not present as current hardcoded figures

The static APK does **not** contain the current server-populated values for fields such as:

- current BasicTrainingDrill.ConditionDrop / Attributes / XP for every returned drill instance/level
- age threshold values in ClubResponse #53–55
- SkillPointsPackageSize/current AttributeMultiplier/current SkillPointsForOneAttribute
- current role and special-ability costs
- current tactics condition-drain intensities
- current playstyle level definitions/point thresholds if delivered dynamically
- preview Affinity/Balance/Condition/TotalEffect for arbitrary player+drill selections
- execute-training AttributesPerDrills results

The APK gives us the exact **decoder schema** for these. Obtaining the present values requires a legitimate runtime response/cache from the official client; static analysis cannot conjure values that are not physically in the file.

## Companion-app implementation consequence

Do not invent defaults for server-owned figures. The companion app should maintain three data classes:

1. **APK-authoritative constants** — enum IDs, roles, attributes, embedded rules/localisation.
2. **Server-runtime configuration** — age thresholds, drill records, tactics drain, playstyle definitions, package sizes, etc.; nullable/versioned until populated from observed official-client data.
3. **Derived companion calculations** — grey/key-skill counts, drill rankings, efficiency metrics and recommendations calculated only when required source fields are known.

That prevents the current failure mode where a schema field exists in the app but silently behaves as zero.
