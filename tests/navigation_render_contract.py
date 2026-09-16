from pathlib import Path
import re, sys
ROOT=Path(__file__).resolve().parents[1]
app=(ROOT/'js/app.js').read_text(encoding='utf-8')
html=(ROOT/'index.html').read_text(encoding='utf-8')
errs=[]
if 'updateDrawerActive(' in app:
    errs.append('stale updateDrawerActive call remains; it aborts applyPage before page render')
# applyPage must reach each destination renderer after selecting the page.
m=re.search(r'async function applyPage\(.*?\{(.*?)\n\s*\}', app, re.S)
if not m:
    errs.append('applyPage not found')
else:
    body=m.group(1)
    for fn in ('renderDashboard','renderSquad','renderPlayerProfile','renderTrainingPicker','renderMyDrills','renderTeamPlan'):
        if fn not in body:
            errs.append(f'applyPage no longer routes to {fn}')
if "--hero:url('assets/scenes/" in html:
    errs.append('hero custom-property URLs still resolve incorrectly under css/assets on GitHub Pages')
if "--hero:url('./assets/scenes/" not in html:
    errs.append('subdirectory-safe hero scene URLs missing')
if errs:
    print('FAIL')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS navigation/render regression contract')
