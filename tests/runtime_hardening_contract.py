from pathlib import Path
import re, sys
from urllib.parse import urljoin, urlparse

ROOT=Path(__file__).resolve().parents[1]
errs=[]
html=(ROOT/'index.html').read_text(encoding='utf-8')
sw=(ROOT/'sw.js').read_text(encoding='utf-8')
cloud=(ROOT/'js/cloud.js').read_text(encoding='utf-8')
app=(ROOT/'js/app.js').read_text(encoding='utf-8')
scanner=(ROOT/'js/scanner-engine.js').read_text(encoding='utf-8')

# Inline scene URLs must remain inside an app hosted at /top-eleven-tool/.
base='https://example.invalid/top-eleven-tool/index.html'
scene_refs=re.findall(r"--hero:url\('([^']+)'\)",html)
if len(scene_refs)!=8: errs.append(f'expected 8 inline hero scene refs, found {len(scene_refs)}')
for ref in scene_refs:
    resolved=urlparse(urljoin(base,ref)).path
    if not resolved.startswith('/top-eleven-tool/assets/scenes/'):
        errs.append(f'hero path escapes app subdirectory: {ref} -> {resolved}')
    local=(ROOT/ref.replace('./','',1)).resolve()
    try: local.relative_to(ROOT.resolve())
    except ValueError: errs.append(f'hero ref resolves outside package: {ref}')
    if not local.exists(): errs.append(f'hero asset missing: {ref}')

# Versioned runtime requests must be able to fall back to unqueried precache entries offline.
if 'caches.match(e.request,{ignoreSearch:true})' not in sw:
    errs.append('service-worker runtime-shell fallback is not query-insensitive')

# Account-originated provider/MFA strings used in HTML must be escaped.
if '${f.displayName}' in cloud or 'data-remove-mfa="${f.uid}"' in cloud:
    errs.append('MFA account data still enters innerHTML unescaped')
for required in ['escHtml(f.displayName)','escHtml(f.uid)','escHtml(p===']:
    if required not in cloud: errs.append(f'missing account HTML escaping marker: {required}')

# Existing scanner UI contract is 0..520; schema and save boundary must enforce it.
if "minimum:0,maximum:520" not in scanner:
    errs.append('Gemini core schema does not enforce 0..520 skill range')
if 'v<0||v>520' not in app or 'outside 0–520' not in app:
    errs.append('scan save boundary does not enforce 0..520 skill range')

# Do not ship syntactically-corrupt exploratory probes as executable .js tests.
if (ROOT/'tests/calibration_probe.js').exists():
    errs.append('obsolete malformed calibration_probe.js is still executable-looking')
if not (ROOT/'tests/archive/calibration_probe.legacy-broken.txt').exists():
    errs.append('archived calibration probe evidence is missing')

if errs:
    print('FAIL runtime hardening contract')
    for e in errs: print('-',e)
    sys.exit(1)
print(f'PASS runtime hardening contract: {len(scene_refs)} subpath-safe heroes; offline query fallback; account escaping; scanner 0..520 boundary; scratch probe archived')
