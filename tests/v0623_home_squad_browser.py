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
 context=browser.new_context(viewport={'width':390,'height':844},has_touch=True)
 page=context.new_page(); page.set_content(html,wait_until='load',timeout=30000)
 page.wait_for_function("() => !document.body.classList.contains('booting') && window.TE5 && window.TE5.AppNav",timeout=15000)
 bundle.patch_dynamic_assets(page)
 grids={}
 for name,media,hero,body,grid in [
  ('dashboard','.home-hero-media','.v060-home-hero','.v060-dashboard-body','.dashboard-stat-grid'),
  ('squad','.squad-hero-media','.v062-squad-hero','.v062-squad-body','.squad-stat-grid')]:
  page.evaluate("p=>window.TE5.AppNav.go(p,{historyMode:'replace',scroll:false})",name); page.wait_for_timeout(300); bundle.patch_dynamic_assets(page)
  page.evaluate("()=>scrollTo(0,0)"); page.wait_for_timeout(30)
  page.evaluate("()=>{document.documentElement.scrollTop=0;document.body.scrollTop=0;window.scrollTo(0,0)}"); page.wait_for_timeout(120)
  d=page.evaluate("([m,h,b,g])=>{const R=s=>{const r=document.querySelector(s).getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:r.height}};return {media:R(m),hero:R(h),body:R(b),grid:R(g)}}",[media,hero,body,grid])
  grids[name]=d['grid']['top']
  if abs(d['media']['top']-66)>0.6: errs.append(f'{name}: fixed background top is {d["media"]["top"]}, expected 66')
  if d['media']['bottom'] < 843: errs.append(f'{name}: background does not reach viewport bottom: {d["media"]}')
  if abs(d['hero']['height']-390)>0.6: errs.append(f'{name}: hero stage not 390px: {d["hero"]}')
  page.evaluate("p=>{const body=document.querySelector('#page-'+p+' .page-body');const s=document.createElement('div');s.id='v0623-scroll-spacer';s.style.height='1400px';body.appendChild(s)}",name)
  before=page.evaluate("s=>document.querySelector(s).getBoundingClientRect().top",media)
  page.evaluate("()=>scrollTo(0,260)"); page.wait_for_timeout(50)
  after=page.evaluate("s=>document.querySelector(s).getBoundingClientRect().top",media)
  if abs(after-before)>0.5: errs.append(f'{name}: background moved while scrolling: {before}->{after}')
  page.evaluate("()=>{document.getElementById('v0623-scroll-spacer')?.remove();document.documentElement.scrollTop=0;document.body.scrollTop=0;window.scrollTo(0,0)}"); page.wait_for_timeout(120)
 if abs(grids['dashboard']-grids['squad'])>0.6: errs.append(f'Home/Squad first stat-row Y mismatch: {grids}')
 context.close(); browser.close()
if errs:
 print('FAIL v0.6.23 Home + Squad browser contract')
 for e in errs: print('-',e)
 raise SystemExit(1)
print('PASS v0.6.23 browser: approved backgrounds fill viewport and stay anchored; Home/Squad stat rows share the same Y position')
