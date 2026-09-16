from pathlib import Path
from bs4 import BeautifulSoup
import sys
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
app=(ROOT/'js/app.js').read_text(encoding='utf-8')
drill=(ROOT/'js/drill-profile.js').read_text(encoding='utf-8')
cloud=(ROOT/'js/cloud.js').read_text(encoding='utf-8')
soup=BeautifulSoup(html,'html.parser')
errs=[]
# Queue cleanup
if 'state.scanQueue.splice(removedIndex,1)' not in app: errs.append('successful save does not remove queue item')
if "item.status='saved'" in app: errs.append('legacy saved queue state still used')
# Tactic calculator location/content
if not soup.select_one('#teamPlanTacticsPanel #planApproach'): errs.append('Approach not in Tactics')
if not soup.select_one('#teamPlanTacticsPanel #planDrain'): errs.append('Drain limit not in Tactics')
if soup.select_one('#teamPlanFormationPanel #planApproach') or soup.select_one('#teamPlanFormationPanel #planDrain'): errs.append('tactic inputs remain in Formation')
if soup.select_one('#planMode') or soup.select_one('#planMinCondition'): errs.append('removed extra plan inputs remain')
if 'Tactic Calculator' not in html: errs.append('Tactic Calculator label missing')
# Account-specific drills
if "byId[d.drillId]={unlocked:false,level:0}" not in drill: errs.append('new drill profile still assumes captured user levels')
if 'clearUserSetup' not in drill: errs.append('user drill clear/reset missing')
if "'training:normal-drills:'" not in cloud: errs.append('normal drill profile is not cloud synced')
# Dedicated set pieces
for key in ['cornerRight','freeRight','penalty1','freeLeft','cornerLeft','penalty2','penalty3','penalty4','penalty5','captain']:
    if f"['{key}'" not in app: errs.append(f'missing set-piece slot {key}')
if 'set-piece-slot' not in app: errs.append('dedicated set-piece slot renderer missing')
if not soup.select_one('#setPieceCoverageGrid'): errs.append('set-piece automatic coverage visual missing')
if soup.select_one('#setPieceCandidates') or soup.select_one('#setPiecePicker'): errs.append('removed manual set-piece picker survived')
if errs:
    print('FAIL v0.4.12 patch contract')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS v0.4.12 patch contract')
