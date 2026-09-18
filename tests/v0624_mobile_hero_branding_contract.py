#!/usr/bin/env python3
from pathlib import Path
import hashlib,re,sys
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'css/v060.css').read_text(encoding='utf-8')
errs=[]
# Branding master and derived icons.
expected={
 'assets/v0624/branding/top-eleven-tool-logo.png':'1c48ed011a46583d039445cca5554045a8640d56fabe69d063be2f7e0407b23a',
 'icon-192.png':'f80534ad3b914346078a7e6efbc1256ab393169fa765b1d1097b194b7653a529',
 'icon-512.png':'0273b9dc61628ad22f1c803d75cddede3c7133de46cf57257e9990cb0ba696bb',
}
for rel,h in expected.items():
 p=ROOT/rel
 if not p.exists(): errs.append(f'missing {rel}'); continue
 got=hashlib.sha256(p.read_bytes()).hexdigest()
 if got!=h: errs.append(f'{rel} hash changed: {got}')
# Home is image-only, Squad has functional title only.
for banned in ['Your squad.','Your plan.','Your next win.','Same Game.','Smarter Managers.','A stronger tomorrow.','Analyse.</span><span>Improve.</span><span>Win.','Train Smarter.','Your Tool. <em>Your Rules.</em>','Plan smarter.','Play stronger.','Win together.','LEAD.<br>SAVE.<br><em>WIN.</em>']:
 if banned in html: errs.append(f'legacy/motivational hero copy survived: {banned}')
if '<h1>Squad <em>Management</em></h1>' not in html: errs.append('Squad functional title missing')
if 'v0624-page-title' not in html: errs.append('v0.6.24 Squad title hook missing')
# Seam/haze removal + compact mobile stage.
required=[
 'v0.6.24 — Mobile hero cleanup + approved tactics-board branding',
 'filter:none!important',
 'content:none!important',
 'height:250px!important;min-height:250px!important',
 'margin-top:-14px!important',
]
for x in required:
 if x not in css: errs.append(f'missing CSS contract: {x}')
if 'data-runtime="0.6.24"' not in html: errs.append('runtime marker not 0.6.24')
if errs:
 print('FAIL v0.6.24 mobile hero/branding contract')
 for e in errs: print('-',e)
 sys.exit(1)
print('PASS v0.6.24 mobile hero/branding contract')
