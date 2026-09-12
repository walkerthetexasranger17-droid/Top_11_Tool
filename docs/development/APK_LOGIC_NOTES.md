# Build 30527 training logic boundary

This Beta uses the packaged `data/build_30527/` handoff as the source of truth for Individual Training. The current Top Eleven build is a hybrid client/server system: the app can model drill selection from authoritative local drill/key-attribute data, but it must not claim to reproduce final server-side attribute gains.

## Authoritative and used by the optimiser

- white/key attributes for every role
- multi-position rule: UNION of key attributes across all saved roles
- 29 normal drills and their exact affected attributes
- normal drill intensity
- normal drill condition cost
- normal drill XP per player
- normal drill ordering metadata
- user-editable normal drill unlocked state and level / Training Effect
- four Master/Campus drills and their exact affected attributes
- Master/Campus intensity, condition cost, XP and +80% additional Training Effect
- user-entered Master card stock with no artificial maximum
- duplicate normal drills are legal
- duplicate Master drills are legal only up to owned stock
- outfield players exclude irrelevant GK-only attributes from drill applicability

## Explicit optimiser contract

The six-slot optimiser ranks useful development into the player's currently weakest required white/key attributes. After each selected slot it credits the attributes that slot trains and re-evaluates need before choosing the next slot. Stronger/high-intensity drills are favoured when they train attributes the player actually needs. Condition is reported, but it is not the primary objective. Grey attributes are not used as a simplistic minimise/count target.

The displayed **Useful Training Score** is a ranking value only. It is not a predicted +X% gain.

## Confirmed game concepts that are still not fully reproducible offline

- exact final attribute gain returned/processed by the live server training flow
- full server preview values such as Player Effect, Balance and Total Effect
- local/global cap constants and complete overflow maths
- exact age-rate thresholds from runtime/server configuration
- unrecovered TeamPlayTraining session/critical/per-drill multipliers

## Deliberately excluded from the Individual Training optimiser

- invented gain probabilities
- invented expected +X% skill increases
- the old 180-wall heuristic as a hard gate
- arbitrary grey-skill caps as the main optimisation rule
- arbitrary Master-card quantity limits
