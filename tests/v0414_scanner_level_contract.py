from pathlib import Path
import json, re, sys, hashlib
ROOT=Path(__file__).resolve().parents[1]
scanner=(ROOT/'js/scanner-engine.js').read_text(encoding='utf-8')
errs=[]
for needle,label in [
    ('const VERSION=12','scanner v12 marker'),
    ('locateBadgeComponent','tight badge locator'),
    ('CURRENT COMPACT BADGE · RAW','raw compact badge evidence'),
    ('CURRENT COMPACT BADGE · SMOOTH','smooth compact badge evidence'),
    ('rightSegmentPresent','right segment boolean'),
    ('bottomSegmentPresent','bottom segment boolean'),
    ('leftSegmentPresent','left segment boolean'),
    ('PlaystyleSmallAtlas','compact renderer source'),
    ('submit_playstyle_level_confirmation','mandatory second level confirmation'),
    ('READY-ARROW ZONE MASKED','ready-arrow masking'),
    ('IMPORTANT FOR YELLOW/MIDFIELD BADGES','yellow level disambiguation'),
    ('levelFromSegmentFlags','app-side segment-pattern resolver'),
    ('submit_playstyle_overlay','separate overlay pass'),
    ('defenderIdentityConfirmationPrompt','Ball Playing DC / No-Nonsense DC confirmer'),
]:
    if needle not in scanner: errs.append(f'missing {label}')
for forbidden in ['submit_playstyle_state','buildPlaystyleStateReference','playstyleStatePrompt(']:
    if forbidden in scanner: errs.append('old 13-state classification path survived: '+forbidden)
# Reference image files must remain byte-identical to manifest; v0.4.18 keeps the approved visual pack unchanged for playstyle accuracy.
m=json.loads((ROOT/'assets/scanner/reference-manifest.json').read_text())
if m.get('counts')!={'playstyles':20,'statesPerPlaystyle':13,'playstyleImages':260,'specialAbilityImages':19,'totalReferenceImages':279}:
    errs.append('reference counts changed')
for ps in m.get('playstyles',[]):
    for state,info in ps.get('states',{}).items():
        p=ROOT/info['path']
        if hashlib.sha256(p.read_bytes()).hexdigest()!=info['sha256']: errs.append(f'reference changed: {ps["name"]}/{state}')
for ab in m.get('specialAbilities',[]):
    p=ROOT/ab['path']
    if hashlib.sha256(p.read_bytes()).hexdigest()!=ab['sha256']: errs.append(f'SA reference changed: {ab["name"]}')
# Never bake user benchmark answers into production scanner logic.
for player in ['Kilroy','Sergey','Luiu','Andrews','Aslan','Remus','Stanek','Richard Kilroy','David Andrews','Victor Aslan']:
    if player in scanner: errs.append('benchmark identity leaked into production scanner: '+player)
if errs:
    print('FAIL v0.4.18 scanner level contract')
    for e in errs: print(' -',e)
    sys.exit(1)
print('PASS v0.4.18 scanner level contract: compact renderer + double-confirm + unchanged HQ assets')
