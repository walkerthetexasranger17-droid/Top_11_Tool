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
    # Topbar asset must fit without clipping and version stays centered under it.
    top=page.evaluate("""()=>{const R=s=>{const e=document.querySelector(s);const r=e.getBoundingClientRect();return {l:r.left,r:r.right,t:r.top,b:r.bottom,w:r.width,h:r.height,c:(r.left+r.right)/2}};return {brand:R('.brand-wordmark-art'),img:R('.brand-wordmark-image'),ver:R('.brand-wordmark-art .brand-sub')}}""")
    if top['img']['r']>389 or top['img']['l']<0: errs.append(f'topbar wordmark clips viewport: {top}')
    if abs(top['img']['c']-top['ver']['c'])>1.5: errs.append(f'version not centered below topbar art: {top}')
    routes=['dashboard','squad','add-player','training','my-drills','team-plan','account','settings']
    for route in routes:
        page.evaluate("r=>window.TE5.AppNav.go(r,{historyMode:'replace',scroll:false})",route); page.wait_for_timeout(100); bundle.patch_dynamic_assets(page)
        box=page.evaluate("""()=>{const e=document.querySelector('.page.active img.page-header-art');if(!e)return null;const r=e.getBoundingClientRect();return {l:r.left,r:r.right,t:r.top,b:r.bottom,w:r.width,h:r.height,src:e.getAttribute('src')}}""")
        if not box: errs.append(f'{route}: page header art missing'); continue
        if box['l']>22 or box['l']<0: errs.append(f'{route}: header not upper-left: {box}')
        if box['r']>389: errs.append(f'{route}: header art clips viewport: {box}')
        if box['h']<=0 or box['w']<=0: errs.append(f'{route}: header art has zero size: {box}')
    context.close();browser.close()
if errs:
    print('FAIL v0.6.29 mobile header-art browser contract')
    for e in errs: print('-',e)
    raise SystemExit(1)
print('PASS v0.6.29 mobile browser: topbar and all approved page headers render inside the phone viewport')
