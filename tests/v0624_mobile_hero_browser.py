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
    grids={}
    for name,media,hero,grid in [
      ('dashboard','.home-hero-media','.v060-home-hero','.dashboard-stat-grid'),
      ('squad','.squad-hero-media','.v062-squad-hero','.squad-stat-grid')]:
        page.evaluate("p=>window.TE5.AppNav.go(p,{historyMode:'replace',scroll:false})",name); page.wait_for_timeout(250); bundle.patch_dynamic_assets(page)
        page.evaluate("()=>{document.documentElement.scrollTop=0;document.body.scrollTop=0;window.scrollTo(0,0)}"); page.wait_for_timeout(80)
        d=page.evaluate("([m,h,g])=>{const R=s=>{const e=document.querySelector(s),r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:r.height}}; return {media:R(m),hero:R(h),grid:R(g)}}",[media,hero,grid])
        grids[name]=d['grid']['top']
        if abs(d['media']['top']-66)>0.6: errs.append(f'{name}: media top {d["media"]["top"]}')
        if d['media']['bottom']<843: errs.append(f'{name}: media does not fill viewport')
        if abs(d['hero']['height']-250)>0.6: errs.append(f'{name}: hero height {d["hero"]["height"]}')
        if abs(d['grid']['top']-302)>1.1: errs.append(f'{name}: first stats Y {d["grid"]["top"]}')
        before=page.evaluate("s=>document.querySelector(s).getBoundingClientRect().top",media)
        page.evaluate("()=>scrollTo(0,180)"); page.wait_for_timeout(50)
        after=page.evaluate("s=>document.querySelector(s).getBoundingClientRect().top",media)
        if abs(after-before)>0.5: errs.append(f'{name}: fixed background moved {before}->{after}')
    if abs(grids['dashboard']-grids['squad'])>0.6: errs.append(f'grid alignment mismatch {grids}')
    page.evaluate("p=>window.TE5.AppNav.go(p,{historyMode:'replace',scroll:false})",'dashboard'); page.wait_for_timeout(120)
    if page.locator('#page-dashboard .hero-copy').count()!=0: errs.append('Home hero copy still exists')
    page.evaluate("p=>window.TE5.AppNav.go(p,{historyMode:'replace',scroll:false})",'squad'); page.wait_for_timeout(120)
    title=page.locator('#page-squad .v0625-page-title h1').inner_text().strip().replace('\n',' ')
    if title!='SQUAD MANAGEMENT': errs.append(f'Squad title unexpected: {title}')
    styles=page.evaluate("()=>{const h=document.querySelector('#page-squad .v062-squad-hero'); const b=getComputedStyle(h); const p=getComputedStyle(h,'::before'); return {borderBottom:b.borderBottomWidth,pseudoDisplay:p.display,pseudoContent:p.content}}")
    if styles['borderBottom']!='0px': errs.append(f'Squad hero border survives: {styles}')
    context.close(); browser.close()
if errs:
    print('FAIL v0.6.25 mobile hero browser contract')
    for e in errs: print('-',e)
    raise SystemExit(1)
print('PASS v0.6.25 browser: compact aligned hero rhythm, full fixed backgrounds, no Home copy, functional Squad title, no hero seam')
