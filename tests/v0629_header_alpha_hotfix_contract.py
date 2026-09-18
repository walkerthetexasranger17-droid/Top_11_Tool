#!/usr/bin/env python3
from pathlib import Path
from bs4 import BeautifulSoup
from PIL import Image
import sys
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
    p=ROOT/'assets/v0629/headers'/name
    if not p.exists(): errs.append(f'missing header asset {name}'); continue
    im=Image.open(p).convert('RGBA')
    if im.size!=(1774,887): errs.append(f'{name} wrong canvas {im.size}')
    a=im.getchannel('A')
    if a.getextrema()[0] != 0: errs.append(f'{name} has no transparent pixels')
    for xy in [(0,0),(1773,0),(0,886),(1773,886)]:
        if a.getpixel(xy) != 0: errs.append(f'{name} corner {xy} is not transparent')
    node=soup.select_one(f'#page-{route} img.page-header-art')
    if not node: errs.append(f'{route} page header image missing')
    else:
        src=node.get('src','')
        if src != f'./assets/v0629/headers/{name}': errs.append(f'{route} uses wrong header: {src}')
        if src.endswith('.png'): errs.append(f'{route} still references PNG header')

top=ROOT/'assets/v0629/headers/topbar.webp'
if not top.exists(): errs.append('topbar artwork missing')
else:
    im=Image.open(top).convert('RGBA')
    if im.getchannel('A').getpixel((0,0)) != 0: errs.append('topbar corner is not transparent')
if not soup.select_one('.topbar .brand-wordmark-image[src="./assets/v0629/headers/topbar.webp"]'):
    errs.append('top bar does not use v0.6.29 wide WebP wordmark')
if not soup.select_one('.topbar .brand-sub') or 'v0.6.29' not in soup.select_one('.topbar .brand-sub').get_text():
    errs.append('live v0.6.29 version missing beneath topbar art')
home=soup.select_one('#page-dashboard img.page-header-art-home')
if not home or home.get('src')!='./assets/v0629/headers/home.webp': errs.append('Home does not use v0.6.29 stacked header asset')
if '.png' in ''.join(n.get('src','') for n in soup.select('img.page-header-art, .brand-wordmark-image')):
    errs.append('a converted header still references .png')
if soup.select_one('#page-player img.page-header-art'): errs.append('Player Profile must remain excluded from header conversion')
if 'width:360px!important' not in css or 'width:350px!important' not in css: errs.append('stacked Home sizing rules missing')
if "const CACHE='te-v0-6-29-header-alpha-hotfix'" not in sw: errs.append('wrong service-worker cache')
for name in ['topbar.webp','home.webp']:
    if f'./assets/v0629/headers/{name}' not in sw: errs.append(f'{name} not install-precached')
for name in ['squad.webp','training.webp','team-plan.webp','drills.webp','settings.webp','add-player.webp','manager-profile.webp']:
    if f'./assets/v0629/headers/{name}' in sw: errs.append(f'{name} should runtime-cache, not inflate install precache')
if errs:
    print('FAIL v0.6.29 header alpha hotfix contract')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS v0.6.29 header alpha hotfix: WebP wiring, transparent corners, stacked Home, separate topbar and bounded cache strategy verified')
