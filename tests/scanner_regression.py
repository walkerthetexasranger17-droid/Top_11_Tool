from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
scanner=(ROOT/'js/scanner-engine.js').read_text()
errs=[]
for required in ['gemini-3.6-flash','core player data','DO NOT analyse, identify, locate or return playstyles','DO NOT analyse, identify, locate or return special abilities','while(true)','REQUEST_RETRY_DELAYS_MS=[0,2000,4000,8000,12000,15000]']:
    if required not in scanner: errs.append('missing scanner contract: '+required)
for forbidden in ['gemini-3.8-flash','hogDescriptor','levelDescriptor','localVisualMatch','specialAbilityIcons','playstyleBadge','scanner-templates']:
    if forbidden in scanner: errs.append('forbidden old scanner component present: '+forbidden)
if (ROOT/'assets/scanner/reference-manifest.json').exists() or (ROOT/'assets/scanner/references').exists(): errs.append('obsolete scanner visual reference assets still packaged')
if errs:
    print('FAIL Scanner v3 simplified contract')
    [print(' -',e) for e in errs]
    raise SystemExit(1)
print('PASS Scanner v3 simplified contract: Gemini 3.6 core data only + manual playstyle/abilities + automatic retry')
