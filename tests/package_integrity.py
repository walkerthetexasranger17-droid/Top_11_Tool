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
# v0.6.18 keeps the install-time precache bounded while adding the 14 lightweight Squad position badges. Large scanner references,
# mentor art and other feature assets are still packaged and are runtime-cached on demand.
required={
    './index.html','./manifest.json','./icon-192.png','./icon-512.png','./css/app.css','./css/v060.css',
    *{f'./js/{p.name}' for p in (ROOT/'js').glob('*.js')},
    *{f'./assets/{p.relative_to(ROOT/"assets").as_posix()}' for d in ('brands','icons','scenes','roles','drills') for p in (ROOT/'assets'/d).rglob('*') if p.is_file()},
}
missing=sorted(required-set(assets))
if missing: errs.append('core runtime files not precached: '+', '.join(missing))
scanner_eager=sorted(a for a in assets if a.startswith('./assets/scanner/'))
if scanner_eager: errs.append(f'bulk scanner references must be runtime-cached, not install-precached ({len(scanner_eager)} found)')
precache_bytes=sum((ROOT/a.lstrip('./')).stat().st_size for a in assets if (ROOT/a.lstrip('./')).is_file())
if len(assets)>120: errs.append(f'install precache unexpectedly large: {len(assets)} files')
if precache_bytes>6_200_000: errs.append(f'install precache unexpectedly large: {precache_bytes} bytes')
# Scanner reference packs remain part of the package even though they are no longer eagerly cached.
for rel in ('assets/scanner/reference-manifest.json','assets/scanner/compact-reference-manifest.json'):
    p=ROOT/rel
    if not p.is_file() or p.stat().st_size==0: errs.append(f'scanner runtime manifest missing/empty: {rel}')
manifest=json.loads((ROOT/'manifest.json').read_text())
if manifest.get('name')!='Top Eleven Tool': errs.append('manifest name must be Top Eleven Tool')
if manifest.get('short_name')!='Top Eleven Tool': errs.append('manifest short_name must be Top Eleven Tool')
for icon in manifest.get('icons',[]):
    if not (ROOT/icon['src'].lstrip('./')).is_file(): errs.append(f'manifest icon missing: {icon["src"]}')
if errs:
    print('FAIL package integrity')
    for e in errs: print('-',e)
    sys.exit(1)
print(f'PASS package integrity: {len(assets)} core precache files / {precache_bytes} bytes; scanner references runtime-cached')
