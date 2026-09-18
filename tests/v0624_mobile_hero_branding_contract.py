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
# v0.6.26 keeps the approved Home/Squad background baseline but adds branded Home presence,
# a subtle tone layer, a single Today-at-a-glance bar, and relocated Squad actions.
if '<h1>Squad <em>Management</em></h1>' not in html: errs.append('Squad functional title missing')
if 'v0625-page-title' not in html: errs.append('Squad title hook missing')
for needle,label in [
 ('home-hero-branding','Home branded hero overlay'),
 ('dashboard-stat-grid dashboard-glance','Home glance bar'),
 ('squad-management-actions','relocated Squad management actions'),
 ('id="squadBulkUpdateBtn"','Squad update action'),
]:
 if needle not in html: errs.append(f'missing {label}')
if 'squad-hero-actions' in html: errs.append('Squad actions still live in the hero')
required=[
 'v0.6.26 — Branding wordmark, calmer backgrounds, Home glance bar',
 'filter:var(--v626-photo-filter)!important',
 'background:var(--v626-photo-tint)!important',
 'height:250px!important;min-height:250px!important',
 'margin-top:-14px!important',
]
for x in required:
 if x not in css: errs.append(f'missing CSS contract: {x}')
if 'data-runtime="0.6.26"' not in html: errs.append('runtime marker not 0.6.26')
if errs:
 print('FAIL v0.6.26 mobile hero/branding contract')
 for e in errs: print('-',e)
 sys.exit(1)
print('PASS v0.6.26 mobile hero/branding contract')
