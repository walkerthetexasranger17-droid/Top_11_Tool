from pathlib import Path
from bs4 import BeautifulSoup
import re,sys,json
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
js=(ROOT/'js/app.js').read_text(encoding='utf-8')
players=(ROOT/'js/players.js').read_text(encoding='utf-8')
scanner=(ROOT/'js/scanner-engine.js').read_text(encoding='utf-8')
formation=(ROOT/'js/formation.js').read_text(encoding='utf-8')
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

# v0.4.6 product information architecture.
nav=[x.get_text(' ',strip=True) for x in soup.select('.bottom-nav .nav-btn')]
expected_nav=['Home','Squad','Training','Team Plan','Drills','Settings']
if nav!=expected_nav: errs.append(f'bottom nav does not match v0.4.6 product structure: {nav}')
if len(soup.select('.bottom-nav .nav-btn'))!=6: errs.append('bottom navigation must expose exactly six destinations')
for rid in [
    'formationPitch','setPiecePitch','setPieceMode','tacticPlan','mentorLevels','profilePlaystyleState',
    'profileRelatedPicker','scanRelatedPicker','profileRescanBtn','scanReviewPlayerCard','scanSkills','squadList'
]:
    if rid not in ids: errs.append(f'missing v0.4.6 UI control: {rid}')
for forbidden_id in ['squadSearch','squadRoleFilter','squadPlaystyleFilter','squadAvailabilityFilter','squadAgeMin','squadAgeMax','squadOvrMin','squadOvrMax','planTemplate','formationXIList','formationBench','mentorAlternatives']:
    if forbidden_id in ids: errs.append(f'removed/clutter UI control survived: {forbidden_id}')
if not soup.select_one('#page-squad .squad-add-primary[data-go="add-player"]'): errs.append('Squad page missing primary Add Player action')
if soup.select_one('#page-add-player[data-nav-label]'): errs.append('Scanner must stay contextual and out of main navigation')
if soup.select_one('#page-player[data-nav-label]'): errs.append('Player Profile must stay contextual and out of main navigation')
if soup.select_one('[data-page="playmakers"]'): errs.append('legacy Specialists/Playmakers page survives')
for tab in ['formation','set-pieces','tactics']:
    if not soup.select_one(f'[data-team-plan-tab="{tab}"]'): errs.append(f'Team Plan missing {tab} tab')
for phase in ['possession','transition','out']:
    if not soup.select_one(f'[data-tactic-phase="{phase}"]'): errs.append(f'Tactics missing {phase} phase')
if not soup.select_one('[data-training-tab="individual"]') or not soup.select_one('[data-training-tab="team"]'):
    errs.append('Training does not expose Individual | Team tabs on one page')
if 'v0.4.6' not in html: errs.append('visible version is not v0.4.6')
if re.search(r'BUILD\s*30527|Build\s*30527',html): errs.append('internal build 30527 is still visible in product HTML')
if 'Scanner v6' in html or 'verified scanner' in html.lower(): errs.append('technical scanner provenance is exposed in normal UI')

# Integrity hooks protecting recommendations/player editing.
hay=js+players+(ROOT/'js/drill-profile.js').read_text(encoding='utf-8')
for needle,label in [
    ('sourceSnapshot:trainingSourceSnapshot', 'training source snapshot on build'),
    ('sameTrainingSource', 'training source snapshot comparison'),
    ("await S.del(`training:session:${outKey}`)", 'player edit session invalidation'),
    ('invalidateAllSessions', 'drill-library session invalidation'),
    ('mergeVisibleNaturalRoles', 'non-truncating visible role editor'),
    ('mergePlaystyleState', 'full playstyle-state preserving edit path'),
    ('scanUpdateKey', 'existing-player update-by-scan path'),
    ('data-profile-primary-role', 'tap-to-primary player role control'),
    ('specialAbilityTraining', 'Special Ability learning-state preservation'),
]:
    if needle not in hay: errs.append(f'missing integrity hook: {label}')

# Scanner v6 contract retained from the proven scanner work.
for needle,label,src in [
    ("const VERSION=6", "Scanner v6 version marker", scanner),
    ("gemini-3.1-flash-live-preview", "Gemini 3.1 Flash Live model", scanner),
    ("thinkingLevel:'HIGH'", "HIGH thinking configuration", scanner),
    ("BidiGenerateContent", "Gemini Live WebSocket transport", scanner),
    ("submit_playstyle_identity", "independent playstyle identity pass", scanner),
    ("submit_playstyle_level_segments", "independent playstyle level pass", scanner),
    ("submit_ability_slot_scan", "per-slot Special Ability pass", scanner),
    ("playstyles-index-final.png", "playstyle identity reference", scanner),
    ("playstyle-levels-index-final.png", "playstyle level reference", scanner),
    ("special-abilities-standard-index-final.png", "standard ability reference", scanner),
    ("special-abilities-boosted-index-final.png", "boosted ability reference", scanner),
    ("Gemini Scanner is not configured", "Gemini API-key requirement", scanner),
    ("normaliseFrameMedia", "native screenshot normalisation", scanner),
    ("detectLayoutHint", "GK/outfield layout detector", scanner),
    ("specialAbilityTraining", "ability-learning state separation", scanner),
    ("darkFraction>.25", "ability-training widget detector", scanner),
    ("scrollToScanReview", "scanner review auto-scroll", js),
]:
    if needle not in src: errs.append(f'missing scanner hook: {label}')
