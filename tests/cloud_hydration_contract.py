from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
cloud=(ROOT/'js/cloud.js').read_text()
app=(ROOT/'js/app.js').read_text()
html=(ROOT/'index.html').read_text()
css=(ROOT/'css/app.css').read_text()
sw=(ROOT/'sw.js').read_text()
errs=[]
if 'getDocsFromServer(col)' not in cloud: errs.append('initial cloud hydration is not server-first')
if 'deleted:true' not in cloud or 'deleted:false' not in cloud: errs.append('cloud writes do not use explicit tombstones')
if 'if(remote.has(key))continue' not in cloud or 'writeKey(key,value)' not in cloud: errs.append('missing remote keys are not recovered from local data')
if "if(entry.deleted)localDelRaw(key)" not in cloud: errs.append('explicit tombstones are not applied locally')
if 'ownerChanged)for(const key of localSyncedKeys())localDelRaw(key)' not in cloud: errs.append('account switching does not isolate the local mirror')
if "typeof raw==='string'?raw" not in cloud or 'JSON.stringify(raw)' not in cloud: errs.append('legacy object-valued cloud records are not normalised')
if "window.__TE_RUNTIME__='0.4.11-r4'" not in app: errs.append('runtime marker missing from app.js')
if 'data-runtime="0.4.11-r4"' not in html: errs.append('runtime marker missing from index.html')
if '?r=0411r4' not in html: errs.append('runtime assets are not cache-busted')
if "const CACHE='te-v0-4-11-r4'" not in sw: errs.append('service-worker cache is not r4')
if '<body class="booting">' not in html or 'body.booting .app{visibility:hidden}' not in css: errs.append('refresh boot flash guard missing')
if 'te:post-auth:home' not in cloud or 'forceHome' not in app: errs.append('post-login Home landing guard missing')
if "toast('App initialisation failed','err')" in app: errs.append('generic startup failure toast returned')
if errs:
    print('FAIL cloud hydration/navigation contract')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS cloud hydration/navigation contract')
