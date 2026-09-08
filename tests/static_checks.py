from pathlib import Path
from bs4 import BeautifulSoup
import re,sys
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text()
js=(ROOT/'js/app.js').read_text()
scanner=(ROOT/'js/scanner-engine.js').read_text()
soup=BeautifulSoup(html,'html.parser')
errs=[]
ids=[x.get('id') for x in soup.find_all(id=True)]
for x in sorted(set(ids)):
    if ids.count(x)>1: errs.append(f'duplicate id {x}')
pages={x.get('data-page') for x in soup.select('.page[data-page]')}
for el in soup.select('[data-go]'):
    target=el.get('data-go')
    if target not in pages: errs.append(f'bad data-go {target}')
refs=set(re.findall(r"\$\(['\"]#([A-Za-z0-9_-]+)['\"]\)",js))
missing=sorted(refs-set(ids))
if missing: errs.append('missing DOM ids: '+', '.join(missing))

# Integrity hooks that protect recommendations from stale player/drill data.
for needle,label in [
    ('sourceSnapshot:trainingSourceSnapshot', 'training source snapshot on build'),
    ('sameTrainingSource', 'training source snapshot comparison'),
    ("await S.del(`training:session:${outKey}`)", 'player edit session invalidation'),
    ('invalidateAllSessions', 'drill-library session invalidation')
]:
    hay=(ROOT/'js/app.js').read_text()+(ROOT/'js/players.js').read_text()+(ROOT/'js/drill-profile.js').read_text()
    if needle not in hay: errs.append(f'missing integrity hook: {label}')

# Beta 2 scanner integrity: a detected mismatch must affect saving, not just UI text.
for needle,label,hay in [
    ('reconcileReadToTarget', 'targeted OVR candidate reconciliation', scanner),
    ('save.disabled=unresolved.length>0', 'scanner unresolved save lock', js),
    ('if(!refreshScanVerification())return', 'scanner validation gate before save', js),
    ('data-scan-skill', 'manual parsed-skill correction path', js),
]:
    if needle not in hay: errs.append(f'missing scanner Beta 2 hook: {label}')

# Product/display name must be consistent across the visible shell and PWA metadata.
manifest=__import__('json').loads((ROOT/'manifest.json').read_text())
if manifest.get('name')!='Top Eleven Tool' or manifest.get('short_name')!='Top Eleven Tool': errs.append('manifest app name is not Top Eleven Tool')
if not soup.title or soup.title.get_text(strip=True)!='Top Eleven Tool': errs.append('page title is not Top Eleven Tool')
if 'TOP ELEVEN <span>TOOL</span>' not in html: errs.append('in-app header branding is not Top Eleven Tool')

# Check local static assets referenced by HTML/CSS/JS. Skip remote/data/hash URLs.
paths=set()
for el in soup.find_all(src=True): paths.add(el['src'])
for el in soup.find_all(href=True): paths.add(el['href'])
css=(ROOT/'css/app.css').read_text()
paths.update(re.findall(r"url\(['\"]?([^)'\"]+)",css))
for rel in sorted(paths):
    if rel.startswith(('http:','https:','data:','#')): continue
    rel=rel.split('?')[0].split('#')[0]
    if not rel: continue
    p=(ROOT/rel).resolve() if not rel.startswith('../') else (ROOT/'css'/rel).resolve()
    # CSS refs are relative to css/app.css, HTML refs to root. Resolve CSS ../ correctly when needed.
    if rel.startswith('../assets/'):
        p=(ROOT/'css'/rel).resolve()
    if not p.exists(): errs.append(f'missing asset {rel} -> {p}')
if errs:
    print('FAIL static checks')
    for e in errs: print('-',e)
    sys.exit(1)
print(f'PASS static checks: {len(ids)} ids, {len(pages)} pages, {len(refs)} direct DOM refs, {len(paths)} static paths')
