#!/usr/bin/env python3
from pathlib import Path
import sys
from playwright.sync_api import sync_playwright
sys.path.insert(0,str(Path(__file__).resolve().parent))
from offline_browser_viewport_audit import OfflineBundle
ROOT=Path(__file__).resolve().parents[1]
bundle=OfflineBundle(ROOT); html=bundle.build_html(); errs=[]
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'])
    context=browser.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True)
    page=context.new_page(); page.set_content(html,wait_until='load',timeout=30000)
    page.wait_for_function("() => !document.body.classList.contains('booting') && window.TE5 && window.TE5.AppNav",timeout=15000)
    bundle.patch_dynamic_assets(page)
    geom=page.evaluate("""()=>{const R=s=>{const r=document.querySelector(s).getBoundingClientRect();return {l:r.left,r:r.right,t:r.top,b:r.bottom,w:r.width,h:r.height,c:(r.left+r.right)/2}};return {brand:R('.brand-wordmark'),main:R('.brand-wordmark-main'),tool:R('.brand-wordmark-tool'),ver:R('.brand-sub'),home:R('.home-hero-branding'),font:getComputedStyle(document.body).fontFamily}}""")
    for key in ('main','tool','ver'):
        if abs(geom[key]['c']-geom['brand']['c'])>1.25: errs.append(f'header {key} not centred in wordmark: {geom}')
    if geom['main']['r']>geom['brand']['r']+1: errs.append(f'header TOP ELEVEN overflows brand box: {geom}')
    if geom['home']['l']>20.5: errs.append(f'Home brand is not upper-left: {geom["home"]}')
    if 'Barlow Condensed' not in geom['font']: errs.append(f'global app type is not Barlow Condensed: {geom["font"]}')

    page.evaluate("()=>window.TE5.AppNav.go('squad',{historyMode:'replace',scroll:false})"); page.wait_for_timeout(180); bundle.patch_dynamic_assets(page)
    squad=page.evaluate("""()=>{const R=s=>{const e=document.querySelector(s); if(!e)return null; const r=e.getBoundingClientRect();return {l:r.left,r:r.right,t:r.top,b:r.bottom,w:r.width,h:r.height}};return {title:R('#page-squad .page-brand-heading'),actions:R('#page-squad .squad-management-actions'),workspace:R('#page-squad .squad-workspace'),stats:document.querySelectorAll('#page-squad .squad-stat-grid').length}}""")
    if squad['stats']!=0: errs.append('retired Squad stat grid still renders')
    if not squad['title'] or squad['title']['r']>388: errs.append(f'Squad branded title clips viewport: {squad["title"]}')
    if not squad['actions'] or squad['actions']['t']>330: errs.append(f'Squad action row not pulled upward: {squad["actions"]}')
    if squad['workspace']['t']-squad['actions']['b']>16: errs.append(f'excess gap between actions and roster: {squad}')

    for route in ['add-player','training','my-drills','team-plan','account','settings']:
        page.evaluate("r=>window.TE5.AppNav.go(r,{historyMode:'replace',scroll:false})",route); page.wait_for_timeout(80)
        box=page.evaluate("()=>{const e=document.querySelector('.page.active .page-brand-heading');if(!e)return null;const r=e.getBoundingClientRect();return {l:r.left,r:r.right,t:r.top,b:r.bottom}}")
        if not box: errs.append(f'{route}: branded title missing')
        elif box['r']>389: errs.append(f'{route}: branded title clips viewport: {box}')
    context.close();browser.close()
if errs:
    print('FAIL v0.6.27 mobile browser refinement contract')
    for e in errs: print('-',e)
    raise SystemExit(1)
print('PASS v0.6.27 mobile browser: centred header sub-lines, unclipped wordmarks/titles, upper-left Home brand, compact Squad flow')
