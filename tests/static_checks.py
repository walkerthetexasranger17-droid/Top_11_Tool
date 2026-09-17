from pathlib import Path
from bs4 import BeautifulSoup
import re,sys,json
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
js=(ROOT/'js/app.js').read_text(encoding='utf-8')
players=(ROOT/'js/players.js').read_text(encoding='utf-8')
scanner=(ROOT/'js/scanner-engine.js').read_text(encoding='utf-8')
formation=(ROOT/'js/formation.js').read_text(encoding='utf-8')
teamplan=(ROOT/'js/team-plan-engine.js').read_text(encoding='utf-8')
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

# v0.4.12 product information architecture + cloud account/security foundation.
nav=[x.get_text(' ',strip=True) for x in soup.select('.bottom-nav .nav-btn')]
expected_nav=['Home','Squad','Training','Team Plan','Drills','Settings']
if nav!=expected_nav: errs.append(f'navigation shell does not match v0.6.21 direct-touch structure: {nav}')
if len(soup.select('.bottom-nav .nav-btn'))!=6: errs.append('navigation shell must expose six direct touch routes with no More item')
for rid in [
    'formationPitch','setPiecePitch','setPieceCoverage','setPieceCoverageGrid','tacticPlan','mentorLevels','profilePlaystyleState',
    'profileRelatedPicker','scanRelatedPicker','profileRescanBtn','scanReviewPlayerCard','scanSkills','squadList'
]:
    if rid not in ids: errs.append(f'missing v0.4.12 UI control: {rid}')
for forbidden_id in ['squadRoleFilter','squadAvailabilityFilter','squadAgeMin','squadAgeMax','planTemplate','formationXIList','formationBench','mentorAlternatives']:
    if forbidden_id in ids: errs.append(f'removed/clutter UI control survived: {forbidden_id}')
if not soup.select_one('#page-squad .v062-squad-hero [data-go="add-player"]'): errs.append('Squad page missing primary Add Player action')
if soup.select_one('#page-add-player[data-nav-label]'): errs.append('Scanner must stay contextual and out of main navigation')
if soup.select_one('#page-player[data-nav-label]'): errs.append('Player Profile must stay contextual and out of main navigation')
if soup.select_one('[data-page="playmakers"]'): errs.append('legacy Specialists/Playmakers page survives')
for tab in ['formation','set-pieces','tactics']:
    if not soup.select_one(f'[data-team-plan-tab="{tab}"]'): errs.append(f'Team Plan missing {tab} tab')
for phase in ['possession','transition','out']:
    if not soup.select_one(f'[data-tactic-phase="{phase}"]'): errs.append(f'Tactics missing {phase} phase')
if not soup.select_one('[data-training-tab="individual"]') or not soup.select_one('[data-training-tab="team"]'):
    errs.append('Training does not expose Individual | Team tabs on one page')
if 'v0.6.21' not in html: errs.append('visible UI/runtime version is not v0.6.21')
if re.search(r'BUILD\s*30527|Build\s*30527',html): errs.append('internal build 30527 is still visible in product HTML')
if 'verified scanner' in html.lower(): errs.append('technical scanner provenance is exposed in normal UI')




# v0.6.4 inherited Squad redesign contract.
for rid in ['squadSort','squadStatTotal','squadStatAvg','squadStatHigh','squadStatBalance','squadStatNeeds']:
    if rid not in ids: errs.append(f'missing current Squad control: {rid}')
for removed in ['squadSearch','squadPlaystyleFilter','squadAbilityFilter','squadOvrMin','squadOvrMax','squadIssuesOnly','squadResetFilters']:
    if removed in ids: errs.append(f'removed Squad filter control survived v0.6.21: {removed}')
if not soup.select_one('#page-squad .v062-squad-hero'): errs.append('v0.6.4 Squad cinematic hero missing')
if not soup.select_one('#page-squad .squad-workspace'): errs.append('v0.6.4 Squad workspace missing')


