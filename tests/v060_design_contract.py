from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'css/v060.css').read_text(encoding='utf-8')
js=(ROOT/'js/app.js').read_text(encoding='utf-8')
errs=[]
for needle in ['css/v060.css?r=0601','dashboardRecentPlayers','dashboardTrainingStats','dashboardPlanSnapshot','dashboardInsight','dashboardUpdatePlayers','v060-home-hero']:
    if needle not in html: errs.append(f'missing v0.6 Home hook: {needle}')
for needle in ['@media (min-width:1024px)','@media (min-width:700px) and (max-width:1023px)','@media (max-width:699px)','--v6-sidebar:214px','.dashboard-workspace','.auth-gate::before']:
    if needle not in css: errs.append(f'missing responsive/design marker: {needle}')
for needle in ['await DP.ensure()','await TP.load()','dashboardUpdatePlayers']:
    if needle not in js: errs.append(f'missing dashboard real-data/action hook: {needle}')
refs=ROOT/'docs/design/reference/v060'
for name in ['approved-home-desktop.webp','approved-home-mobile.webp','approved-login-landing-desktop.webp','approved-squad-desktop.webp','approved-player-profile-desktop.webp','approved-team-plan-desktop.webp']:
    p=refs/name
    if not p.is_file() or p.stat().st_size<1000: errs.append(f'missing approved reference: {name}')
if errs:
    print('FAIL v0.6.1 design contract')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS v0.6.1 design contract: responsive shell, Home/auth hooks and approved references packaged')
