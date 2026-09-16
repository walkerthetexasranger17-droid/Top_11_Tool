from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
app=(ROOT/'js/app.js').read_text(encoding='utf-8')
scanner=(ROOT/'js/scanner-engine.js').read_text(encoding='utf-8')
html=(ROOT/'index.html').read_text(encoding='utf-8')

checks=[]
def need(cond,msg):
    checks.append((cond,msg))
    if not cond: print('FAIL',msg)

need('async function scanUpdate(' in scanner,'scanner exposes lightweight scanUpdate path')
need("scannerScope:'existing-player-age-skills-native-resolution-v1'" in scanner,'update scanner has explicit age+skills scope')
# The update schema itself must not request identity fields.
m=re.search(r"function updateResponseSchema\(layout='outfield'\)\{(.+?)\n  function playstyleIdentityResponseSchema",scanner,re.S)
need(bool(m),'update response schema found')
if m:
    block=m.group(1)
    need('name:{' not in block,'update schema does not request player name')
    need('ovr:{' not in block,'update schema does not request OVR')
    need('roles:{' not in block,'update schema does not request roles')
    need('playstyle' not in block.lower(),'update schema does not request Playstyle')
    need('special' not in block.lower(),'update schema does not request Special Abilities')
need("DO NOT read or return name, OVR, roles, Playstyle or Special Abilities" in scanner,'update prompt explicitly forbids identity scan')
need("if(state.scan.updateOnly){if(!existing)throw new Error('Choose an existing squad player for this update')" in app,'existing-player save has dedicated update-only boundary')
need("{...existing,age:x.age,skills:{...state.scan.skills}" in app,'update save mutates existing age + skills from scan')
need("scope:'age-skills-only'" in app,'update provenance records age+skills-only scope')
need('id="squadBulkUpdateBtn"' in html,'Squad exposes bulk update queue entry point')
need('data-queue-update-target' in app,'queue supports per-screenshot existing-player assignment')
need("item.updateOnly&&!item.updateKey?'needs-target':'queued'" in app,'unassigned update screenshots cannot scan before target selection')
need("scan=await SC.scanUpdate" in app,'update queue uses lightweight scanner rather than full scanner')
need("Save Update & Next" in app and "Save Update" in app,'review flow has update-specific save labels')
need(html.find('id="masterStockConfig"') < html.find('id="normalDrillConfig"'),'Master card stock renders above normal drills')

if not all(x for x,_ in checks):
    raise SystemExit(1)
print(f'PASS player update scan contract: {sum(x for x,_ in checks)} assertions')
