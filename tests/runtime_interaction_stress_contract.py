from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
app=(ROOT/'js/app.js').read_text(encoding='utf-8')
css=(ROOT/'css/app.css').read_text(encoding='utf-8')
sw=(ROOT/'sw.js').read_text(encoding='utf-8')
errs=[]
checks=[
 ('pageRenderChain',app,'serialized page render queue'),
 ('request!==pageRenderSeq',app,'latest-wins page render guard'),
 ('if(pageRenderActive){scheduleCloudUiRefresh();return;}',app,'cloud refresh navigation deferral'),
 ("void go(g.dataset.go)",app,'non-blocking delegated navigation'),
 ('realSwipe=Math.abs(dx)>=32',app,'real-swipe click suppression threshold'),
 ('runUiAction',app,'heavy-action lock'),
 ('training-build',app,'training duplicate-build lock'),
 ('queuePlanCalculation',app,'Team Plan calculation queue'),
 ('team-plan-calc',app,'Team Plan action lock'),
 ('pointer-events:none',css,'non-blocking toast'),
 ('touch-action:manipulation',css,'mobile tap hint'),
 ("const CACHE='te-v0-5-17-p11'",sw,'pass-specific service-worker cache'),
]
for needle,src,label in checks:
    if needle not in src: errs.append(f'missing {label}: {needle}')
# Bulk scanner refs must no longer be install-time cached.
if './assets/scanner/playstyles/' in sw or './assets/scanner/special-abilities/' in sw:
    errs.append('bulk scanner image pack is still eagerly precached')
if errs:
    print('FAIL runtime interaction/stability contract')
    for e in errs: print('-',e)
    sys.exit(1)
print(f'PASS runtime interaction/stability contract: {len(checks)} hardening checks')
