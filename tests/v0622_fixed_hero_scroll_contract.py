from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
css=(ROOT/'css/v060.css').read_text(encoding='utf-8')
html=(ROOT/'index.html').read_text(encoding='utf-8')
errs=[]
checks=[
    ('v0.6.22 — Anchored cinematic hero scroll treatment','v0.6.22 CSS marker'),
    ('#page-dashboard.active .home-hero-media','Home anchored hero selector'),
    ('#page-squad.active .squad-hero-media','Squad anchored hero selector'),
    ('position:fixed!important','fixed hero media positioning'),
    ('#page-squad.active .v062-squad-body{margin-top:-28px!important}','Squad card overlap hand-off'),
    ('background-attachment:fixed','forbidden old mobile fixed-background mechanism'),
]
for needle,label in checks[:-1]:
    if needle not in css: errs.append(f'missing {label}')
import re
if re.search(r'background-attachment\s*:\s*fixed\s*;', css, re.I): errs.append('background-attachment:fixed declaration must not be used for mobile PWA hero anchoring')
for needle,label in [
    ('class="home-hero-media"','Home real picture element'),
    ('class="squad-hero-media"','Squad real picture element'),
    ('./assets/v0623/backgrounds/home-mobile.png','Home current mobile hero asset'),
    ('./assets/v0623/backgrounds/squad-mobile.png','Squad current mobile hero asset'),
]:
    if needle not in html: errs.append(f'missing {label}')
if errs:
    print('FAIL v0.6.22 fixed hero scroll contract')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS v0.6.22 fixed hero scroll contract: Home/Squad real hero images anchor under scrolling foreground content without background-attachment:fixed')
