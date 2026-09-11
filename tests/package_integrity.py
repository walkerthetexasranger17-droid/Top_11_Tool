from pathlib import Path
import json,re,sys
ROOT=Path(__file__).resolve().parents[1]
errs=[]
sw=(ROOT/'sw.js').read_text()
m=re.search(r'const ASSETS=(\[.*?\]);',sw,re.S)
if not m:
    errs.append('could not parse service worker ASSETS')
    assets=[]
else:
    assets=json.loads(m.group(1))
for rel in assets:
    p=ROOT/rel.lstrip('./')
    if not p.is_file() or p.stat().st_size==0:
        errs.append(f'service-worker asset missing/empty: {rel}')
required={
    './index.html','./manifest.json','./icon-192.png','./icon-512.png','./css/app.css',
    *{f'./js/{p.name}' for p in (ROOT/'js').glob('*.js')},
    *{f'./assets/{p.relative_to(ROOT/"assets").as_posix()}' for p in (ROOT/'assets').rglob('*') if p.is_file()},
    *{f'./data/build_30527/{p.name}' for p in (ROOT/'data/build_30527').glob('*.json')},
}
missing=sorted(required-set(assets))
if missing: errs.append('runtime files not precached: '+', '.join(missing))
extra=sorted(set(assets)-required)
# Extra runtime cache entries are okay only if they exist; docs are intentionally not precached.
manifest=json.loads((ROOT/'manifest.json').read_text())
if manifest.get('name')!='Top Eleven Tool': errs.append('manifest name must be Top Eleven Tool')
if manifest.get('short_name')!='Top Eleven Tool': errs.append('manifest short_name must be Top Eleven Tool')
for icon in manifest.get('icons',[]):
    if not (ROOT/icon['src'].lstrip('./')).is_file(): errs.append(f'manifest icon missing: {icon["src"]}')
if errs:
    print('FAIL package integrity')
    for e in errs: print('-',e)
    sys.exit(1)
print(f'PASS package integrity: {len(assets)} precached runtime files; {len(required)} required runtime files')
