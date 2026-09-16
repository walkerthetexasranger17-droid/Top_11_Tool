from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
app=(ROOT/'js/app.js').read_text(encoding='utf-8')
scanner=(ROOT/'js/scanner-engine.js').read_text(encoding='utf-8')
players=(ROOT/'js/players.js').read_text(encoding='utf-8')
html=(ROOT/'index.html').read_text(encoding='utf-8')

checks=[]
def need(cond,msg):
    checks.append((cond,msg))
    if not cond: print('FAIL',msg)

need('async function scanUpdate(' in scanner,'scanner exposes lightweight scanUpdate path')
need("scannerScope:'existing-player-name-match-age-skills-native-resolution-v2'" in scanner,'update scanner has explicit auto-name-match + age/skills scope')
m=re.search(r"function updateResponseSchema\(layout='outfield'\)\{(.+?)\n  function playstyleIdentityResponseSchema",scanner,re.S)
need(bool(m),'update response schema found')
if m:
    block=m.group(1)
    need('name:{' in block,'update schema requests visible name for matching')
    need('ovr:{' not in block,'update schema does not request OVR')
    need('roles:{' not in block,'update schema does not request roles')
    need('playstyle' not in block.lower(),'update schema does not request Playstyle')
    need('special' not in block.lower(),'update schema does not request Special Abilities')
need('The saved name itself must never be changed.' in scanner,'update prompt limits name to matching only')
need('DO NOT read or return OVR, roles, Playstyle or Special Abilities' in scanner,'update prompt excludes all non-name identity fields')
need("function normalisePlayerName" in players and "function matchPlayerByName" in players,'player module exposes deterministic name matcher')
need("matchPlayerByName" in app,'update queue matches detected name against My Squad automatically')
need("saveAutomaticUpdate" in app,'automatic update has direct save path')
need("scope:'age-skills-only-auto-name-match-write-verified'" in app,'automatic save records narrow write-verified mutation provenance')
need('P.updateAgeSkillsOnly(target.key' in app,'automatic update uses dedicated age + skills persistence API')
need('data-queue-update-target' not in app,'manual per-screenshot player dropdown is removed')
need('Choose squad player' not in app,'manual player selection copy is removed')
need("status:'queued',statusText:updateOnly?'QUEUED · automatic name match + age + skills'" in app,'bulk update screenshots enter automatic queue immediately')
need("scan=await SC.scanUpdate" in app,'update queue uses lightweight scanner')
need("state.scanQueue.splice(idx,1)" in app,'successful automatic update removes screenshot from queue')
need("item.autoAttempts<2" in app,'automatic name/verification failure gets one automatic retry before stopping')
need("P.normaliseRoles(target).includes('GK')" in app,'automatic updater checks screenshot layout against matched saved role')
need("updateScanSafeForAutoSave" in app and "allowWarnings:true" in app,'automatic save uses deterministic scanner verification without blanket warning veto')
need('sameUpdateCandidate' in app and 'second independent read' in app,'uncertain clean scans require matching independent second read before automatic save')
need('writeReadbackVerified:true' in app,'automatic save records write/read-back verification')
need('changedFields' in app and 'already current' in app,'automatic queue reports whether persisted values actually changed')
need('updateAgeSkillsOnly' in players and 'Automatic update write verification failed' in players,'player persistence API re-reads and verifies the stored age/skills')
need("needs-match" in app,'unsafe or unmatched names stop safely rather than guessing')
need('id="squadBulkUpdateBtn"' in html,'Squad exposes bulk update queue entry point')
need('id="manualEntryNote"' in html and "manualNote.style.display='none'" in app,'update mode hides add-player manual-entry hint')
need(html.find('id="masterStockConfig"') < html.find('id="normalDrillConfig"'),'Master card stock renders above normal drills')

if not all(x for x,_ in checks):
    raise SystemExit(1)
print(f'PASS automatic player update contract: {sum(x for x,_ in checks)} assertions')
