from pathlib import Path
import hashlib, json, re, sys

ROOT=Path(__file__).resolve().parents[1]
VERSION='0.6.20'
DECISION_VERSION='0.5.17'
MODEL='companion-strategy-v2-own-squad-runtime-v0515'  # scoring/calibration deliberately unchanged from v0.5.15
errs=[]

html=(ROOT/'index.html').read_text(encoding='utf-8')
app=(ROOT/'js/app.js').read_text(encoding='utf-8')
cloud=(ROOT/'js/cloud.js').read_text(encoding='utf-8')
sw=(ROOT/'sw.js').read_text(encoding='utf-8')
strategy_logic=(ROOT/'js/strategy-logic.js').read_text(encoding='utf-8')
strategy_bundle=(ROOT/'js/strategy-data.js').read_text(encoding='utf-8')
logic_path=ROOT/'data/build_30527/index/decision_logic_v2.json'
strings_path=ROOT/'data/build_30527/index/strategy_strings_v2.json'
manifest_path=ROOT/'data/build_30527/index/decision_logic_v2_manifest.json'
logic=json.loads(logic_path.read_text(encoding='utf-8'))
strings=json.loads(strings_path.read_text(encoding='utf-8'))
manifest=json.loads(manifest_path.read_text(encoding='utf-8'))

if f'data-runtime="{VERSION}"' not in html: errs.append('index runtime marker is not release version')
if f'v{VERSION}' not in html: errs.append('visible HTML does not expose release version')
if f"window.__TE_RUNTIME__='{VERSION}'" not in app: errs.append('app runtime marker is not release version')
if "const CACHE='te-v0-6-20-squad-finish'" not in sw: errs.append('service-worker cache is not v0.6.20 Squad compact nationality cache')
if '?r=0620' not in html: errs.append('v0.6.18 cache-buster missing')
for q in re.findall(r'(?:src|href)="([^\"]+\?r=([^\"]+))"', html):
    if q[1] != '0620': errs.append(f'stale runtime query marker: {q[0]}')
if '?build=0.6.20' not in (ROOT/'START_APP.ps1').read_text(encoding='utf-8'): errs.append('PowerShell launcher build marker is stale')
if 'Top Eleven Tool v0.6.20' not in (ROOT/'START_APP.bat').read_text(encoding='utf-8'): errs.append('Windows launcher title is stale')
if "runtime:'0.6.20'" not in cloud: errs.append('cloud ready diagnostic runtime is stale')

if logic.get('version')!=f'v{DECISION_VERSION}': errs.append('canonical decision contract version changed during design branch')
if logic.get('model')!=MODEL: errs.append('canonical decision model fingerprint changed unexpectedly')
if not str(logic.get('status','')).startswith(f'RELEASE-FROZEN v{DECISION_VERSION}'): errs.append('canonical decision contract is not release-frozen')
if strings.get('version')!=f'v{DECISION_VERSION}': errs.append('strategy strings decision version changed')
if manifest.get('version')!=f'v{DECISION_VERSION}': errs.append('decision manifest version changed')
if not str(manifest.get('status','')).startswith(f'RELEASE-FROZEN v{DECISION_VERSION}'): errs.append('decision manifest is not release-frozen')

prefix='(()=>{const TE=window.TE5=window.TE5||{};TE.StrategyData='
suffix=';})();'
if not strategy_bundle.startswith(prefix) or not strategy_bundle.rstrip().endswith(suffix):
    errs.append('strategy-data browser wrapper has unexpected shape')
else:
    raw=strategy_bundle[len(prefix):].strip()
    raw=raw[:-len(suffix)]
    try: bundled=json.loads(raw)
    except Exception as e: errs.append(f'strategy-data browser bundle JSON is invalid: {e}')
    else:
        if bundled!=logic: errs.append('canonical decision JSON and browser strategy-data bundle differ')

if f"const MODEL_VERSION='{MODEL}';" not in strategy_logic:
    errs.append('strategy runtime model fingerprint does not match unchanged calibrated contract')

for name,path in [('decision_logic_v2.json',logic_path),('strategy_strings_v2.json',strings_path)]:
    raw=path.read_bytes(); rec=manifest.get('files',{}).get(name,{})
    if rec.get('sha256')!=hashlib.sha256(raw).hexdigest(): errs.append(f'{name} manifest SHA-256 mismatch')
    if rec.get('bytes')!=len(raw): errs.append(f'{name} manifest byte count mismatch')

for doc in ['START_HERE.md','DESIGN_RECOVERY_HANDOFF_v0.6.20.md','docs/continuity/CURRENT_STATE.md']:
    text=(ROOT/doc).read_text(encoding='utf-8')
    if 'v0.6.20' not in text: errs.append(f'{doc} does not identify v0.6.20 design branch')

root_handoff=(ROOT/'CALIBRATION_RECOVERY_HANDOFF_v0.5.17.md').read_bytes()
mirror_handoff=(ROOT/'docs/continuity/CALIBRATION_RECOVERY_HANDOFF_v0.5.17.md').read_bytes()
if root_handoff!=mirror_handoff: errs.append('root and continuity v0.5.17 handoffs are not byte-identical')
if b'**Status:** RELEASE-FROZEN TACTIC UI-LABEL HOTFIX' not in root_handoff: errs.append('embedded v0.5.17 handoff is not release-frozen')

if errs:
    print('FAIL v0.6.20 design/runtime identity contract')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS v0.6.20 design/runtime identity: UI/runtime/cache synchronized; v0.5.17 decision contract and v0.5.15 scoring fingerprint preserved')
