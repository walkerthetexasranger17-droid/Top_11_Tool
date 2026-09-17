#!/usr/bin/env python3
from pathlib import Path
import sys
from playwright.sync_api import sync_playwright
sys.path.insert(0,str(Path(__file__).resolve().parent))
from offline_browser_viewport_audit import OfflineBundle
ROOT=Path(__file__).resolve().parents[1]
bundle=OfflineBundle(ROOT)
html=bundle.build_html()
errs=[]
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'])
    context=browser.new_context(viewport={'width':390,'height':844},has_touch=True)
    page=context.new_page()
    page.set_content(html,wait_until='load',timeout=30000)
    page.wait_for_function("() => !document.body.classList.contains('booting') && window.TE5 && window.TE5.AppNav",timeout=15000)
    bundle.patch_dynamic_assets(page)
    page.evaluate("()=>{document.documentElement.style.scrollBehavior='auto';document.body.style.scrollBehavior='auto'}")
    for page_name,selector in [('dashboard','.home-hero-media'),('squad','.squad-hero-media')]:
        page.evaluate("p=>window.TE5.AppNav.go(p,{historyMode:'replace',scroll:false})",page_name)
        page.wait_for_timeout(300) # pageIn transform must finish; fixed descendants then use viewport CB
        bundle.patch_dynamic_assets(page)
        page.evaluate("()=>scrollTo({top:0,behavior:'instant'})")
        page.evaluate("p=>{const body=document.querySelector('#page-'+p+' .page-body');const s=document.createElement('div');s.id='v0622-scroll-spacer';s.style.height='1500px';body.appendChild(s)}",page_name)
        page.wait_for_timeout(30)
        before=page.evaluate("sel=>{const r=document.querySelector(sel).getBoundingClientRect();return {top:r.top,bottom:r.bottom,scrollY}}",selector)
        page.evaluate("()=>scrollTo({top:260,behavior:'instant'})")
        page.wait_for_timeout(50)
        after=page.evaluate("sel=>{const r=document.querySelector(sel).getBoundingClientRect();return {top:r.top,bottom:r.bottom,scrollY}}",selector)
        if abs(after['top']-before['top'])>0.5 or abs(after['bottom']-before['bottom'])>0.5:
            errs.append(f"{page_name}: hero moved with scroll: before={before}, after={after}")
        if after['scrollY'] < 200:
            errs.append(f"{page_name}: foreground did not actually scroll enough: {after}")
        page.evaluate("()=>document.getElementById('v0622-scroll-spacer')?.remove()")
    context.close();browser.close()
if errs:
    print('FAIL v0.6.22 fixed hero browser scroll contract')
    for e in errs: print('-',e)
    raise SystemExit(1)
print('PASS v0.6.22 fixed hero browser scroll: Home + Squad hero media stayed viewport-anchored while foreground scrolled 260px')
