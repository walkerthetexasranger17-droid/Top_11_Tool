from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'css/v060.css').read_text(encoding='utf-8')
js=(ROOT/'js/app.js').read_text(encoding='utf-8')
errs=[]
for needle in ['css/v060.css?r=0615','dashboardRecentPlayers','dashboardTrainingStats','dashboardPlanSnapshot','dashboardInsight','dashboardUpdatePlayers','v060-home-hero','v062-squad-hero','squadSearch','squadPlaystyleFilter','squadAbilityFilter','squadSort','v063-profile-hero','profileDevelopmentInsight','profileRoleScores','profileSkills','v064-training-hero','trainingPlayer','trainingMode','buildSessionBtn','trainingResults','sessionList','sessionSummary','completeSessionBtn','v065-team-plan-head','teamPlanFormationPanel','teamPlanSetPiecesPanel','teamPlanTacticsPanel','mentorStrip','mentorLevels','v066-drills-hero','drillLibrarySearch','drillLibraryCategory','drillSummaryUnlocked','drillSummaryMaster','v067-settings-hero','geminiScannerApiKey','localSquadStatus','v067-account-hero','accountMfaStatus','v068-scanner-hero','scanWindow','scanQueue','scanReview','updateQueueOverview','updateStatQueue','updateStatDone','updateStatAttention','scanner-hero-desktop.webp','scanner-hero-landscape.webp']:
    if needle not in html: errs.append(f'missing v0.6 Home hook: {needle}')
for needle in ['@media (min-width:1024px)','@media (min-width:700px) and (max-width:1023px)','@media (max-width:699px)','--v6-sidebar:214px','.dashboard-workspace','.auth-gate::before','.squad-workspace','.squad-player-row','.v063-profile-hero','.profile-panel','.skill-track','.v064-training-hero','.v064-training-setup','.training-setup-card','.v064-training-results','.v065-team-plan-head','.v065-team-plan-body','.v066-drills-hero','.v066-drills-workspace','.v067-settings-hero','.settings-grid','.v067-account-hero','.v067-account-body']:
    if needle not in css: errs.append(f'missing responsive/design marker: {needle}')
for needle in ['await DP.ensure()','await TP.load()','dashboardUpdatePlayers','squadNeedsAttention','squadBalanceSummary','squadAbilityHtml']:
    if needle not in js: errs.append(f'missing dashboard real-data/action hook: {needle}')
refs=ROOT/'docs/design/reference/v060'
for name in ['approved-home-desktop.webp','approved-home-mobile.webp','approved-login-landing-desktop.webp','approved-squad-desktop.webp','approved-squad-desktop-v2.webp','approved-player-profile-desktop.webp','approved-team-plan-desktop.webp','approved-player-profile-desktop.webp','approved-training-desktop.webp','approved-drills-desktop.webp','approved-settings-desktop.webp']:
    p=refs/name
    if not p.is_file() or p.stat().st_size<1000: errs.append(f'missing approved reference: {name}')
for needle in [
    '@media (pointer:coarse) and (min-width:1024px) and (max-width:1180px)',
    '@media (orientation:portrait) and (max-width:699px) and (pointer:coarse)',
    '@media (orientation:portrait) and (max-width:460px) and (pointer:coarse)',
    'v0.6.12 — Browser QA + true portrait viewport fit',
    'main{width:100%!important;max-width:none!important;zoom:1!important;transform:none!important',
    '@media (orientation:portrait) and (min-width:700px) and (max-width:900px) and (pointer:coarse)',
    '.scanner-workspace{grid-template-columns:1fr!important;overflow-x:visible!important}',
    '.v066-drills-workspace{grid-template-columns:1fr!important;overflow-x:visible!important}'
]:
    if needle not in css: errs.append(f'missing v0.6.12 browser-QA/portrait-fit marker: {needle}')
for needle in [
    'v0.6.13 — Home design fidelity pass',
    '.dashboard-workspace{grid-template-columns:.92fr 1.12fr 1.08fr;grid-template-areas:',
    '.bottom-nav,.bottom-nav-five{grid-template-columns:repeat(5,minmax(0,1fr))!important}',
    '.v060-home-hero .hero-secondary{display:flex!important',
    '.home-search-shortcut',
    '.more-drawer-backdrop'
]:
    if needle not in css: errs.append(f'missing v0.6.13 Home fidelity marker: {needle}')
for needle in ['home-hero-desktop-v0615.webp','home-hero-mobile-v0615.webp']:
    if needle not in html: errs.append(f'missing v0.6.15 Home hero reference: {needle}')
for name in ['home-hero-desktop-v0615.webp','home-hero-mobile-v0615.webp']:
    p=ROOT/'assets/v060/scenes'/name
    if not p.is_file() or p.stat().st_size<20000: errs.append(f'missing v0.6.15 Home production asset: {name}')
for needle in ['homeSearchShortcut','moreNavButton','dashboardWatchTour','Performance Insights','Run Scan']:
    if needle not in html: errs.append(f'missing v0.6.13 Home UI hook: {needle}')
harness=ROOT/'tests/offline_browser_viewport_audit.py'
if not harness.is_file(): errs.append('missing offline real-Chromium viewport harness')
else:
    h=harness.read_text(encoding='utf-8')
    for needle in ["page.set_content(html", "has_touch=profile['touch']", "expected_nav", "about:blank", "URLBlocklist=['*']"]:
        if needle not in h: errs.append(f'offline Chromium harness missing marker: {needle}')
if errs:
    print('FAIL v0.6.15 design contract')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS v0.6.15 design contract: corrected approved Home visual-system baseline + Squad overlay and real-Chromium responsive QA preserved')
