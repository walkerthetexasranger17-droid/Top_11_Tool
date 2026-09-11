# Scanner v3 — Gemini Free Tier (v5.2.16)

Scanner v3 sends each Top Eleven Skills screenshot directly from the browser to the Gemini Developer API. v5.2.16 deliberately uses **Gemini 3.8 Flash only**. There is no model fallback to 3.5/3.6/3.7 and no paid fallback.

## Retry policy
Temporary overload, service-unavailable, network and rate-limit responses keep the queue item in an automatic retry state. Retries use provider `Retry-After`/RetryInfo when supplied, otherwise 10s → 20s → 45s → 90s → 120s and then remain capped at roughly 120s between attempts. Retryable items continue until successful or until the user removes them from the queue. Daily free-tier quota exhaustion is retained for delayed retry with a minimum 15-minute wait. Authentication errors, invalid images, malformed requests and invalid scanner responses are hard failures rather than infinite retries.

## Exact reference architecture
The production scanner loads `assets/scanner/reference-manifest.json` and sends three separately labelled visual libraries:

- **20 playstyle identity images** from the finished user-supplied asset pack.
- **4 playstyle-level images**: Locked, Intermediate, Advanced and Master.
- **19 individual Special Ability images**.

The 20 identity PNGs and four level PNGs are copied unchanged from the supplied asset pack. The old 80 generated identity+tier combinations and old playstyle example workarounds are not packaged.

## Playstyle classification
Playstyle recognition is deliberately split into two decisions:

1. **Identity** — compare the centre playstyle symbol against the 20 identity images. Ignore progression frame state while choosing identity.
2. **Level** — compare only the surrounding frame, active red segments and padlock against the four False Nine level references. Ignore the centre False Nine symbol.

The scanner visual level contract is **Locked / Intermediate / Advanced / Master**. A visible padlock means Locked. Intermediate has one active red outer segment, Advanced has two and Master has all three.

## Special abilities
The scanner inspects the entire Special Ability row and may return zero, one, two, three or more abilities. Results still pass the existing review and numerical validation path before save.
