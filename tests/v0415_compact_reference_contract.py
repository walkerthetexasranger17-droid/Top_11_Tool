from pathlib import Path
import json,hashlib,sys
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
scanner=(ROOT/'js/scanner-engine.js').read_text()
errs=[]
cm_path=ROOT/'assets/scanner/compact-reference-manifest.json'
if not cm_path.exists(): errs.append('compact manifest missing')
else:
 cm=json.loads(cm_path.read_text())
 if cm.get('counts')!={'playstyles':20,'levelsPerPlaystyle':5,'playstyleImages':100,'overlayImages':6,'totalImages':106}:errs.append('compact counts wrong')
 if cm.get('renderer')!='compact / PlaystyleSmallAtlas':errs.append('compact renderer provenance wrong')
 for ps in cm.get('playstyles',[]):
  for level in ['Locked','Standard','Intermediate','Advanced','Master']:
   info=ps.get('states',{}).get(level);p=ROOT/(info or {}).get('path','')
   if not info or not p.is_file():errs.append(f'missing compact {ps.get("name")}/{level}');continue
   if hashlib.sha256(p.read_bytes()).hexdigest()!=info.get('sha256'):errs.append(f'hash mismatch compact {ps.get("name")}/{level}')
   if Image.open(p).size!=(50,56):errs.append(f'compact logical size mismatch {ps.get("name")}/{level}: {Image.open(p).size}')
 for name,info in cm.get('overlays',{}).items():
  p=ROOT/info['path']
  if not p.is_file() or hashlib.sha256(p.read_bytes()).hexdigest()!=info['sha256']:errs.append('bad compact overlay '+name)
# Approved HQ/SA pack must still match its existing manifest hashes.
hq=json.loads((ROOT/'assets/scanner/reference-manifest.json').read_text())
for ps in hq.get('playstyles',[]):
 for state,info in ps.get('states',{}).items():
  p=ROOT/info['path']
  if hashlib.sha256(p.read_bytes()).hexdigest()!=info['sha256']:errs.append(f'HQ changed {ps["name"]}/{state}')
for ab in hq.get('specialAbilities',[]):
 p=ROOT/ab['path']
 if hashlib.sha256(p.read_bytes()).hexdigest()!=ab['sha256']:errs.append('SA changed '+ab['name'])
for needle in ['const VERSION=9','COMPACT_REFERENCE_MANIFEST_URL','PlaystyleSmallAtlas','compactPlaystyleStateMedia','submit_playstyle_level_confirmation','playstyleLevelConfirmationPrompt','submit_playstyle_level_tiebreak','READY-ARROW ZONE MASKED','IMPORTANT FOR YELLOW/MIDFIELD BADGES','indicator_levelup','compact-playstylesmallatlas-double-confirm-v9']:
 if needle not in scanner:errs.append('missing scanner v9 hook '+needle)
for player in ['Kilroy','Sergey','Luiu','Andrews','Aslan','Remus','Stanek','James Hughes','Paul Brace','Stefano Luiu','Jiri Stanek']:
 if player in scanner:errs.append('benchmark player leaked into scanner: '+player)
if errs:
 print('FAIL v0.4.15 compact reference contract');[print(' -',e) for e in errs];sys.exit(1)
print('PASS v0.4.15 compact reference contract: 100 compact level refs + 6 overlays + double confirmation + unchanged HQ/SA assets')
