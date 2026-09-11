from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
js=(ROOT/'js/app.js').read_text()
html=(ROOT/'index.html').read_text()
css=(ROOT/'css/app.css').read_text()
errs=[]
checks=[
 ('player-swipe',js+css,'swipe wrapper'),('player-delete-action',js+css,'swipe delete action'),('confirmDialogBackdrop',js+html,'delete confirmation dialog'),
 ('history.pushState',js,'history push'),("addEventListener('popstate'",js,'popstate back handler'),('UI_STATE_KEY',js,'refresh UI state'),("✓ Successfully refreshed",js,'refresh toast'),
 ('drawer-backdrop',html+css,'left drawer'),('drawerNav',js+html,'drawer route generation'),('finishDrawerSwipe',js,'drawer swipe-away'),
 ('QUEUE_DB_NAME',js,'IndexedDB queue image persistence'),('SCAN_QUEUE_META_KEY',js,'queue metadata persistence'),('SCAN_RETRY_BACKOFF_MS=[10000,20000,45000,90000,120000]',js,'progressive retry backoff'),
 ('RETRYING GEMINI 3.8 AUTOMATICALLY',js,'repeat-until-success status'),('scheduleQueueRetryTimer',js,'delayed retry scheduler'),('SCANNER_POOL_TEMPORARY',js,'temporary pool error handling'),
 ('RETRYING AUTOMATICALLY',js,'auto-retry status'),('SCAN FAILED',js,'actual scan failure status'),
]
for needle,src,label in checks:
    if needle not in src: errs.append(f'missing {label}: {needle}')
# Ensure player profile is a contextual page and not a drawer main item.
if 'id="page-player" data-page="player" data-nav-label=' in html: errs.append('contextual Player Profile should not be a main drawer item')
# No invented standalone Tactics route; Team Plan owns tactics in current architecture.
if 'data-page="tactics"' in html: errs.append('invented standalone Tactics page')
if 'data-nav-label="Team Plan · Tactics"' not in html: errs.append('Team Plan/Tactics drawer label missing')
# Existing bottom nav must stay unchanged.
for label in ['Home','Squad','Team Plan','Training','More']:
    if f'<span>{label}</span>' not in html: errs.append(f'bottom nav lost {label}')
if errs:
    print('FAIL navigation/queue contract')
    for e in errs: print('-',e)
    sys.exit(1)
print(f'PASS navigation/queue contract: {len(checks)} targeted hooks + route invariants')
