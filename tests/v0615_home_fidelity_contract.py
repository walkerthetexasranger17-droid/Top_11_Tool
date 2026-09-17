from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'css/v060.css').read_text(encoding='utf-8')
errs=[]
for needle in [
    'data-runtime="0.6.15"','assets/v0615/home/home-hero-desktop.webp','assets/v0615/home/home-hero-mobile.webp',
    'homeSearchShortcut','dashboardWatchTour','dashboardStats','dashboardRecentPlayers',
    'dashboardTrainingStats','dashboardPlanSnapshot','dashboardInsight','dashboardUpdatePlayers'
]:
    if needle not in html: errs.append(f'missing Home fidelity hook: {needle}')
for needle in [
    'v0.6.15 — Corrective Home fidelity pass',
    '.v060-home-hero{height:410px!important',
    '.v060-dashboard-body{margin-top:-63px!important',
    'grid-template-areas:"recent training plan" "recent insight actions"',
    'v0.6.15 mobile reference fidelity',
    'grid-template-areas:"recent training" "recent plan" "insight actions"',
    '.v060-home-hero .hero-actions{display:grid!important;grid-template-columns:1fr!important',
]:
    if needle not in css: errs.append(f'missing v0.6.15 visual-system marker: {needle}')
for name in ['home-hero-desktop.webp','home-hero-mobile.webp']:
    p=ROOT/'assets/v0615/home'/name
    if not p.is_file() or p.stat().st_size<50000: errs.append(f'missing/undersized production hero: {name}')
for name in ['06-card-tech-pattern.svg','07-hero-green-underline.svg','08-stat-players.svg','09-stat-avg-ovr.svg','10-stat-highest-ovr.svg','11-stat-training.svg','12-training-builder-icon.svg','13-team-plan-icon.svg','14-performance-icon.svg','15-quick-actions-icon.svg','16-action-add-player.svg','17-action-update-players.svg','18-action-run-scan.svg','19-nav-home.svg','20-nav-squad.svg','21-nav-training.svg','22-nav-team-plan.svg','23-nav-more.svg','24-sidebar-drills.svg','25-sidebar-settings.svg','26-header-cloud.svg','27-header-search.svg','28-watch-tour-play.svg','29-arrow-right.svg','30-chevron-right.svg','31-trend-up.svg','32-focus-attacking.svg','33-focus-wide.svg','34-focus-set-pieces.svg','35-manager-avatar-placeholder.svg','training-builder-bg.webp','performance-insights-bg.webp','team-plan-pitch.webp']:
    p=ROOT/'assets/v0615/home'/name
    if not p.is_file(): errs.append(f'missing final Home production asset: {name}')
refs=ROOT/'docs/design/reference/v060'
for name in ['approved-home-desktop.webp','approved-home-mobile.webp']:
    if not (refs/name).is_file(): errs.append(f'missing approved Home reference: {name}')
if errs:
    print('FAIL v0.6.15 corrected Home fidelity contract')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS v0.6.15 corrected Home fidelity contract: approved header/hero/stat overlap/dense dashboard/mobile two-column composition present')
