#!/usr/bin/env python3
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'css/v060.css').read_text(encoding='utf-8')
js=(ROOT/'js/app.js').read_text(encoding='utf-8')
sw=(ROOT/'sw.js').read_text(encoding='utf-8')
errs=[]
for needle,label in [
    ('data-runtime="0.6.26"','runtime marker'),
    ('brand-copy brand-wordmark','header wordmark'),
    ('home-hero-branding','Home branded hero overlay'),
    ('home-wordmark-pill">HOME','functional Home pill'),
    ('dashboard-stat-grid dashboard-glance','Today-at-a-glance container'),
    ('squad-management-actions','relocated Squad action row'),
    ('id="squadBulkUpdateBtn"','Squad Update Players action'),
    ('data-go="add-player"','Add Player action'),
]:
    if needle not in html: errs.append(f'missing {label}: {needle}')
if 'squad-hero-actions' in html: errs.append('Squad actions still rendered in hero')
if '<button class="dashboard-stat"' in js: errs.append('legacy four Home stat cards still rendered')
for needle,label in [
    ('Today at a glance','glance label'),
    ('dashboard-glance-metric','glance metrics'),
    ('Training opportunities','training metric'),
]:
    if needle not in js: errs.append(f'missing {label}: {needle}')
for needle,label in [
    ('--v626-photo-tint:rgba(1,10,19,.15)','global photo tint token'),
    ('--v626-photo-filter:brightness(.86) saturate(.91) contrast(1.02)','photo tone filter'),
    ('.home-hero-branding','Home branding styles'),
    ('.dashboard-stat-grid.dashboard-glance','glance bar styles'),
    ('.squad-management-actions','Squad action styles'),
]:
    if needle not in css: errs.append(f'missing {label}: {needle}')
if "const CACHE='te-v0-6-26-branding-tone-actions'" not in sw: errs.append('v0.6.26 service-worker cache marker missing')
if errs:
    print('FAIL v0.6.26 branding/tone/action contract')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS v0.6.26 branding/tone/action contract: wordmark + Home glance + photo tone + relocated Squad actions')
