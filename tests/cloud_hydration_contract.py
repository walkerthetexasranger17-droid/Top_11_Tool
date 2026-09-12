from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
cloud=(ROOT/'js/cloud.js').read_text()
app=(ROOT/'js/app.js').read_text()
html=(ROOT/'index.html').read_text()
sw=(ROOT/'sw.js').read_text()
errs=[]
if 'getDocsFromServer(col)' not in cloud: errs.append('initial cloud hydration is not server-first')
if "if(authoritative)for(const key of localSyncedKeys())if(!remote.has(key))localDelRaw(key)" not in cloud: errs.append('local-key deletion is not guarded by authoritative server hydration')
if "const authoritative=!snap.metadata?.fromCache" not in cloud: errs.append('live snapshot does not distinguish cache from server')
if "if(c.type==='removed'){if(authoritative)" not in cloud: errs.append('cached live snapshot can still remove local data')
if 'ownerChanged&&!authoritative' not in cloud: errs.append('offline account switch can expose the previous account local mirror')
if "window.__TE_RUNTIME__='0.4.11-r3'" not in app: errs.append('runtime marker missing from app.js')
if 'data-runtime="0.4.11-r3"' not in html: errs.append('runtime marker missing from index.html')
if '?r=0411r3' not in html: errs.append('runtime assets are not cache-busted')
if "const CACHE='te-v0-4-11-r3'" not in sw: errs.append('service-worker cache is not r3')
if errs:
    print('FAIL cloud hydration contract')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS cloud hydration contract')