# v0.6.4 inherited Player Profile production design contract.
for rid in ['profileName','profileOvr','profileBadges','profileDevelopmentInsight','profileRoleScores','profileSkills','profileTrainBtn','profileRescanBtn','profileEditBtn']:
    if rid not in ids: errs.append(f'missing v0.6.4 Player Profile control: {rid}')
if not soup.select_one('#page-player.v063-profile-page .v063-profile-hero'): errs.append('v0.6.4 Player Profile cinematic hero missing')
if len(soup.select('#page-player .profile-panel')) < 3: errs.append('v0.6.4 Player Profile intelligence panel layout missing')

# v0.6.4 Training production design contract.
for rid in ['trainingPlayer','trainingMode','intelNormalCount','intelMasterCount','buildSessionBtn','trainingResults','sessionList','sessionSummary','completeSessionBtn','teamTrainingCards']:
    if rid not in ids: errs.append(f'missing v0.6.4 Training control: {rid}')
if not soup.select_one('#page-training.v064-training-page .v064-training-hero'): errs.append('v0.6.4 Training cinematic hero missing')
if len(soup.select('#page-training .training-setup-card')) != 4: errs.append('v0.6.4 Training four-step setup workspace missing')
if not soup.select_one('#page-training .v064-training-results .training-results-side'): errs.append('v0.6.4 Training intelligence side panel missing')

# v0.6.5 Team Plan production design contract.
if not soup.select_one('#page-team-plan.v065-team-plan-page .v065-team-plan-head'): errs.append('v0.6.5 Team Plan header missing')
if not soup.select_one('#page-team-plan #teamPlanFormationPanel'): errs.append('v0.6.5 Team Plan lineup workspace missing')
if not soup.select_one('#page-team-plan #teamPlanTacticsPanel .mentor-section'): errs.append('v0.6.5 Team Plan mentor workspace missing')

# v0.6.6 Drills production design contract.
for rid in ['drillLibrarySearch','drillLibraryCategory','drillSummaryTotal','drillSummaryUnlocked','drillSummaryMaster','normalDrillConfig','masterStockConfig']:
    if rid not in ids: errs.append(f'missing v0.6.6 Drills control: {rid}')
if not soup.select_one('#page-my-drills.v066-drills-page .v066-drills-hero'): errs.append('v0.6.6 Drills cinematic hero missing')
if not soup.select_one('#page-my-drills .v066-drills-workspace'): errs.append('v0.6.6 Drills workspace missing')

# v0.6.11 Scanner + Update Players + compact portrait contract.
for rid in ['scanWindow','scanQueue','scanReview','manualAddPlayerBtn','saveScannedPlayer','updateQueueOverview','updateStatSquad','updateStatQueue','updateStatDone','updateStatAttention']:
    if rid not in ids: errs.append(f'missing v0.6.11 scanner/update control: {rid}')
if not soup.select_one('#page-add-player.v068-scanner-page .v068-scanner-hero'): errs.append('v0.6.11 Scanner hero missing')
if not soup.select_one('#page-add-player .scanner-workspace'): errs.append('v0.6.11 Scanner workspace missing')
if '"orientation":"any"' not in (ROOT/'manifest.json').read_text(encoding='utf-8').replace(' ', '').replace('\n',''): errs.append('manifest must allow portrait compact fallback')

# v0.6.7 Settings + Account production design contract.
for rid in ['geminiScannerApiKey','saveGeminiScannerKey','testGeminiScannerKey','clearGeminiScannerKey','geminiScannerStatus','localSquadStatus','clearDataBtn','accountAvatar','accountDisplayName','accountEmail','accountMfaStatus']:
    if rid not in ids: errs.append(f'missing v0.6.7 Settings/Account control: {rid}')
