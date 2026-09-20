# v0.5.18 Drain Band Intent

## Problem
Under v0.5.17, Drain Limit was a ceiling. Medium admitted Low+Medium candidates and High admitted Low+Medium+High candidates. Drain efficiency and exact-score tie-breaks preferred cheaper candidates, so Medium and High could visibly return the same tactic package.

## Fix
For the historical/default runtime drain profile, Drain Limit is now an intent class:
- Low: raw <= 40
- Medium: 40 < raw <= 65
- High: raw > 65

The tactic scorer is otherwise unchanged. It still chooses the best own-XI fit within the requested class and still prefers lower drain on exact ties inside that class.

## Boundary
This does not claim recovered current-server mixed-intensity numeric weights. Live-observed mixed Medium/High arithmetic remains unresolved.
