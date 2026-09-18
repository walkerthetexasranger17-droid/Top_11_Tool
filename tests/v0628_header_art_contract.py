#!/usr/bin/env python3
from pathlib import Path
from bs4 import BeautifulSoup
from PIL import Image
import hashlib,sys
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'css/v060.css').read_text(encoding='utf-8')
sw=(ROOT/'sw.js').read_text(encoding='utf-8')
soup=BeautifulSoup(html,'html.parser')
errs=[]
assets={
 'dashboard':'home.webp','squad':'squad.webp','training':'training.webp','team-plan':'team-plan.webp',
 'my-drills':'drills.webp','settings':'settings.webp','add-player':'add-player.webp','account':'manager-profile.webp'
}
for route,name in assets.items():
    p=ROOT/'assets/v0628/headers'/name
    if not p.exists(): errs.append(f'missing header asset {name}'); continue
    im=Image.open(p)
    if im.size!=(1774,887): errs.append(f'{name} wrong canvas {im.size}')
    if 'A' not in im.getbands(): errs.append(f'{name} is not transparent RGBA/WebP')
    node=soup.select_one(f'#page-{route} img.page-header-art')
    if not node: errs.append(f'{route} page header image missing')
    elif name not in node.get('src',''): errs.append(f'{route} uses wrong header: {node.get("src")}')

top=ROOT/'assets/v0628/headers/topbar.webp'
if not top.exists(): errs.append('topbar artwork missing')
else:
    im=Image.open(top)
    if 'A' not in im.getbands(): errs.append('topbar artwork not transparent')
if not soup.select_one('.topbar .brand-wordmark-image[src*="assets/v0628/headers/topbar.webp"]'):
    errs.append('top bar does not use approved image wordmark')
if not soup.select_one('.topbar .brand-sub') or 'v0.6.28' not in soup.select_one('.topbar .brand-sub').get_text():
    errs.append('live v0.6.28 version missing beneath topbar art')
if soup.select_one('#page-player img.page-header-art'):
    errs.append('Player Profile must remain excluded from header conversion')
for needle in ['.page-header-art{','.brand-wordmark-image{','aspect-ratio:2 / 1!important']:
    if needle not in css: errs.append(f'missing v0.6.28 header CSS: {needle}')
if "const CACHE='te-v0-6-28-approved-header-art'" not in sw: errs.append('wrong service-worker cache')
for name in ['topbar.webp','home.webp']:
    if f'./assets/v0628/headers/{name}' not in sw: errs.append(f'{name} not precached')
if errs:
    print('FAIL v0.6.28 approved header art contract')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS v0.6.28 approved header art contract: approved image headers wired, normalised, transparent and precached')
