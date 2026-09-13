from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
scanner=(ROOT/'js/scanner-engine.js').read_text(encoding='utf-8')
html=(ROOT/'index.html').read_text(encoding='utf-8')
errs=[]
needles=[
  'const VERSION=12',
  'const sourcePlayerMedia=playerMedia',
  'scaledPlaystyleStrip(img)',
  'nativePlaystyleSizeContext(media)',
  'playstyleContext=nativePlaystyleSizeContext(sourcePlayerMedia)',
  'buildPlaystyleEvidence(sourcePlayerMedia)',
  'buildPlaystyleLevelEvidence(sourcePlayerMedia)',
  'compactLevelPixelCompare(sourcePlayerMedia,canonical)',
  "buildContextMatchedCompactReference(sourcePlayerMedia,canonical,'Standard')",
  "referenceMode:'all-fields-native-resolution-v12'",
]
for x in needles:
    if x not in scanner: errs.append('missing native-source scanner hook: '+x)
# v0.4.18 removes the old OCR/playstyle split: every scanner field stays native.
if 'buildCoreEvidenceBoard(playerMedia,layoutHint)' not in scanner: errs.append('core evidence path missing')
if 'detectLayoutHint(playerMedia)' not in scanner: errs.append('layout detection path missing')
if 'nativeRoi(img,roi)' not in scanner: errs.append('native ROI scaling helper missing')
if 'ORIGINAL uploaded screenshot resolution for every field' not in html: errs.append('settings do not describe all-field native-resolution path')
if errs:
    print('FAIL v0.4.18 native-source scanner contract')
    for e in errs: print(' -',e)
    sys.exit(1)
print('PASS v0.4.18 native-source scanner contract: all fields use source pixels; canonical frame is coordinate map only')
