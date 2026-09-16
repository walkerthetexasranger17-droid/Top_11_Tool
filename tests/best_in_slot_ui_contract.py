from pathlib import Path
import re, sys
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
app=(ROOT/'js/app.js').read_text(encoding='utf-8')
sw=(ROOT/'sw.js').read_text(encoding='utf-8')
engine=(ROOT/'js/best-in-slot-engine.js').read_text(encoding='utf-8')
errs=[]; checks=0
def ck(cond,msg):
    global checks
    checks+=1
    if not cond: errs.append(msg)
for ident in ['bestInSlotSection','bestInSlotFormation','bestInSlotPitch','bestInSlotPlan','bestInSlotCoverage','bestInSlotGrid','bestInSlotNote']:
    ck(f'id="{ident}"' in html,f'missing Best-in-Slot UI node {ident}')
ck('Long-term squad goal' in html,'missing long-term goal label')
ck('Best-in-Slot XI' in html,'missing Best-in-Slot title')
ck(html.index('id="bestInSlotSection"') < html.index('id="squadCoverageCard"'),'Best-in-Slot goal is not directly below the current Formation area')
ck('./js/best-in-slot-data.js?r=0517' in html,'Best-in-Slot data script not loaded')
ck('./js/best-in-slot-engine.js?r=0517' in html,'Best-in-Slot engine script not loaded')
ck(html.index('best-in-slot-data.js')<html.index('best-in-slot-engine.js')<html.index('app.js?r=0517'),'Best-in-Slot load order is wrong')
for asset in ['./js/best-in-slot-data.js','./js/best-in-slot-engine.js']:
    ck(asset in sw,f'{asset} missing from service-worker precache')
ck('async function renderBestInSlotGoal(existingPlayers=null)' in app,'Best-in-Slot renderer missing')
ck('showTeamPlanEmpty(players){await renderBestInSlotGoal(players);' in app,'goal does not render independently for incomplete squads')
ck('renderFormationFromPlan(plan){const players=await P.all();await renderBestInSlotGoal(players);' in app,'goal not rendered alongside current Match Ready formation')
ck('No proven open-play SA preference' in app,'unresolved SA comparative effects are not shown honestly')
ck('Role-valid SA choices:' in app,'eligible alternatives are not exposed for unresolved SA preference')
ck('Top Eleven Tool long-term goal, not a hidden Nordeus formula.' in app,'companion-model disclaimer missing')
ck('No player attributes or OVR are used here' in app,'Best-in-Slot still implies player attributes/OVR are used')
ck('S-tier shape:' not in app and 'A-tier support:' not in app,'old attribute-shape UI remains')
ck("F.options(formationSlot).includes(role)" in engine,'engine does not validate slot role against formation definition')
# Goal generation remains static; current squad data is used only by the separate gap/coverage overlay.
section=app[app.index('async function renderBestInSlotGoal'):app.index('function renderSquadCoverage')]
ck('BIS?.squadGap?.(players,goal)' in section,'current-squad gap overlay missing')
ck('currentTeamPlan' not in section,'Best-in-Slot goal improperly depends on current Match Ready plan')
ck('Natural roles + Playstyles + Special Abilities only' in section,'gap overlay does not disclose its stat-free boundary')
ck('identity gaps' in section and 'SA SLOTS FULL' in section and 'IDENTITY MISMATCH' in section,'gap overlay does not separate identity/capacity gaps from trainable development')
ck('roleMean' not in section and 'roleFloor' not in section,'gap overlay leaked player skill scoring')
if errs:
    print(f'FAIL Best-in-Slot UI contract — {len(errs)}/{checks}')
    for e in errs: print('-',e)
    sys.exit(1)
print(f'PASS Best-in-Slot UI contract — {checks} assertions')
