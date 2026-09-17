from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'css/v060.css').read_text(encoding='utf-8')
sw=(ROOT/'sw.js').read_text(encoding='utf-8')
errs=[]
for path in ['assets/v060/scenes/squad-hero-mobile.webp','assets/v060/scenes/squad-hero-desktop.webp']:
    if not (ROOT/path).exists(): errs.append(f'missing Squad hero asset: {path}')
if 'class="squad-hero-media"' not in html: errs.append('Squad hero does not use direct picture media')
if 'squad-hero-mobile.webp' not in html: errs.append('mobile Squad hero source missing')
if 'squad-hero-desktop.webp' not in html: errs.append('desktop Squad hero source missing')
if "--hero:url('./assets/v060/scenes/squad-hero-desktop.webp')" in html: errs.append('fragile Squad CSS custom-property hero survived')
if '.v062-squad-hero>.squad-hero-media' not in css: errs.append('Squad hero picture layout CSS missing')
if 'background-image:linear-gradient(90deg,rgba(2,9,18,.95),rgba(2,9,18,.57) 46%,rgba(2,9,18,.08) 82%)!important' not in css: errs.append('mobile Squad hero readability overlay missing')
if "const CACHE='te-v0-6-21-squad-hero-hotfix'" not in sw: errs.append('v0.6.21 service-worker cache marker missing')
if errs:
    print('FAIL v0.6.21 Squad hero hotfix contract')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS v0.6.21 Squad hero hotfix contract: direct responsive picture, packaged hero assets and mobile overlay present')
