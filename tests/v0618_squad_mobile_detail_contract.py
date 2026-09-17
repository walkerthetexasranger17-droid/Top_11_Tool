from pathlib import Path
from PIL import Image
import sys
ROOT=Path(__file__).resolve().parents[1]
errs=[]
app=(ROOT/'js/app.js').read_text(encoding='utf-8')
css=(ROOT/'css/v060.css').read_text(encoding='utf-8')
sw=(ROOT/'sw.js').read_text(encoding='utf-8')
positions=['gk','dl','dc','dr','dml','dmc','dmr','ml','mc','mr','aml','amc','amr','st']
for pos in positions:
    path=ROOT/'assets/positions'/f'{pos}.png'
    if not path.exists(): errs.append(f'missing position badge: {pos}')
    else:
        try:
            im=Image.open(path)
            if im.mode!='RGBA': errs.append(f'{pos} badge is not RGBA/transparent')
            if im.width<200 or im.height<120: errs.append(f'{pos} badge unexpectedly small: {im.size}')
        except Exception as e: errs.append(f'{pos} badge unreadable: {e}')
    if f'./assets/positions/{pos}.png' not in sw: errs.append(f'{pos} badge missing from service worker precache')
for role in ['gk','d','dm','m','am','st']:
    path=ROOT/'assets/roles'/f'{role}.webp'
    if not path.exists(): errs.append(f'missing role artwork: {role}')
if 'function positionBadgeAsset(pos)' not in app: errs.append('positionBadgeAsset helper missing')
if 'positionBadgeAsset(role)' not in app: errs.append('Squad row does not use position badge assets')
if 'playstyleIcon(ps,p.playstyle)' not in app: errs.append('Squad row does not use authoritative Playstyle artwork')
if 'squadAbilityHtml(p)' not in app: errs.append('Squad row does not render Special Ability artwork')
if 'v0.6.18 — Mobile Squad detail pass' not in css: errs.append('v0.6.18 Squad CSS marker missing')
if '.squad-playstyle-icon' not in css or '.squad-position-badge' not in css: errs.append('Squad detail image styling missing')
if 'min-height:146px!important' not in css: errs.append('phone Squad rich-row geometry missing')
if "window.__TE_RUNTIME__='0.6.18'" not in app: errs.append('runtime version is not v0.6.18')
if errs:
    print('FAIL v0.6.18 Squad mobile detail contract')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS v0.6.18 Squad mobile detail contract: 14 transparent position badges, richer mobile rows, authoritative Playstyle/SA artwork, new role art')
