#!/usr/bin/env python3
from pathlib import Path
import hashlib,re,sys
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'css/v060.css').read_text(encoding='utf-8')
errs=[]
# Branding master and derived icons.
expected={
 'assets/v0624/branding/top-eleven-tool-logo.png':'8b09477d11447c9577e99e251c1139e9afc68660d0f6a0b7c913473d9fd1e536',
 'icon-192.png':'48fd43ec1aba1cf1666d57e07585be5dccae0183d21091ccf5557c2a0358c863',
 'icon-512.png':'3ae9eb8f2d8d3a6ecc21dbe279c40468a43ecf1000662899898fa5594a07d043',
}
for rel,h in expected.items():
 p=ROOT/rel
 if not p.exists(): errs.append(f'missing {rel}'); continue
 got=hashlib.sha256(p.read_bytes()).hexdigest()
 if got!=h: errs.append(f'{rel} hash changed: {got}')
# Home is image-only, Squad has functional title only.
# This contract intentionally scopes itself to the v0.6.24/v0.6.25 approved Home + Squad baseline.
# Later pages are redesigned one-by-one in subsequent passes and are not validated here.
if '<h1>Squad <em>Management</em></h1>' not in html: errs.append('Squad functional title missing')
if 'v0625-page-title' not in html: errs.append('v0.6.25 Squad title hook missing')
# Seam/haze removal + compact mobile stage.
required=[
 'v0.6.25 — Mobile hero cleanup + approved tactics-board branding',
 'filter:none!important',
 'content:none!important',
 'height:250px!important;min-height:250px!important',
 'margin-top:-14px!important',
]
for x in required:
 if x not in css: errs.append(f'missing CSS contract: {x}')
if 'data-runtime="0.6.25"' not in html: errs.append('runtime marker not 0.6.25')
if errs:
 print('FAIL v0.6.25 mobile hero/branding contract')
 for e in errs: print('-',e)
 sys.exit(1)
print('PASS v0.6.25 mobile hero/branding contract')
