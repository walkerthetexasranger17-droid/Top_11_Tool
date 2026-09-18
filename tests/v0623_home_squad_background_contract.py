from pathlib import Path
from PIL import Image
import hashlib,sys,re
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'css/v060.css').read_text(encoding='utf-8')
app=(ROOT/'js/app.js').read_text(encoding='utf-8')
errs=[]
assets={
 'assets/v0623/backgrounds/home-mobile.png':'f817904e80c2a02e56aca76804c7929d295d65f5ff787eb006c04df4e75081d8',
 'assets/v0623/backgrounds/squad-mobile.png':'630e3a10f583928435c033305b17b31ab8ad9b5995927384fee781aaed37b4f2',
}
for rel,sha in assets.items():
 p=ROOT/rel
 if not p.exists(): errs.append(f'missing approved background: {rel}'); continue
 if hashlib.sha256(p.read_bytes()).hexdigest()!=sha: errs.append(f'approved background changed: {rel}')
 try:
  im=Image.open(p)
  if im.size!=(941,1672): errs.append(f'wrong approved background dimensions for {rel}: {im.size}')
 except Exception as e: errs.append(f'unreadable background {rel}: {e}')
for needle,label in [
 ('./assets/v0623/backgrounds/home-mobile.png','Home approved picture source'),
 ('./assets/v0623/backgrounds/squad-mobile.png','Squad approved picture source'),
 ('v0.6.23 — Approved full-screen Home + Squad backgrounds','v0.6.23 CSS contract'),
 ('height:calc(100dvh - var(--v623-hero-top,66px))!important','full viewport anchored art'),
 ('#page-dashboard .v060-home-hero,\n  #page-squad .v062-squad-hero{\n    height:390px!important;','shared portrait hero stage'),
 ('squad-inline-position-badge','compact inline Squad position badge'),
]:
 if needle not in (html+css+app): errs.append(f'missing {label}')
if re.search(r'background-attachment\s*:\s*fixed\s*;',css,re.I): errs.append('forbidden background-attachment:fixed returned')
if '<img class="squad-inline-position-badge"' not in app: errs.append('Squad row renderer does not place compact position badge after age')
if errs:
 print('FAIL v0.6.23 Home + Squad approved background contract')
 for e in errs: print('-',e)
 sys.exit(1)
print('PASS v0.6.23 Home + Squad approved backgrounds: exact images, full-viewport anchored art, matched page rhythm, compact inline position badge')
