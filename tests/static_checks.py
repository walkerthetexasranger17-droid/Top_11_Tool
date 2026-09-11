from pathlib import Path
from bs4 import BeautifulSoup
import re,sys,json
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text()
js=(ROOT/'js/app.js').read_text()
players=(ROOT/'js/players.js').read_text()
scanner=(ROOT/'js/scanner-engine.js').read_text()
formation=(ROOT/'js/formation.js').read_text()
tactics=(ROOT/'js/tactics-engine.js').read_text()
team=(ROOT/'js/team-training-engine.js').read_text()
training=(ROOT/'js/training-engine.js').read_text()
soup=BeautifulSoup(html,'html.parser')
errs=[]
ids=[x.get('id') for x in soup.find_all(id=True)]
for x in sorted(set(ids)):
    if ids.count(x)>1: errs.append(f'duplicate id {x}')
pages={x.get('data-page') for x in soup.select('.page[data-page]')}
for el in soup.select('[data-go]'):
    target=el.get('data-go')
    if target not in pages: errs.append(f'bad data-go {target}')
refs=set(re.findall(r"\$\(['\"]#([A-Za-z0-9_-]+)['\"]\)",js))
missing=sorted(refs-set(ids))
if missing: errs.append('missing DOM ids: '+', '.join(missing))

# Bible information architecture / required screens and controls.
nav=[x.get_text(' ',strip=True) for x in soup.select('.bottom-nav .nav-btn')]
if nav!=['Home','Squad','Team Plan','Training','More']: errs.append(f'bottom nav does not match Bible: {nav}')
for rid in ['squadRoleFilter','squadPlaystyleFilter','squadAvailabilityFilter','squadAgeMin','squadAgeMax','squadOvrMin','squadOvrMax','formationXIList','formationPitch','tacticPlan','mentorAlternatives','profilePlaystyleState','profileRelatedPicker','scanRelatedPicker']:
    if rid not in ids: errs.append(f'missing Bible UI control: {rid}')
if 'formation' in pages or 'tactics' in pages: errs.append('legacy standalone Formation/Tactics page survives instead of Team Plan')
if not soup.select_one('[data-training-tab="individual"]') or not soup.select_one('[data-training-tab="team"]'): errs.append('Training does not expose Individual | Team tabs')

# Integrity hooks that protect recommendations from stale player/drill data.
hay=js+players+(ROOT/'js/drill-profile.js').read_text()
for needle,label in [
    ('sourceSnapshot:trainingSourceSnapshot', 'training source snapshot on build'),
    ('sameTrainingSource', 'training source snapshot comparison'),
    ("await S.del(`training:session:${outKey}`)", 'player edit session invalidation'),
    ('invalidateAllSessions', 'drill-library session invalidation'),
    ('mergeVisibleNaturalRoles', 'non-truncating visible role editor'),
    ('mergePlaystyleState', 'full playstyle-state preserving edit path'),
]:
    if needle not in hay: errs.append(f'missing integrity hook: {label}')

# Scanner v3: direct Gemini free-tier production path, no legacy digit-template repair engine.
for needle,label,src in [
    ("const VERSION=3", "Scanner v3 version marker", scanner),
    ("gemini-3.5-flash", "Gemini 3.5 Flash pool member", scanner),
    ("gemini-3.6-flash", "Gemini 3.6 Flash pool member", scanner),
    ("gemini-3.7-flash", "Gemini 3.7 Flash pool member", scanner),
    ("gemini-3.8-flash", "Gemini 3.8 Flash pool member", scanner),
    ("/models?pageSize=1000", "runtime Gemini model discovery", scanner),
    ("SCANNER_POOL_TEMPORARY", "temporary scanner-pool error classification", scanner),
    ("RETRYING AUTOMATICALLY", "automatic scanner retry status", js),
    ("MAX_AUTO_SCAN_ATTEMPTS=3", "bounded scanner auto retry", js),
    ("history.pushState", "browser/PWA navigation history", js),
    ("popstate", "Android/browser back handling", js),
    ("player-delete-action", "swipe-to-delete action", html+js),
    ("drawerNav", "left navigation drawer", html+js),
    ("QUEUE_DB_NAME", "refresh-safe queue image persistence", js),
    ("generativelanguage.googleapis.com", "direct Gemini Developer API", scanner),
    ("Gemini Scanner is not configured", "Gemini API-key requirement", scanner),
    ("ZERO, ONE, TWO, THREE OR MORE abilities", "multi-special-ability prompt", scanner),
    ("No paid fallback was used", "free-tier no-paid-fallback error", scanner),
    ("review.abilities||scan.specialAbilities||[]", "multi-special-ability AI import/review preservation", js),
    ("scanQueue", "multi-player scanner review queue", js),
    ("multiple hidden", "batch screenshot picker", html),
    ("scanPlaystyleLevel", "manual playstyle-tier editor", html),
    ("scanner:{version:3", "Scanner v3 provenance on save", js),
    ("save.disabled=false", "scanner mismatch does not dead-lock Save", js),
    ("data-scan-skill", "manual parsed-skill correction path", js),
]:
    if needle not in src: errs.append(f'missing scanner hook: {label}')
for forbidden in ['scanner-templates.json','reconcileReadToTarget','classifyGlyph','readNumber(ctx','cloudScannerEndpoint','Cloud Run Service URL']:
    if forbidden in scanner+js+html: errs.append(f'legacy Scanner v2/cloud production logic survives: {forbidden}')