if not soup.select_one('#page-settings.v067-settings-page .v067-settings-hero'): errs.append('v0.6.7 Settings hero missing')
if not soup.select_one('#page-settings .settings-grid'): errs.append('v0.6.7 Settings grid missing')
if not soup.select_one('#page-account.v067-account-page .v067-account-hero'): errs.append('v0.6.7 Account hero missing')

# v0.4.12 focused patch contracts.
if soup.select_one('#planMode') or soup.select_one('#planMinCondition'): errs.append('legacy Formation plan inputs survived v0.4.12')
if not soup.select_one('#teamPlanTacticsPanel #planApproach') or not soup.select_one('#teamPlanTacticsPanel #planDrain'): errs.append('Tactic Calculator inputs are not on Tactics')
if 'Tactic Calculator' not in html: errs.append('Tactic Calculator label missing')
for key in ['penalty1','penalty2','penalty3','penalty4','penalty5','cornerRight','cornerLeft','freeRight','freeLeft','captain']:
    if key not in js: errs.append(f'missing set-piece slot {key}')
if 'state.scanQueue.splice(removedIndex,1)' not in js: errs.append('saved scanner entry is not removed from queue')
if 'clearUserSetup' not in (ROOT/'js/drill-profile.js').read_text(encoding='utf-8'): errs.append('account-specific drill reset missing')

# Firebase cloud-account foundation.
cloud=(ROOT/'js/cloud.js').read_text(encoding='utf-8')
for rid in ['authGate','authGoogleBtn','authEmailChoiceBtn','authEmailBtn','authCreateBtn','page-account','accountChangeEmail','accountChangePassword','accountStartTotp','accountMfaStatus','accountSyncStatus']:
    if rid not in ids: errs.append(f'missing v0.4.12 cloud/account UI control: {rid}')
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
    ('queueSet','local-first background cloud write queue'),
    ('flushOutbox','durable cloud outbox flush'),
]:
    if needle not in cloud: errs.append(f'missing cloud/account hook: {label}')
if 'persistentLocalCache' in cloud or 'getDocsFromCache' in cloud: errs.append('persistent Firestore cache must not compete with the app localStorage working copy')
if not soup.select_one('[data-auth-panel="email"]'): errs.append('email/password sign-in is not separated behind its own auth choice')
if not soup.select_one('#authEmailChoiceBtn.auth-provider.email'): errs.append('branded email/password choice button missing')
if not soup.select_one('#authGoogleBtn img[src*="google-g.svg"]'): errs.append('official Google G asset is not used on sign-in')
if any(x in html.lower() for x in ['sms phone verification','requires blaze','cloud billing account']): errs.append('paid phone/SMS authentication UI survived')
account_btn=soup.select_one('#accountButton')
if not account_btn or account_btn.get('title')!='Profile & Security': errs.append('desktop profile button is missing its Profile & Security hover title')
css_text=(ROOT/'css/app.css').read_text(encoding='utf-8')
if '.account-button' not in css_text or 'cursor:pointer' not in css_text: errs.append('profile button does not advertise clickability with a pointer cursor')
sw_text=(ROOT/'sw.js').read_text(encoding='utf-8')
if "const CACHE='te-v0-6-21-squad-hero-hotfix" not in sw_text or "e.request.mode==='navigate'" not in sw_text or "cache:'no-store'" not in sw_text: errs.append('v0.4.12 service-worker update/navigation freshness guard missing')
if "toast('App initialisation failed','err')" in js: errs.append('generic app-initialisation error toast survived GitHub testing hotfix')
if 'loadMentorLevels' in js: errs.append('stale loadMentorLevels startup call survived; Mentor state must hydrate through loadMentorState')
if "startupStep('mentor state',()=>loadMentorState())" not in js: errs.append('Mentor state is not hydrated during startup')
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

