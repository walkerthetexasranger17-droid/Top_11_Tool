from pathlib import Path
from PIL import Image
import json,sys
ROOT=Path(__file__).resolve().parents[1]
errs=[]
expected=json.loads((ROOT/'tests/scanner_v3_expected.json').read_text())
fixture=ROOT/'tests/scanner-fixtures'/expected['fixture']
if not fixture.is_file(): errs.append('David Andrews regression fixture missing')
else:
    im=Image.open(fixture)
    if im.width<1000 or im.height<500: errs.append(f'unexpected regression fixture size: {im.size}')
manifest_path=ROOT/'assets/scanner/reference-manifest.json'
if not manifest_path.is_file(): errs.append('reference manifest missing')
else:
    manifest=json.loads(manifest_path.read_text())
    if len(manifest.get('playstyles',[]))!=20: errs.append('expected 20 exact playstyle identity references')
    if len(manifest.get('playstyleLevels',[]))!=4: errs.append('expected 4 exact playstyle-level references')
    if [x.get('name') for x in manifest.get('playstyleLevels',[])]!=['Locked','Intermediate','Advanced','Master']: errs.append('playstyle levels must be Locked/Intermediate/Advanced/Master only')
    if len(manifest.get('specialAbilities',[]))!=19: errs.append('expected 19 special-ability references')
    for row in manifest.get('playstyles',[])+manifest.get('playstyleLevels',[])+manifest.get('specialAbilities',[]):
        p=ROOT/row['file'].lstrip('./')
        if not p.is_file() or p.stat().st_size<100: errs.append(f'missing/empty reference: {row.get("file")}')
scanner=(ROOT/'js/scanner-engine.js').read_text()
required=[
    'const VERSION=3',
    "const DOCUMENTED_MODELS=['gemini-3.8-flash']",
    'const REQUEST_TIMEOUT_MS=20000',
    'const REQUEST_RETRY_DELAYS_MS=[0,3000,8000]',
    'There are NO reference images in this request',
    'playstyleBadge', 'specialAbilityIcons', 'localVisualMatch', 'hogDescriptor', 'levelDescriptor',
    "const parts=[{text:buildPrompt()},screenshot]",
]
for needle in required:
    if needle not in scanner: errs.append(f'missing v5.2.17 scanner contract: {needle}')
for forbidden in ['gemini-3.5-flash','gemini-3.6-flash','gemini-3.7-flash','gemini-3.4-flash','scanner-templates']:
    if forbidden in scanner: errs.append(f'forbidden legacy/fallback component present: {forbidden}')
if (ROOT/'js/scanner-templates.json').exists(): errs.append('legacy Scanner v2 templates still packaged')
if (ROOT/'cloud-scanner').exists(): errs.append('old billed Cloud Run scanner folder still packaged')
if len(expected['expected']['skills'])!=15: errs.append('David fixture must define all 15 outfield skills')
if expected['expected'].get('playstyle') is not None: errs.append('David Skills screenshot has no visible playstyle badge; expected playstyle must be null')
if len(expected['expected']['specialAbilities'])<2: errs.append('David fixture must exercise multiple special abilities')
state_expected=json.loads((ROOT/'tests/playstyle_state_expected.json').read_text())
for row in state_expected['fixtures']:
    fp=ROOT/'tests/scanner-fixtures'/row['fixture']
    if not fp.is_file(): errs.append(f"playstyle state fixture missing: {row['fixture']}")
if "const LEVELS=['Locked','Intermediate','Advanced','Master']" not in scanner: errs.append('scanner level contract is not exactly Locked/Intermediate/Advanced/Master')
if errs:
    print('FAIL Scanner v3 offline contract regression')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS Scanner v3 offline contract: screenshot-only Gemini 3.8 + bounded retry + local matching against 20/4/19 final assets')
