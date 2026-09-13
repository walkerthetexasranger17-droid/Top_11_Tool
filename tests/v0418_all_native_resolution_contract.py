from pathlib import Path
import re,sys
ROOT=Path(__file__).resolve().parents[1]
s=(ROOT/'js/scanner-engine.js').read_text()
errs=[]
needles=[
 'const VERSION=12',
 'function nativeRoi(img,roi)',
 'const playerMedia=await normaliseFrameMedia(rawPlayerMedia)',
 "scannerScope:'full-player-native-resolution-v12'",
 "referenceMode:'all-fields-native-resolution-v12'",
 'result.raw.wasNormalised=false',
 'ALL fields',
]
for x in needles:
    if x not in s: errs.append('missing native-resolution v12 hook: '+x)
# No whole-frame draw into canonical 1536x695 is allowed.
for pattern,label in [
    (r'drawImage\(img\s*,\s*0\s*,\s*0\s*,\s*BASE_W\s*,\s*BASE_H\s*\)', 'whole-frame baseline resize'),
    (r'c\.width\s*=\s*BASE_W\s*;\s*c\.height\s*=\s*BASE_H', 'baseline resize canvas'),
    (r'normalisedWidth\s*:\s*BASE_W', 'normalised media metadata'),
]:
    if re.search(pattern,s): errs.append('forbidden '+label)
# Direct fixed-coordinate crops for the core/SA paths would break native scaling.
if 'r=ROI.roles,c=document.createElement' in s: errs.append('roles crop still uses unscaled canonical ROI')
if 'const r=ROI.abilitySlots[i]' in s: errs.append('ability occupancy still uses unscaled canonical ROI')
if 'roi=ROI.abilitySlots[slotIndex]' in s: errs.append('ability evidence still uses unscaled canonical ROI')
if '1536' in s or '695' in s: errs.append('legacy 1536x695 runtime baseline survived')
if 'const BASE_W=2688,BASE_H=1216' not in s: errs.append('native 2688x1216 baseline missing')
if errs:
    print('FAIL v0.4.18 all-native-resolution contract')
    [print(' -',e) for e in errs]
    sys.exit(1)
print('PASS v0.4.18 all-native-resolution contract: screenshot never resized; every ROI scales to source pixels')