# Scanner v12 compact-reference contract.
for needle,label,src in [
    ("const VERSION=12", "Scanner v12 version marker", scanner),
    ("gemini-3.1-flash-live-preview", "Gemini 3.1 Flash Live model", scanner),
    ("thinkingLevel:'HIGH'", "HIGH thinking configuration", scanner),
    ("BidiGenerateContent", "Gemini Live WebSocket transport", scanner),
    ("submit_playstyle_identity", "independent playstyle identity pass", scanner),
    ("submit_playstyle_level", "exact same-emblem level-ring pass", scanner),
    ("submit_playstyle_overlay", "separate playstyle overlay pass", scanner),
    ("buildPlaystyleLevelEvidence", "isolated badge level evidence", scanner),
    ("segmentCount", "explicit level segment count", scanner),
    ("rightSegmentPresent", "right level-ring segment inspection", scanner),
    ("bottomSegmentPresent", "bottom level-ring segment inspection", scanner),
    ("leftSegmentPresent", "left level-ring segment inspection", scanner),
    ("locateBadgeComponent", "automatic tight playstyle badge locator", scanner),
    ("submit_ability_slot_scan", "per-slot Special Ability pass", scanner),
    ("reference-manifest.json", "exact HQ reference manifest", scanner),
    ("compact-reference-manifest.json", "compact scanner reference manifest", scanner),
    ("PlaystyleSmallAtlas", "compact renderer source", scanner),
    ("READY-ARROW ZONE MASKED", "ready-arrow masked level evidence", scanner),
    ("IMPORTANT FOR YELLOW/MIDFIELD BADGES", "yellow Standard/Intermediate disambiguation", scanner),
    ("buildPlaystyleIdentityReference", "runtime exact playstyle identity board", scanner),
    ("compactPlaystyleStateMedia", "direct exact compact same-playstyle level PNG loader", scanner),
    ("buildAbilityReference", "runtime coloured Special Ability board", scanner),
    ("submit_playstyle_level_confirmation", "mandatory independent compact level confirmation", scanner),
    ("There is intentionally NO gold/boosted reference path", "coloured-only Special Ability rule", scanner),
    ("Gemini Scanner is not configured", "Gemini API-key requirement", scanner),
    ("normaliseFrameMedia", "native screenshot normalisation", scanner),
    ("detectLayoutHint", "GK/outfield layout detector", scanner),
    ("specialAbilityTraining", "ability-learning state separation", scanner),
    ("darkFraction>.25", "ability-training widget detector", scanner),
    ("scrollToScanReview", "scanner review auto-scroll", js),
]:
    if needle not in src: errs.append(f'missing scanner hook: {label}')
for forbidden in ['scanner-templates.json','reconcileReadToTarget','classifyGlyph','readNumber(ctx','cloudScannerEndpoint','Cloud Run Service URL','gemini-3.8-flash','gemini-3.6-flash','hogDescriptor','levelDescriptor','localVisualMatch',':generateContent','playstyles-index-final.png','playstyle-levels-index-final.png','special-abilities-standard-index-final.png','special-abilities-boosted-index-final.png','submit_playstyle_level_segments']:
    if forbidden in scanner+js+html: errs.append(f'legacy/superseded scanner production logic survives: {forbidden}')
if (ROOT/'js/scanner-templates.json').exists(): errs.append('legacy scanner-templates.json still packaged')
if (ROOT/'cloud-scanner').exists(): errs.append('old Cloud Run scanner folder still packaged')
manifest_path=ROOT/'assets/scanner/reference-manifest.json'
if not manifest_path.is_file(): errs.append('exact scanner reference manifest missing')
else:
    ref=json.loads(manifest_path.read_text())
    if ref.get('counts',{}).get('totalReferenceImages')!=279: errs.append('exact scanner reference count is not 279')
