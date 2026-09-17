from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'css/v060.css').read_text(encoding='utf-8')
js=(ROOT/'js/app.js').read_text(encoding='utf-8')
errs=[]
for needle in [
    'v062-squad-hero','squadStatTotal','squadStatAvg','squadStatHigh','squadStatBalance','squadStatNeeds',
    'squadSearch','squadPlaystyleFilter','squadAbilityFilter','squadOvrMin','squadOvrMax','squadIssuesOnly',
    'squadSort','squadVisibleCount','squadList','squad-hero-desktop.webp','squad-hero-mobile.webp'
]:
    if needle not in html: errs.append(f'missing Squad production hook: {needle}')
for needle in [
    'v0.6.14 — Squad design fidelity pass',
    '.v062-squad-hero{height:276px',
    '.squad-stat-grid{gap:9px',
    '.squad-workspace{grid-template-columns:238px minmax(0,1fr)',
    '.squad-cell-pos .pos-st{background:#ff5b57',
    '@media (orientation:portrait) and (max-width:699px) and (pointer:coarse)',
    '.squad-filter-panel{display:grid!important;grid-template-columns:1fr 1fr!important',
    '@media (orientation:landscape) and (pointer:coarse) and (max-height:600px)'
]:
    if needle not in css: errs.append(f'missing Pass 14 Squad fidelity marker: {needle}')
if 'class="pos-tag pos-${esc(String(role).toLowerCase())}"' not in js:
    errs.append('Squad roster does not emit role-coded position chips')
ref=ROOT/'docs/design/reference/v060/approved-squad-desktop-v2.webp'
if not ref.is_file() or ref.stat().st_size < 10000:
    errs.append('approved Squad v2 visual reference missing')
if errs:
    print('FAIL v0.6.14 Squad fidelity contract')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS v0.6.14 Squad fidelity contract: approved dense hero/stats/filter/roster composition and touch reflows present')