if (ROOT/'js/scanner-templates.json').exists(): errs.append('legacy scanner-templates.json still packaged')
if (ROOT/'cloud-scanner').exists(): errs.append('old Cloud Run scanner folder still packaged')
if 'gemini-3.4-flash' in scanner: errs.append('unsupported Gemini 3.4 Flash was invented')
for ref in ['assets/scanner/playstyles-reference.png','assets/scanner/special-abilities-reference.jpg']:
    if not (ROOT/ref).is_file(): errs.append(f'missing scanner reference: {ref}')

# The historical data-package contract path must never contradict the canonical Bible.
legacy_contract=(ROOT/'data/build_30527/IMPLEMENTATION_CONTRACT.md').read_text()
if 'docs/TOP_ELEVEN_TOOL_BIBLE_BUILD_30527_v1.md' not in legacy_contract: errs.append('legacy implementation-contract path does not defer to canonical Bible')
for stale in ['target = max(current value among whiteAttributes)','Build six slots greedily','They still remain in the denominator']:
    if stale in legacy_contract: errs.append(f'stale superseded training rule survives compatibility contract: {stale}')

# Superseded models must not survive.
if re.search(r'positionFit|posBonus|OVR\s*\*\s*0?\.55|slotSkill\s*\*\s*0?\.35|ADJAC',formation,re.I): errs.append('old greedy/adjacency/OVR formation formula survives')
if 'BEAM_WIDTH=250' not in training: errs.append('Individual Training beam width 250 missing')
if 'BEAM_WIDTH=250' not in team: errs.append('Team Training beam width 250 missing')
if 'weakSet' not in training or 'effectiveNeed' not in training: errs.append('Individual Training top3/credit logic missing')
if 'prepared.valid' not in team or 'whiteSet' not in team: errs.append('Team Training does not visibly use actual per-player white sets')
if 'enumerate(values=>' not in tactics or 'mentality' not in tactics: errs.append('Tactics exhaustive fixed-mentality search missing')
if re.search(r'Shoot on Sight.*Mixed.*Both Flanks',tactics,re.I|re.S): errs.append('possible old hard-coded tactic preset survives')

# Current roles / abilities / playstyles are not silently truncated.
data=(ROOT/'js/data.js').read_text()
if 'slice(0,2)' in players or 'specialAbilities.slice(0,2)' in js: errs.append('hard two-special-ability cap survives')
if 'Shadow Striker' in data or 'Shadow Striker' in html: errs.append('stale Shadow Striker survives current UI/data')
if 'Ball Playing GK' not in data: errs.append('legacy Ball Playing GK preservation metadata unexpectedly missing')
if re.search(r"const ALL_POSITIONS=.*DML|const ALL_POSITIONS=.*DMR",data): errs.append('DML/DMR survive in current position list')

# Product/display name consistency.
manifest=json.loads((ROOT/'manifest.json').read_text())
if manifest.get('name')!='Top Eleven Tool' or manifest.get('short_name')!='Top Eleven Tool': errs.append('manifest app name is not Top Eleven Tool')
if not soup.title or soup.title.get_text(strip=True)!='Top Eleven Tool': errs.append('page title is not Top Eleven Tool')
if 'TOP ELEVEN <span>TOOL</span>' not in html: errs.append('in-app header branding is not Top Eleven Tool')
if 'v5.2.13' not in html: errs.append('visible build label is not v5.2.13')
bible_data=(ROOT/'js/bible-data.js').read_text(encoding='utf-8')
if "tackling:[['balanced','Balanced',0,0,.50],['stay','Stay On Feet',1,7,.30],['aggressive','Aggressive',2,5,.80]]" not in bible_data:
    errs.append('tackling IDs do not match direct build-30527 provenance correction')
packaged_bible=(ROOT/'docs/TOP_ELEVEN_TOOL_BIBLE_BUILD_30527_v1.md').read_text(encoding='utf-8')
if '| Tackling | Stay On Feet | 1 | High | 7 |' not in packaged_bible or '| Tackling | Balanced | 0 | Low | 0 |' not in packaged_bible:
    errs.append('packaged Bible still contains stale tackling protocol IDs')


# Required runtime module scripts present before app.js.
scripts=[Path(x.get('src')).name for x in soup.find_all('script',src=True)]
for req in ['bible-data.js','formation.js','tactics-engine.js','mentor-engine.js','team-plan-engine.js','training-engine.js','team-training-engine.js','scanner-engine.js','app.js']:
    if req not in scripts: errs.append(f'missing runtime script {req}')
if scripts and scripts[-1]!='app.js': errs.append('app.js must load after dependency modules')

# Check local static assets referenced by HTML/CSS. Skip remote/data/hash URLs.
paths=set()
for el in soup.find_all(src=True): paths.add(el['src'])
for el in soup.find_all(href=True): paths.add(el['href'])
css=(ROOT/'css/app.css').read_text(); paths.update(re.findall(r"url\(['\"]?([^)\'\"]+)",css))
for rel in sorted(paths):
    if rel.startswith(('http:','https:','data:','#')): continue
    rel=rel.split('?')[0].split('#')[0]
    if not rel: continue
    p=(ROOT/rel).resolve()
    if rel.startswith('../assets/'): p=(ROOT/'css'/rel).resolve()
    if not p.exists(): errs.append(f'missing asset {rel} -> {p}')

if errs:
    print('FAIL static checks')
    for e in errs: print('-',e)
    sys.exit(1)
print(f'PASS static checks: {len(ids)} ids, {len(pages)} pages, {len(refs)} direct DOM refs, {len(paths)} static paths; Bible UI/integrity hooks present')
