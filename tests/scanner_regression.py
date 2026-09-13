from pathlib import Path
import json, hashlib
ROOT=Path(__file__).resolve().parents[1]
scanner=(ROOT/'js/scanner-engine.js').read_text()
errs=[]
required=[
 'const VERSION=8', 'gemini-3.1-flash-live-preview', "thinkingLevel:'HIGH'",
 'BidiGenerateContent', 'submit_core_scan', 'submit_playstyle_identity',
 'submit_playstyle_level', 'submit_playstyle_overlay', 'submit_playstyle_pair', 'submit_ability_slot_scan',
 'reference-manifest.json', 'buildPlaystyleIdentityReference', 'exactPlaystyleStateMedia', 'buildPlaystyleLevelEvidence', 'locateBadgeComponent', 'buildAbilityReference',
 'Standard = RIGHT pale, BOTTOM pale, LEFT pale = 000', 'Intermediate = RIGHT dark, BOTTOM pale, LEFT pale = 100', 'Advanced = RIGHT dark, BOTTOM dark, LEFT pale = 110', 'Master = RIGHT dark, BOTTOM dark, LEFT dark = 111', 'rightSegmentDark', 'bottomSegmentDark', 'leftSegmentDark', '100 = 1 dark segment', 'EXACT COLOURED SPECIAL ABILITY REFERENCES',
 'gold SA references disabled' if False else 'gold/boosted reference path',
 'normaliseFrameMedia', 'SOURCE SCREENSHOT DIMENSIONS (measured by app code)',
 'detectLayoutHint', 'GOALKEEPER core', 'specialAbilityTraining', 'Shadow Striker', 'darkFraction>.25'
]
for x in required:
    if x not in scanner: errs.append('missing scanner v8 contract: '+x)
for forbidden in [
 'gemini-3.6-flash','gemini-3.8-flash',':generateContent','scanner-templates',
 'playstyles-index-final.png','playstyle-levels-index-final.png',
 'special-abilities-standard-index-final.png','special-abilities-boosted-index-final.png',
 'abilitiesBoosted','abilitiesStandard','submit_playstyle_level_segments','buildLevelFamilyReference','buildLevelRingOnlyEvidence'
]:
    if forbidden in scanner: errs.append('forbidden superseded scanner component: '+forbidden)
manifest_path=ROOT/'assets/scanner/reference-manifest.json'
if not manifest_path.is_file():
    errs.append('missing exact scanner reference manifest')
else:
    m=json.loads(manifest_path.read_text())
    expected={'playstyles':20,'statesPerPlaystyle':13,'playstyleImages':260,'specialAbilityImages':19,'totalReferenceImages':279}
    if m.get('counts')!=expected: errs.append(f'reference manifest counts mismatch: {m.get("counts")}')
    seen=[]
    for ps in m.get('playstyles',[]):
        for state,info in ps.get('states',{}).items(): seen.append((f'{ps.get("name")}/{state}',info))
    for ab in m.get('specialAbilities',[]): seen.append((ab.get('name'),ab))
    if len(seen)!=279: errs.append(f'manifest has {len(seen)} reference entries, expected 279')
    for label,info in seen:
        p=ROOT/info['path']
        if not p.is_file() or p.stat().st_size==0: errs.append('missing/empty exact reference: '+label)
        elif hashlib.sha256(p.read_bytes()).hexdigest()!=info.get('sha256'): errs.append('hash mismatch exact reference: '+label)
if (ROOT/'assets/playstyles').exists(): errs.append('legacy assets/playstyles directory survived')
if (ROOT/'assets/abilities').exists(): errs.append('legacy assets/abilities directory survived')
for player in ['David Andrews','François Roelandt','Ariel Bravo','Richard Kilroy','Gosling Lataille','Remus Iacob','Paul Brace','Victor Aslan']:
    if player in scanner: errs.append('benchmark player leaked into production scanner: '+player)
if errs:
    print('FAIL Scanner v8 exact-reference contract')
    [print(' -',e) for e in errs]
    raise SystemExit(1)
print('PASS Scanner v8 exact-reference contract: isolated badge + explicit ring-segment level pass + separate overlays + 19 coloured SA refs')