if (ROOT/'assets/playstyles').exists() or (ROOT/'assets/abilities').exists(): errs.append('legacy playstyle/ability asset folders survived v0.4.18')
if "B.PLAYSTYLE_LEVELS.filter(x=>x.id>=1);" not in js: errs.append('Standard playstyle tier is not selectable')
for player in ['David Andrews','François Roelandt','Ariel Bravo','Richard Kilroy','Gosling Lataille','Remus Iacob','Paul Brace','Victor Aslan']:
    if player in scanner: errs.append(f'benchmark player leaked into production scanner: {player}')

# One authoritative player identity dataset + icon asset coverage.
data=(ROOT/'js/data.js').read_text(encoding='utf-8')
if 'slice(0,2)' in players or 'specialAbilities.slice(0,2)' in js: errs.append('hard two-special-ability cap survives')
bible=(ROOT/'js/bible-data.js').read_text(encoding='utf-8')
if 'Shadow Striker' not in data or "{id:7,name:'Shadow Striker'}" not in bible: errs.append('current Shadow Striker player-facing identity missing')
if "{id:7,name:'Long Shots'}" in bible: errs.append('Long Shots is still exposed as a player-facing Special Ability')
if 'SPECIAL_ABILITY_INTERNAL_ALIASES' not in data or "'LongShots':'Shadow Striker'" not in data: errs.append('internal LongShots import normalization missing')
strategy_strings=(ROOT/'data/build_30527/index/strategy_strings_v2.json').read_text(encoding='utf-8')
if 'Long Shots ability' in strategy_strings: errs.append('Tactics explanation still exposes Long Shots as a Special Ability')
if 'canonicalSpecialAbilityName' not in data: errs.append('central Special Ability canonicaliser missing')
if 'Ball Playing DC' not in (ROOT/'js/bible-data.js').read_text(encoding='utf-8'): errs.append('Ball Playing DC missing from current data')
ref_manifest=json.loads((ROOT/'assets/scanner/reference-manifest.json').read_text())
if len(ref_manifest.get('playstyles',[]))!=20: errs.append('exact playstyle reference pack incomplete')
if len(ref_manifest.get('specialAbilities',[]))!=19: errs.append('coloured Special Ability reference pack incomplete')

# Automatic formation selection is data-driven from the v2 contract.
strategy_logic=json.loads((ROOT/'data/build_30527/index/decision_logic_v2.json').read_text(encoding='utf-8'))
if 'F.rankStrategic(eligible)' not in teamplan or 'TP.buildOptimalPlan' not in js: errs.append('missing automatic full-plan formation search hook')
if 'CFG.formation?.candidates' not in formation: errs.append('formation engine is not consuming authoritative v2 candidates')
formation_names={x['name'] for x in strategy_logic['formation']['candidates']}
for needle in ['3-1-4-1-1','3-1-2-1-3','4-1-4-1']:
    if needle not in formation_names: errs.append(f'missing current formation candidate: {needle}')
community=[x for x in strategy_logic['formation']['candidates'] if x.get('source')=='community-2026']
if {x['id'] for x in community}!={'4141','31411','31213'}: errs.append('community formation candidates are not provenance-labelled')

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
scripts=[Path(x.get('src').split('?')[0]).name for x in soup.find_all('script',src=True)]
for req in ['bible-data.js','strategy-logic.js','squad-coverage-engine.js','cloud.js','formation.js','tactics-engine.js','mentor-engine.js','team-plan-engine.js','training-engine.js','team-training-engine.js','scanner-engine.js','app.js']:
    if req not in scripts: errs.append(f'missing runtime script {req}')
if scripts and scripts[-1]!='app.js': errs.append('app.js must load after dependency modules')

# Local static assets referenced by HTML/CSS.
paths=set()
for el in soup.find_all(src=True): paths.add(el['src'])
for el in soup.find_all(href=True): paths.add(el['href'])
css=(ROOT/'css/app.css').read_text(encoding='utf-8')+'\n'+(ROOT/'css/v060.css').read_text(encoding='utf-8'); paths.update(re.findall(r"url\(['\"]?([^)\'\"]+)",css))
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
