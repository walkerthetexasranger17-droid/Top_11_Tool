# Tactics Semantic Archetypes — Build 30527

## Evidence boundary

These are **not Nordeus tactic presets** and contain no recovered match-engine weights. They are Top Eleven Tool semantic bundles built only from current shipped tactic tooltips + current shipped Assistant Feedback relationships. They exist to make the companion recommender explainable and to avoid arbitrary option combinations when XI-fit is tied.

Source archive: `../source_archive/TACTICS_ASSISTANT_FEEDBACK_EXTRACT.txt`
Structured evidence: `data/build_30527/index/tactics_assistant_feedback.json`

## Game-authored relationships recovered

### Possession / control
GAME FACT semantics:
- short passing is repeatedly recommended to keep/increase possession and control midfield (`assistant_feedback_4`, `_73`, `_114`, `_134`, `_43`);
- current tooltip: short passing increases combination plays;
- current tooltip: Focus On Buildup is safer, although more predictable;
- long balls may be rejected when they are being intercepted (`_112`, `_132`).

Companion implication: a possession-oriented tie may prefer **Short + Buildup**, but this is a semantic pairing, not a numerical game formula.

### Direct / counter
GAME FACT semantics:
- defensive situations are repeatedly paired with **long balls + counter-attacks** (`_166`, `_170`, `_128`);
- sitting back + counters is explicitly advised against stronger opposition (`_138`, `_19`);
- fast players are explicitly cited as a reason counter-attacks may work (`_183`);
- long passing can be recommended when chasing a result (`_45`, `_44`).

Companion implication: **Long + Force Counter Attack** is an evidence-backed semantic pair; defensive approach and high Transition/Speed support may break ties in its favour. It is not universally best.

### Focus Passing is dynamic
GAME FACT semantics:
- the game recommends focusing passing toward the best-performing part of the pitch (`_88`);
- it explicitly recommends switching from flanks to middle when flank passes are intercepted (`_110`);
- middle can be explicitly praised (`_203`, `_204`) or called ineffective (`_205`);
- left/flank attacks can be praised (`_154`, `_111`) or called ineffective (`_152`).

Companion implication: no Target Formation should hard-code Center/Both Flanks. The DMC+MC target deliberately keeps both flanks and centre structurally available, while the actual XI/later opponent context selects the lane.

### Midfield numbers and attacking targets matter
GAME FACT semantics:
- being outnumbered in midfield gives the opponent a better chance of keeping the ball (`_172`);
- losing possession can trigger advice to strengthen midfield (`_28`, `_29`, `_61`);
- too few targets ahead can hurt useful possession (`_145`);
- defenders outnumbering attackers can trigger advice to support forwards (`_174`);
- a deeper player is explicitly suggested to protect against counter-attacks (`_25`).

This strongly supports the Target Formation requirement for a DMC/MC central base plus multiple advanced targets.

### Pressing
GAME FACT semantics:
- pressing is advised to win the ball and attack (`_179`) and to recover the ball before it reaches goal (`_202`);
- high pressing can work (`_135`) but the game explicitly warns about fatigue (`_136`);
- with a comfortable result, high pressing may be unnecessary (`_189`, `_191`);
- current tooltip says different pressing styles counter different actions and have different condition cost.

Companion implication: pressing intensity must remain context/drain dependent; do not permanently tie the Target Formation to High Press.

### Offside trap
GAME FACT semantics:
- attacking style + offside trap is explicitly recommended in `_198`;
- the game repeatedly warns that a poorly executed/high line can be beaten (`_186`, `_58`, `_59`, `_187`, `_188`, `_60`).

Companion implication: Attacking/Hard Attacking may use Offside Trap as a semantic tie signal, but it must not be mandatory.

### Marking and tackling
GAME FACT semantics:
- current tooltip: Man-to-Man boosts defence against faster attacks; Zonal does better against longer-distance attacks;
- zonal is specifically suggested when defensive coverage is overwhelmed or players are left unmarked (`_65`, `_66`);
- hard tackling can stop more actions but increases fouls/cards; Assistant Feedback repeatedly recommends easing tackling when cards accumulate (`_157`, `_219`, `_220`, `_222`, `_117`).

Companion implication: Marking is opponent-dependent and tackling is risk/context dependent. Neither should be inferred solely from the user's XI.

## Target-formation consequence

The leading target `GK / DL DC DC DR / DMC MC / AML AMC AMR / ST` should be treated as a **tactical platform**, not a fixed tactical preset:

- central spine supports possession/build-up and direct transition choices;
- AML/AMR + DL/DR preserve both flank routes;
- AMC/ST provide advanced passing targets;
- DMC provides the explicit deep protection role the shipped Assistant can recommend;
- MC + AMC/DMC keep midfield numbers healthy;
- the XI can pivot between possession, direct-counter, wing, centre and pressing plans without changing the long-term recruitment skeleton.

This is the reason the target formation is preferred over a formation that is only strong for one game plan.
