from pathlib import Path
from PIL import Image
import sys,re
ROOT=Path(__file__).resolve().parents[1]
errs=[]
app=(ROOT/'js/app.js').read_text(encoding='utf-8')
players=(ROOT/'js/players.js').read_text(encoding='utf-8')
scanner=(ROOT/'js/scanner-engine.js').read_text(encoding='utf-8')
css=(ROOT/'css/v060.css').read_text(encoding='utf-8')
html=(ROOT/'index.html').read_text(encoding='utf-8')
positions=['gk','dl','dc','dr','dml','dmc','dmr','ml','mc','mr','aml','amc','amr','st']
for pos in positions:
    path=ROOT/'assets/positions'/f'{pos}.png'
    if not path.exists(): errs.append(f'missing position badge: {pos}')
    else:
        try:
            im=Image.open(path)
            if im.mode!='RGBA': errs.append(f'{pos} badge is not transparent RGBA')
        except Exception as e: errs.append(f'{pos} badge unreadable: {e}')
for role in ['gk','d','dm','m','am','st']:
    if not (ROOT/'assets/roles'/f'{role}.webp').exists(): errs.append(f'missing role artwork: {role}')
for needle,label in [
    ("window.__TE_RUNTIME__='0.6.22'",'current runtime marker'),
    ('function nationalityFlag(code)','nationality flag renderer'),
    ('squad-nationality-flag','Squad nationality flag markup'),
    ('positionBadgeAsset(role)','glossy position badge use'),
    ('playstyleIcon(ps,p.playstyle)','authoritative Playstyle image use'),
    ('squadAbilityHtml(p)','authoritative Special Ability image use'),
]:
    if needle not in app: errs.append(f'missing {label}')
if 'id="scanNationality"' not in html: errs.append('scanner review nationality field missing')
for needle,label in [
    ('function normaliseNationalityCode(value)','player nationality normaliser'),
    ('nationalityCode:normaliseNationalityCode','player nationality persistence'),
    ('const NATIONALITY_EXTENSION_VERSION=1','isolated scanner nationality extension'),
    ('nationalityFlag:{x:680,y:385,w:135,h:105}','scanner nationality flag ROI'),
    ('nationalityCode:canonicalNationalityCode','scanner nationality normalization'),
    ('infer nationality from the player name','scanner no-name-inference instruction'),
]:
    src=players if 'player nationality' in label else scanner
    if needle not in src: errs.append(f'missing {label}')
if 'const VERSION=12;' not in scanner: errs.append('frozen scanner calibration VERSION changed; nationality must be an extension only')
if 'v0.6.19 — Compact mobile Squad + nationality' not in css: errs.append('v0.6.19 compact Squad CSS marker missing')
for needle,label in [
    ('min-height:66px!important;height:66px!important','compact 66px portrait row'),
    ('.squad-playstyle-copy,.squad-cell-playstyle>.squad-muted{display:none!important}','mobile Playstyle text hidden'),
    ('.squad-ability b,.squad-cell-abilities>.squad-muted{display:none!important}','mobile Special Ability text hidden'),
    ('.squad-ability:nth-child(n+3){display:none!important}','compact max-two SA image treatment'),
]:
    if needle not in css: errs.append(f'missing {label}')
# No star UI is allowed in the v0.6.19 Squad row renderer.
row=re.search(r"if\(list\)list\.innerHTML=filtered\.length\?filtered\.map\(\(p,i\)=>\{(.*?)\}\)\.join",app,re.S)
if row and '★' in row.group(1): errs.append('star rating leaked into Squad row')
if errs:
    print('FAIL v0.6.19 compact Squad + nationality contract')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS v0.6.19 compact Squad + nationality contract: compact row, new role art/badges, flags, icon-only Playstyle/SA, scanner nationality extension')
