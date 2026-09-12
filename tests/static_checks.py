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

# v0.4.11 product information architecture + cloud account/security foundation.
nav=[x.get_text(' ',strip=True) for x in soup.select('.bottom-nav .nav-btn')]
expected_nav=['Home','Squad','Training','Team Plan','Drills','Settings']
if nav!=expected_nav: errs.append(f'bottom nav does not match v0.4.11 product structure: {nav}')
if len(soup.select('.bottom-nav .nav-btn'))!=6: errs.append('bottom navigation must expose exactly six destinations')
for rid in [
    'formationPitch','setPiecePitch','setPieceMode','tacticPlan','mentorLevels','profilePlaystyleState',
    'profileRelatedPicker','scanRelatedPicker','profileRescanBtn','scanReviewPlayerCard','scanSkills','squadList'
]:
    if rid not in ids: errs.append(f'missing v0.4.11 UI control: {rid}')
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
if 'v0.4.11' not in html: errs.append('visible version is not v0.4.11')
if re.search(r'BUILD\s*30527|Build\s*30527',html): errs.append('internal build 30527 is still visible in product HTML')
if 'Scanner v6' in html or 'verified scanner' in html.lower(): errs.append('technical scanner provenance is exposed in normal UI')


# Firebase cloud-account foundation.
cloud=(ROOT/'js/cloud.js').read_text(encoding='utf-8')
for rid in ['authGate','authGoogleBtn','authEmailChoiceBtn','authEmailBtn','authCreateBtn','page-account','accountChangeEmail','accountChangePassword','accountStartTotp','accountMfaStatus','accountSyncStatus']:
    if rid not in ids: errs.append(f'missing v0.4.11 cloud/account UI control: {rid}')
for needle,label in [
    ("firebase-auth.js",'Firebase Authentication SDK loader'),
    ("firebase-firestore.js",'Cloud Firestore SDK loader'),
    ('signInWithEmailAndPassword','email/password sign-in'),
    ('GoogleAuthProvider','Google sign-in'),
    ('verifyBeforeUpdateEmail','verified email-change flow'),
    ('updatePassword','password-change flow'),
    ('TotpMultiFactorGenerator','TOTP MFA flow'),
    ('requireSecondFactorForSensitiveChange','mandatory MFA for sensitive account changes'),
    ("collection(state.db,'users',state.user.uid,'kv')",'per-user Firestore data tree'),
    ('persistentMultipleTabManager','persistent Firestore web cache'),
]:
    if needle not in cloud: errs.append(f'missing cloud/account hook: {label}')
if not soup.select_one('[data-auth-panel="email"]'): errs.append('email/password sign-in is not separated behind its own auth choice')
if not soup.select_one('#authEmailChoiceBtn.auth-provider.email'): errs.append('branded email/password choice button missing')
if not soup.select_one('#authGoogleBtn img[src*="google-g.svg"]'): errs.append('official Google G asset is not used on sign-in')
if any(x in html.lower() for x in ['sms phone verification','requires blaze','cloud billing account']): errs.append('paid phone/SMS authentication UI survived')
account_btn=soup.select_one('#accountButton')
if not account_btn or account_btn.get('title')!='Profile & Security': errs.append('desktop profile button is missing its Profile & Security hover title')
css_text=(ROOT/'css/app.css').read_text(encoding='utf-8')
if '.account-button' not in css_text or 'cursor:pointer' not in css_text: errs.append('profile button does not advertise clickability with a pointer cursor')
sw_text=(ROOT/'sw.js').read_text(encoding='utf-8')
if "const CACHE='te-v0-4-11" not in sw_text or "e.request.mode==='navigate'" not in sw_text or "cache:'no-store'" not in sw_text: errs.append('v0.4.11 service-worker update/navigation freshness guard missing')
if "toast('App initialisation failed','err')" in js: errs.append('generic app-initialisation error toast survived GitHub testing hotfix')
if not (ROOT/'firestore.rules').is_file(): errs.append('firestore.rules missing')
rules=(ROOT/'firestore.rules').read_text(encoding='utf-8') if (ROOT/'firestore.rules').is_file() else ''
if 'request.auth.uid == userId' not in rules: errs.append('Firestore rules do not restrict user data to matching auth uid')
if not (ROOT/'docs/setup/FIREBASE.md').is_file(): errs.append('docs/setup/FIREBASE.md missing')

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
packaged_bible=(ROOT/'docs/reference/TOP_ELEVEN_TOOL_BIBLE_BUILD_30527_v1.md').read_text(encoding='utf-8')
if '| Tackling | Stay On Feet | 1 | High | 7 |' not in packaged_bible or '| Tackling | Balanced | 0 | Low | 0 |' not in packaged_bible:
    errs.append('packaged Bible still contains stale tackling protocol IDs')

# Runtime module ordering.
scripts=[Path(x.get('src')).name for x in soup.find_all('script',src=True)]
for req in ['bible-data.js','cloud.js','formation.js','tactics-engine.js','mentor-engine.js','team-plan-engine.js','training-engine.js','team-training-engine.js','scanner-engine.js','app.js']:
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

assert (ROOT/'assets'/'brands'/'google-g.svg').exists(), 'Missing Google brand icon'
