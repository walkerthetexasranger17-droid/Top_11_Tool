from pathlib import Path
from bs4 import BeautifulSoup
import sys
ROOT=Path(__file__).resolve().parents[1]
js=(ROOT/'js/app.js').read_text(encoding='utf-8');html=(ROOT/'index.html').read_text(encoding='utf-8');css=(ROOT/'css/app.css').read_text(encoding='utf-8');errs=[]
soup=BeautifulSoup(html,'html.parser')
checks=[
 ('player-swipe',js+css,'swipe wrapper'),('player-delete-action',js+css,'swipe delete action'),('confirmDialogBackdrop',js+html,'delete confirmation dialog'),
 ('history.pushState',js,'history push'),("addEventListener('popstate'",js,'popstate back handler'),('UI_STATE_KEY',js,'refresh UI state'),("✓ Successfully refreshed",js,'refresh toast'),
 ('QUEUE_DB_NAME',js,'IndexedDB queue image persistence'),('SCAN_QUEUE_META_KEY',js,'queue metadata persistence'),('scanControllers=new Map()',js,'per-item scan cancellation controllers'),
 ('cancelScanForItem',js,'explicit rescan cancellation'),('Retry Scan',js,'manual retry action'),('SCAN FAILED',js,'failed scan status'),
 ('Arithmetic checks passed',js,'honest arithmetic verification label'),('Review and correct any field before saving.',js,'editable scanner visual-review label'),
 ('scrollToScanReview',js,'review auto-scroll'),('scanUpdateKey',js,'update-existing-player scan route')
]
for needle,src,label in checks:
    if needle not in src: errs.append(f'missing {label}: {needle}')
for forbidden in ['SCAN_RETRY_BACKOFF_MS=[10000,20000,45000,90000,120000]','scheduleQueueRetryTimer','RETRYING GEMINI 3.8 AUTOMATICALLY','drawerNav','finishDrawerSwipe','drawer-backdrop']:
    if forbidden in js+html: errs.append(f'legacy navigation/retry hook survives: {forbidden}')
if soup.select_one('#page-player[data-nav-label]'): errs.append('contextual Player Profile must not be a main nav item')
if soup.select_one('#page-add-player[data-nav-label]'): errs.append('contextual Scanner must not be a main nav item')
nav=[x.get_text(' ',strip=True) for x in soup.select('.bottom-nav .nav-btn')]
if nav!=['Home','Squad','Training','Team Plan','Drills','Settings']: errs.append(f'wrong six-item bottom nav: {nav}')
if soup.select_one('.bottom-nav [data-go="add-player"]'): errs.append('Scanner leaked into bottom nav')
if not soup.select_one('#page-squad .squad-add-primary[data-go="add-player"]'): errs.append('Squad Add Player entry point missing')
for tab in ['formation','set-pieces','tactics']:
    if not soup.select_one(f'[data-team-plan-tab="{tab}"]'): errs.append(f'missing Team Plan tab: {tab}')
for phase in ['possession','transition','out']:
    if not soup.select_one(f'[data-tactic-phase="{phase}"]'): errs.append(f'missing tactics phase: {phase}')
if errs:
    print('FAIL navigation/queue contract')
    for e in errs: print('-',e)
    sys.exit(1)
print(f'PASS navigation/queue contract: six-screen IA + contextual scanner/profile + {len(checks)} queue/navigation hooks')
