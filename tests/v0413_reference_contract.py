from pathlib import Path
import json, hashlib, re, sys
ROOT=Path(__file__).resolve().parents[1]
errs=[]
manifest=json.loads((ROOT/'assets/scanner/reference-manifest.json').read_text())
if manifest.get('counts',{}).get('totalReferenceImages')!=279: errs.append('reference manifest total must be 279')
if len(manifest.get('playstyles',[]))!=20: errs.append('must have 20 exact playstyles')
if any(len(ps.get('states',{}))!=13 for ps in manifest.get('playstyles',[])): errs.append('every playstyle must have 13 exact states')
if len(manifest.get('specialAbilities',[]))!=19: errs.append('must have 19 coloured Special Ability references')
for ps in manifest.get('playstyles',[]):
    for state,info in ps['states'].items():
        p=ROOT/info['path']
        if not p.exists(): errs.append(f'missing {ps["name"]}/{state}')
        elif hashlib.sha256(p.read_bytes()).hexdigest()!=info['sha256']: errs.append(f'hash mismatch {ps["name"]}/{state}')
for ab in manifest.get('specialAbilities',[]):
    p=ROOT/ab['path']
    if not p.exists(): errs.append(f'missing SA {ab["name"]}')
    elif hashlib.sha256(p.read_bytes()).hexdigest()!=ab['sha256']: errs.append(f'hash mismatch SA {ab["name"]}')
scanner=(ROOT/'js/scanner-engine.js').read_text()
app=(ROOT/'js/app.js').read_text()
html=(ROOT/'index.html').read_text()
for old in ['playstyles-index-final.png','playstyle-levels-index-final.png','special-abilities-standard-index-final.png','special-abilities-boosted-index-final.png','assets/playstyles/','assets/abilities/']:
    if old in scanner+app+html: errs.append('legacy visual path survived: '+old)
if 'gold/boosted reference path' not in scanner or 'There is intentionally NO gold/boosted reference path' not in scanner: errs.append('coloured-only SA policy missing from AI command')
if 'Standard=0 category-coloured ring segments' not in scanner: errs.append('Standard compact level command missing')
if "B.PLAYSTYLE_LEVELS.filter(x=>x.id>=1);" not in app: errs.append('Standard is still excluded from manual playstyle tier chooser')
if 'submit_playstyle_level' not in scanner or 'submit_playstyle_overlay' not in scanner: errs.append('exact same-emblem level/overlay passes missing')
if errs:
    print('FAIL v0.4.13 reference contract')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS v0.4.13 reference contract')