for forbidden in ['scanner-templates.json','reconcileReadToTarget','classifyGlyph','readNumber(ctx','cloudScannerEndpoint','Cloud Run Service URL','gemini-3.8-flash','gemini-3.6-flash','hogDescriptor','levelDescriptor','localVisualMatch',':generateContent']:
    if forbidden in scanner+js+html: errs.append(f'legacy/superseded scanner production logic survives: {forbidden}')
if (ROOT/'js/scanner-templates.json').exists(): errs.append('legacy scanner-templates.json still packaged')
if (ROOT/'cloud-scanner').exists(): errs.append('old Cloud Run scanner folder still packaged')
for rel in ['playstyles-index-final.png','playstyle-levels-index-final.png','special-abilities-standard-index-final.png','special-abilities-boosted-index-final.png']:
    p=ROOT/'assets/scanner'/rel
    if not p.is_file() or p.stat().st_size==0: errs.append(f'missing scanner reference: {rel}')
for player in ['David Andrews','François Roelandt','Ariel Bravo','Richard Kilroy','Gosling Lataille','Remus Iacob','Paul Brace','Victor Aslan']:
    if player in scanner: errs.append(f'benchmark player leaked into production scanner: {player}')

# One authoritative player identity dataset + icon asset coverage.
data=(ROOT/'js/data.js').read_text(encoding='utf-8')
if 'slice(0,2)' in players or 'specialAbilities.slice(0,2)' in js: errs.append('hard two-special-ability cap survives')
if 'Shadow Striker' not in data: errs.append('current Shadow Striker display alias missing')
if "SPECIAL_ABILITY_DISPLAY_ALIASES={'Long Shots':'Shadow Striker'}" not in data: errs.append('legacy Long Shots -> Shadow Striker alias missing')
if 'Ball Playing DC' not in (ROOT/'js/bible-data.js').read_text(encoding='utf-8'): errs.append('Ball Playing DC missing from current data')
for folder,min_count in [('playstyles',20),('abilities',19)]:
    files=list((ROOT/'assets'/folder).glob('*.png'))
    if len(files)<min_count: errs.append(f'{folder} icon pack incomplete: {len(files)}')

# Automatic formation selection + current community candidate expansion.
for needle in ["templateId:null","3-1-4-1-1","3-1-2-1-3","4-1-4-1"]:
    if needle not in js+formation: errs.append(f'missing automatic/current formation hook: {needle}')
if 'source:\'community-2026\'' not in formation: errs.append('community formation candidates are not provenance-labelled')

# Product/display name consistency.
manifest=json.loads((ROOT/'manifest.json').read_text())
if manifest.get('name')!='Top Eleven Tool' or manifest.get('short_name')!='Top Eleven Tool': errs.append('manifest app name is not Top Eleven Tool')
if not soup.title or soup.title.get_text(strip=True)!='Top Eleven Tool': errs.append('page title is not Top Eleven Tool')
if 'TOP ELEVEN <span>TOOL</span>' not in html: errs.append('in-app header branding is not Top Eleven Tool')

# Internal Build 30527 contract remains available in background code/docs.
bible_data=(ROOT/'js/bible-data.js').read_text(encoding='utf-8')
if "tackling:[['balanced','Balanced',0,0,.50],['stay','Stay On Feet',1,7,.30],['aggressive','Aggressive',2,5,.80]]" not in bible_data:
    errs.append('tackling IDs do not match direct build-30527 provenance correction')
packaged_bible=(ROOT/'docs/TOP_ELEVEN_TOOL_BIBLE_BUILD_30527_v1.md').read_text(encoding='utf-8')
if '| Tackling | Stay On Feet | 1 | High | 7 |' not in packaged_bible or '| Tackling | Balanced | 0 | Low | 0 |' not in packaged_bible:
    errs.append('packaged Bible still contains stale tackling protocol IDs')

# Runtime module ordering.
scripts=[Path(x.get('src')).name for x in soup.find_all('script',src=True)]
for req in ['bible-data.js','formation.js','tactics-engine.js','mentor-engine.js','team-plan-engine.js','training-engine.js','team-training-engine.js','scanner-engine.js','app.js']:
    if req not in scripts: errs.append(f'missing runtime script {req}')
if scripts and scripts[-1]!='app.js': errs.append('app.js must load after dependency modules')

# Local static assets referenced by HTML/CSS.
paths=set()
for el in soup.find_all(src=True): paths.add(el['src'])
for el in soup.find_all(href=True): paths.add(el['href'])
css=(ROOT/'css/app.css').read_text(encoding='utf-8'); paths.update(re.findall(r"url\(['\"]?([^)\'\"]+)",css))
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
print(f'PASS static checks: {len(ids)} ids, {len(pages)} pages, six-screen product IA, scanner/player/team-plan contracts present')
