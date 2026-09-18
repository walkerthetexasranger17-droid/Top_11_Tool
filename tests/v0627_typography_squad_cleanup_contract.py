#!/usr/bin/env python3
from pathlib import Path
from bs4 import BeautifulSoup
import re,sys
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'css/v060.css').read_text(encoding='utf-8')
sw=(ROOT/'sw.js').read_text(encoding='utf-8')
soup=BeautifulSoup(html,'html.parser')
errs=[]

for needle,label in [
    ('data-runtime="0.6.27"','runtime marker'),
    ('brand-copy brand-wordmark','header wordmark'),
    ('home-hero-branding','Home hero brand block'),
    ('home-wordmark-pill">HOME','Home functional pill'),
    ('page-brand-heading','reusable branded page title'),
    ('squad-management-actions','Squad action row'),
]:
    if needle not in html: errs.append(f'missing {label}: {needle}')

# Header brand structure and centering hooks.
for needle,label in [
    ('.brand-copy.brand-wordmark{overflow:visible!important;justify-items:center!important;text-align:center!important}','header wordmark centered block'),
    ('.brand-wordmark-tool{justify-self:center!important;width:94%!important}','centered TOOL line'),
    ('.brand-wordmark .brand-sub{justify-self:center!important;text-align:center!important;width:100%!important','centered version line'),
    ('.brand-wordmark-main{overflow:visible!important;padding-right:.22em!important','final-N clipping guard'),
]:
    if needle not in css: errs.append(f'missing {label}')

# Home branding must be upper-left, not a centred poster.
if '.home-hero-branding{left:20px!important;right:auto!important;top:18px!important;transform:none!important' not in css:
    errs.append('Home hero branding is not anchored upper-left')

# Unified type family for normal UI letters/numbers.
if ':root{--v627-type:"Barlow Condensed","Arial Narrow",sans-serif}' not in css:
    errs.append('v0.6.27 typography token missing')
if 'html,body,button,input,select,textarea,option{font-family:var(--v627-type)!important' not in css:
    errs.append('app-wide typography override missing')

# Branded title system applied to the primary pages in this design set.
expected_titles={
    'page-squad':('SQUAD','MANAGEMENT'),
    'page-add-player':('PLAYER','SCANNER'),
    'page-training':('TRAINING','BUILDER'),
    'page-my-drills':('DRILL','LIBRARY'),
    'page-team-plan':('TEAM','PLAN'),
    'page-account':('MANAGER','PROFILE'),
    'page-settings':('APP','SETTINGS'),
}
for page,(a,b) in expected_titles.items():
    node=soup.select_one(f'#{page} .page-brand-heading')
    if not node: errs.append(f'{page} branded title missing'); continue
    txt=' '.join(node.stripped_strings).upper()
    if a not in txt or b not in txt: errs.append(f'{page} branded title text wrong: {txt}')

# Squad five-card summary must be physically removed, not merely hidden.
for rid in ['squadStatTotal','squadStatAvg','squadStatHigh','squadStatBalance','squadStatNeeds']:
    if soup.find(id=rid): errs.append(f'retired Squad summary id still present: {rid}')
if soup.select_one('#page-squad .squad-stat-grid'):
    errs.append('retired Squad summary grid still present in HTML')
if not soup.select_one('#page-squad .squad-management-actions + .squad-workspace'):
    errs.append('Squad actions do not lead directly into roster workspace')

if "const CACHE='te-v0-6-27-type-title-squad-cleanup'" not in sw:
    errs.append('v0.6.27 service-worker cache marker missing')
if '?r=0627' not in html:
    errs.append('v0.6.27 runtime cache-buster missing')

if errs:
    print('FAIL v0.6.27 typography/Squad cleanup contract')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS v0.6.27 typography/Squad cleanup contract')
