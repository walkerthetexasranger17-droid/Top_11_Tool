from pathlib import Path
from PIL import Image
import json,sys
ROOT=Path(__file__).resolve().parents[1]
errs=[]
expected=json.loads((ROOT/'tests/scanner_v3_expected.json').read_text())
fixture=ROOT/'tests/scanner-fixtures'/expected['fixture']
if not fixture.is_file(): errs.append('David Andrews multi-SA regression fixture missing')
else:
    im=Image.open(fixture)
    if im.width<1000 or im.height<500: errs.append(f'unexpected regression fixture size: {im.size}')
refs=[ROOT/'assets/scanner/playstyles-reference.png',ROOT/'assets/scanner/special-abilities-reference.jpg']
for p in refs:
    if not p.is_file() or p.stat().st_size<10000: errs.append(f'missing/empty AI reference: {p.relative_to(ROOT)}')
scanner=(ROOT/'js/scanner-engine.js').read_text()
if 'const VERSION=3' not in scanner: errs.append('Scanner v3 client marker missing')
if "const MODELS=['gemini-3.8-flash','gemini-3.7-flash']" not in scanner: errs.append('Gemini 3.8 -> 3.7 fallback chain marker missing')
if 'scanner-templates' in scanner or (ROOT/'js/scanner-templates.json').exists(): errs.append('legacy Scanner v2 templates still in production path')
if 'generativelanguage.googleapis.com' not in scanner: errs.append('direct Gemini Developer API endpoint missing')
if 'ZERO, ONE, TWO, THREE OR MORE abilities' not in scanner: errs.append('multi-special-ability prompt contract missing')
if 'NEVER stop after the first icon' not in scanner: errs.append('scan prompt does not explicitly prohibit first-icon-only behavior')
if 'No paid fallback was used' not in scanner: errs.append('free-tier exhaustion contract missing')
if (ROOT/'cloud-scanner').exists(): errs.append('old billed Cloud Run scanner folder still packaged')
if len(expected['expected']['skills'])!=15: errs.append('David fixture must define all 15 outfield skills')
if len(expected['expected']['specialAbilities'])<2: errs.append('David fixture must exercise multiple special abilities')
ps=Image.open(refs[0]) if refs[0].exists() else None
sa=Image.open(refs[1]) if refs[1].exists() else None
if ps and ps.width<1200: errs.append('playstyle reference unexpectedly small')
if sa and sa.width<1200: errs.append('special-ability reference unexpectedly small')
if errs:
    print('FAIL Scanner v3 offline contract regression')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS Scanner v3 offline contract: Gemini 3.8 primary + 3.7 transient fallback, direct free-tier path, 20 playstyles x 4 levels, 19 special abilities, David Andrews multi-SA fixture (15 skills + 2 abilities)')
