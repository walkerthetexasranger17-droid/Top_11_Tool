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

# Scanner v3: direct Gemini free-tier core-data-only path; playstyle/abilities are manual.
for needle,label,src in [
    ("const VERSION=3", "Scanner v3 version marker", scanner),
    ("gemini-3.6-flash", "Gemini 3.6 Flash model", scanner),
    ("REQUEST_TIMEOUT_MS=20000", "20-second Gemini request timeout", scanner),
    ("RETRY_DELAY_MS=2000", "fixed two-second automatic retry delay", scanner),
    ("DO NOT analyse, identify, locate or return playstyles", "playstyle scanning removed", scanner),
    ("DO NOT analyse, identify, locate or return special abilities", "special-ability scanning removed", scanner),
    ("generativelanguage.googleapis.com", "direct Gemini Developer API", scanner),
    ("Gemini Scanner is not configured", "Gemini API-key requirement", scanner),
    ("scanQueue", "multi-player scanner review queue", js),
    ("scanPlaystyleLevel", "manual playstyle-tier editor", html),
    ("scanner:{version:3", "Scanner v3 provenance on save", js),
    ("save.disabled=false", "scanner mismatch does not dead-lock Save", js),
]:
    if needle not in src: errs.append(f'missing scanner hook: {label}')
for forbidden in ['scanner-templates.json','reconcileReadToTarget','classifyGlyph','readNumber(ctx','cloudScannerEndpoint','Cloud Run Service URL',
                  'gemini-3.8-flash','hogDescriptor','levelDescriptor','localVisualMatch','specialAbilityIcons','playstyleBadge']:
    if forbidden in scanner+js+html: errs.append(f'legacy Scanner v2/cloud/infinite-retry production logic survives: {forbidden}')
if (ROOT/'js/scanner-templates.json').exists(): errs.append('legacy scanner-templates.json still packaged')
if (ROOT/'cloud-scanner').exists(): errs.append('old Cloud Run scanner folder still packaged')
if 'gemini-3.4-flash' in scanner: errs.append('unsupported Gemini 3.4 Flash was invented')
if (ROOT/'assets/scanner/reference-manifest.json').exists() or (ROOT/'assets/scanner/references').exists(): errs.append('obsolete scanner visual reference assets still packaged')
if 'hogDescriptor' in scanner or 'levelDescriptor' in scanner or 'localVisualMatch' in scanner: errs.append('obsolete local icon matching survives')
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
if 'v5.2.19' not in html: errs.append('visible build label is not v5.2.19')
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
