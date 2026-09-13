from pathlib import Path
import sys,re
ROOT=Path(__file__).resolve().parents[1]
s=(ROOT/'js/scanner-engine.js').read_text()
errs=[]
needles=[
 'const VERSION=12',
 'buildContextMatchedCompactReference',
 'compactLevelPixelCompare',
 "variation>12",
 "ratio>=1.25",
 "margin>=.18",
 "rightSegmentPresent",
 "bottomSegmentPresent",
 "leftSegmentPresent",
 "pixelLevel?.confident",
 "exact-pixel comparator overrode",
 "all-fields-native-resolution-v12",
 "dw*.20",
 "dw*.60",
]
for n in needles:
 if n not in s: errs.append('missing '+n)
for forbidden in ['Stefano Luiu','James Hughes','Kilroy','Stanek','Brace','Iacob']:
 if forbidden.lower() in s.lower(): errs.append('benchmark/player name leaked into scanner: '+forbidden)
if errs:
 print('FAIL v0.4.18 pixel level guard contract'); [print(' -',e) for e in errs]; sys.exit(1)
print('PASS v0.4.18 pixel level guard contract: context-matched references + deterministic high-confidence guard + no benchmark names')
