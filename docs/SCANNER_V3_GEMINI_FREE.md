# Scanner v3 — Gemini Free Tier (v5.2.14)

Scanner v3 sends each Top Eleven Skills screenshot directly from the browser to the Gemini Developer API. v5.2.14 deliberately uses **Gemini 3.8 Flash only**. There is no model fallback to 3.5/3.6/3.7 and no paid fallback.

## Retry policy
Temporary overload, service-unavailable, network and rate-limit responses keep the queue item in an automatic retry state. Retries use provider `Retry-After`/RetryInfo when supplied, otherwise 10s → 20s → 45s → 90s → 120s and then remain capped at roughly 120s between attempts. Retryable items continue until successful or until the user removes them from the queue. Daily free-tier quota exhaustion is also retained for delayed retry with a minimum 15-minute wait. Authentication errors, invalid images, malformed requests and invalid scanner responses are hard failures rather than infinite retries.

## Playstyle state
The scanner must identify both playstyle identity and state. Build 30527 states are: Locked (1), Standard (2), Intermediate (3), Advanced (4), Master (5). A visible padlock overlay is **Locked/Potential**, never Standard. For unlocked badges: Standard has no progression bars, Intermediate has 1 bar, Advanced 2 bars and Master 3 bars plus the Master frame. The official playstyle reference sheet is augmented with two real regression examples: Ariel Bravo = Winger/Locked and François Roelandt = False Nine/Intermediate.

## Special abilities
The scanner inspects the whole Special Ability row and may return zero, one, two, three or more abilities. All results still pass the existing review and numerical validation path before save.
