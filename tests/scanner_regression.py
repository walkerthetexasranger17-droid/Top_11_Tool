from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
scanner=(ROOT/'js/scanner-engine.js').read_text()
errs=[]
required=[
 'const VERSION=6', 'gemini-3.1-flash-live-preview', "thinkingLevel:'HIGH'",
 'BidiGenerateContent', 'submit_core_scan', 'submit_playstyle_identity',
 'submit_playstyle_level_segments', 'submit_ability_slot_scan',
 'playstyles-index-final.png', 'playstyle-levels-index-final.png',
 'special-abilities-standard-index-final.png', 'special-abilities-boosted-index-final.png',
 'Free Kick Specialist / Defensive Wall', 'Corner Specialist / Dribbler',
 'normaliseFrameMedia', 'sourceWidth,sourceHeight', 'SOURCE SCREENSHOT DIMENSIONS (measured by app code)',
 'detectLayoutHint', 'GOALKEEPER core', 'specialAbilityTraining', 'Shadow Striker', 'darkFraction>.25',
 'locatePlaystyleBadgeInStrip'
]
for x in required:
    if x not in scanner: errs.append('missing scanner contract: '+x)
for forbidden in ['gemini-3.6-flash', 'gemini-3.8-flash', ':generateContent', 'scanner-templates']:
    if forbidden in scanner: errs.append('forbidden superseded scanner component: '+forbidden)
for rel in ['playstyles-index-final.png','playstyle-levels-index-final.png','special-abilities-standard-index-final.png','special-abilities-boosted-index-final.png']:
    p=ROOT/'assets/scanner'/rel
    if not p.is_file() or p.stat().st_size==0: errs.append('missing/empty scanner reference: '+rel)
for player in ['David Andrews','François Roelandt','Ariel Bravo','Richard Kilroy','Gosling Lataille','Remus Iacob','Paul Brace','Victor Aslan']:
    if player in scanner: errs.append('benchmark player leaked into production scanner: '+player)
if errs:
    print('FAIL Scanner v6 Live contract')
    [print(' -',e) for e in errs]
    raise SystemExit(1)
print('PASS Scanner v6 Live contract: HIGH-thinking Live pipeline + four visual indexes + no benchmark answers')
