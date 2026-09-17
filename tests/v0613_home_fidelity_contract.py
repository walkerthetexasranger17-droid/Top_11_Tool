from pathlib import Path
from bs4 import BeautifulSoup
import sys
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'css/v060.css').read_text(encoding='utf-8')
app=(ROOT/'js/app.js').read_text(encoding='utf-8')
soup=BeautifulSoup(html,'html.parser')
errs=[]
hero=soup.select_one('#page-dashboard .v060-home-hero')
if not hero: errs.append('Home cinematic hero missing')
else:
    style=hero.get('style','')
    for name in ['home-hero-desktop.webp','home-hero-mobile.webp']:
        if name not in style: errs.append(f'Home hero does not reference {name}')
for text in ['Get started','Watch tour','Recent Players','Training Builder','Team Plan Snapshot','Performance Insights','Quick Actions']:
    if text.lower() not in soup.get_text(' ',strip=True).lower(): errs.append(f'Home approved section/action missing: {text}')
nav=[x.get_text(' ',strip=True) for x in soup.select('.bottom-nav .nav-btn:not(.nav-desktop-only)')]
if nav!=['Home','Squad','Training','Team Plan','More']: errs.append(f'touch navigation is not approved five-item structure: {nav}')
for sel in ['.nav-desktop-only[data-go="my-drills"]','.nav-desktop-only[data-go="settings"]','#moreDrawerBackdrop','#homeSearchShortcut']:
    if not soup.select_one(sel): errs.append(f'missing shell fidelity hook: {sel}')
for needle in ['grid-template-areas:"recent training plan" "recent insight actions"','grid-template-areas:"recent training" "recent plan" "insight actions"','repeat(4,minmax(0,1fr))!important','.hero-secondary{display:flex!important']:
    if needle not in css: errs.append(f'missing approved Home responsive composition marker: {needle}')
for needle in [".slice(0,4).map",'dashboard-stat-player-art','dashboardWatchTour','homeSearchShortcut']:
    if needle not in app: errs.append(f'missing Home runtime/data hook: {needle}')
if errs:
    print('FAIL v0.6.13 Home fidelity contract')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS v0.6.13 Home fidelity contract: approved hero/header/card composition and desktop/touch navigation structure present')
