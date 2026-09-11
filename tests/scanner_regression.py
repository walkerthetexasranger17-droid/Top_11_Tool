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
manifest_path=ROOT/'assets/scanner/reference-manifest.json'
if not manifest_path.is_file(): errs.append('individual reference manifest missing')
else:
    manifest=json.loads(manifest_path.read_text())
    if len(manifest.get('playstyles',[]))!=20: errs.append('expected 20 individually labelled playstyle identity references')
    if len(manifest.get('playstyleLevels',[]))!=4: errs.append('expected 4 individually labelled playstyle-level references')
    if [x.get('name') for x in manifest.get('playstyleLevels',[])]!=['Locked','Intermediate','Advanced','Master']: errs.append('playstyle-level references must be Locked/Intermediate/Advanced/Master only')
    if len(manifest.get('specialAbilities',[]))!=19: errs.append('expected 19 individually labelled special-ability references')
    for row in manifest.get('playstyles',[])+manifest.get('playstyleLevels',[])+manifest.get('specialAbilities',[]):
        p=ROOT/row['file'].lstrip('./')
        if not p.is_file() or p.stat().st_size<200: errs.append(f'missing/empty individual AI reference: {row.get("file")}')
scanner=(ROOT/'js/scanner-engine.js').read_text()
if 'const VERSION=3' not in scanner: errs.append('Scanner v3 client marker missing')
if "const DOCUMENTED_MODELS=['gemini-3.8-flash']" not in scanner: errs.append('scanner must use Gemini 3.8 Flash only')
for forbidden in ['gemini-3.5-flash','gemini-3.6-flash','gemini-3.7-flash','gemini-3.4-flash']:
    if forbidden in scanner: errs.append(f'forbidden fallback model present: {forbidden}')
if 'scanner-templates' in scanner or (ROOT/'js/scanner-templates.json').exists(): errs.append('legacy Scanner v2 templates still in production path')
if 'generativelanguage.googleapis.com' not in scanner: errs.append('direct Gemini Developer API endpoint missing')
if 'ZERO, ONE, TWO, THREE OR MORE abilities' not in scanner: errs.append('multi-special-ability prompt contract missing')
if 'NEVER stop after the first icon' not in scanner: errs.append('scan prompt does not explicitly prohibit first-icon-only behavior')
if 'No paid fallback was used' not in scanner: errs.append('free-tier exhaustion contract missing')
if (ROOT/'cloud-scanner').exists(): errs.append('old billed Cloud Run scanner folder still packaged')
if len(expected['expected']['skills'])!=15: errs.append('David fixture must define all 15 outfield skills')
if len(expected['expected']['specialAbilities'])<2: errs.append('David fixture must exercise multiple special abilities')
state_expected=json.loads((ROOT/'tests/playstyle_state_expected.json').read_text())
for row in state_expected['fixtures']:
    fp=ROOT/'tests/scanner-fixtures'/row['fixture']
    if not fp.is_file(): errs.append(f"playstyle state fixture missing: {row['fixture']}")
if "const LEVELS=['Locked','Intermediate','Advanced','Master']" not in scanner: errs.append('scanner level contract is not exactly Locked/Intermediate/Advanced/Master')
if 'A visible PADLOCK overlay means Locked/Potential' not in scanner: errs.append('locked/potential visual rule missing')
if 'Intermediate has one active red outer segment' not in scanner: errs.append('Intermediate one-segment visual rule missing')
if errs:
    print('FAIL Scanner v3 offline contract regression')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS Scanner v3 offline contract: Gemini 3.8-only repeat policy, 20 exact playstyle identity refs + 4 exact playstyle-level refs + 19 individually labelled special abilities, David Andrews multi-SA fixture')
