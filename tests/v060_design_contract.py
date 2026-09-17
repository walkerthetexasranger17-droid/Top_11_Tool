from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'css/v060.css').read_text(encoding='utf-8')
js=(ROOT/'js/app.js').read_text(encoding='utf-8')
errs=[]
for needle in ['css/v060.css?r=0607','dashboardRecentPlayers','dashboardTrainingStats','dashboardPlanSnapshot','dashboardInsight','dashboardUpdatePlayers','v060-home-hero','v062-squad-hero','squadSearch','squadPlaystyleFilter','squadAbilityFilter','squadSort','v063-profile-hero','profileDevelopmentInsight','profileRoleScores','profileSkills','v064-training-hero','trainingPlayer','trainingMode','buildSessionBtn','trainingResults','sessionList','sessionSummary','completeSessionBtn','v065-team-plan-head','teamPlanFormationPanel','teamPlanSetPiecesPanel','teamPlanTacticsPanel','mentorStrip','mentorLevels','v066-drills-hero','drillLibrarySearch','drillLibraryCategory','drillSummaryUnlocked','drillSummaryMaster','v067-settings-hero','geminiScannerApiKey','localSquadStatus','v067-account-hero','accountMfaStatus']:
    if needle not in html: errs.append(f'missing v0.6 Home hook: {needle}')
for needle in ['@media (min-width:1024px)','@media (min-width:700px) and (max-width:1023px)','@media (max-width:699px)','--v6-sidebar:214px','.dashboard-workspace','.auth-gate::before','.squad-workspace','.squad-player-row','.v063-profile-hero','.profile-panel','.skill-track','.v064-training-hero','.v064-training-setup','.training-setup-card','.v064-training-results','.v065-team-plan-head','.v065-team-plan-body','.v066-drills-hero','.v066-drills-workspace','.v067-settings-hero','.settings-grid','.v067-account-hero','.v067-account-body']:
    if needle not in css: errs.append(f'missing responsive/design marker: {needle}')
for needle in ['await DP.ensure()','await TP.load()','dashboardUpdatePlayers','squadNeedsAttention','squadBalanceSummary','squadAbilityHtml']:
    if needle not in js: errs.append(f'missing dashboard real-data/action hook: {needle}')
refs=ROOT/'docs/design/reference/v060'
for name in ['approved-home-desktop.webp','approved-home-mobile.webp','approved-login-landing-desktop.webp','approved-squad-desktop.webp','approved-squad-desktop-v2.webp','approved-player-profile-desktop.webp','approved-team-plan-desktop.webp','approved-player-profile-desktop.webp','approved-training-desktop.webp','approved-drills-desktop.webp','approved-settings-desktop.webp']:
    p=refs/name
    if not p.is_file() or p.stat().st_size<1000: errs.append(f'missing approved reference: {name}')
if errs:
    print('FAIL v0.6.7 design contract')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS v0.6.7 design contract: responsive shell + production Squad + Player Profile + Training + Team Plan + Drills + Settings/Account layouts/assets and approved references packaged')
