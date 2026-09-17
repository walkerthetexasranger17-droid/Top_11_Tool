from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
app=(ROOT/'js/app.js').read_text(encoding='utf-8')
css=(ROOT/'css/v060.css').read_text(encoding='utf-8')
errs=[]
if 'class="squad-filter-panel"' in html: errs.append('Squad filter panel still present')
if 'value="role-order">Role Order (GK → ST)' not in html: errs.append('Role Order sort option missing')
expected="const roleOrder=['GK','DL','DC','DR','DMC','ML','MC','MR','AML','AMC','AMR','ST'];"
if expected not in app: errs.append('Role Order sequence is not the approved GK-to-ST sequence')
if "'DML'" in expected or "'DMR'" in expected: errs.append('invalid DML/DMR roles present in approved role order')
if "'role-order':(a,b)=>roleRank(a)-roleRank(b)" not in app: errs.append('Role Order comparator missing')
if 'squad-workspace squad-workspace-no-filters' not in html: errs.append('full-width no-filter Squad workspace missing')
if '.squad-workspace.squad-workspace-no-filters{grid-template-columns:minmax(0,1fr)!important}' not in css: errs.append('full-width Squad roster CSS missing')
if '.topbar{display:flex!important;position:sticky!important;top:0!important;z-index:80!important}' not in css: errs.append('mobile/tablet header visibility guard missing')
# Compact v0.6.19 row contract must remain intact.
for needle in ['min-height:66px!important;height:66px!important','.squad-playstyle-copy,.squad-cell-playstyle>.squad-muted{display:none!important}', '.squad-ability b,.squad-cell-abilities>.squad-muted{display:none!important}']:
    if needle not in css: errs.append(f'compact Squad row regression: {needle}')
if errs:
    print('FAIL v0.6.20 Squad finishing contract')
    for e in errs: print('-',e)
    sys.exit(1)
print('PASS v0.6.20 Squad finishing contract: filters removed, approved Role Order added, header guarded, compact row preserved')
