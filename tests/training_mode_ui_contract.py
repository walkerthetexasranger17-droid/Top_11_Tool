from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8'); app=(ROOT/'js/app.js').read_text(encoding='utf-8'); eng=(ROOT/'js/training-engine.js').read_text(encoding='utf-8')
checks=[]
def ck(v,m): checks.append((bool(v),m))
ck('value="maxGrowth">Max Growth' in html,'Max Growth option preserved')
ck('value="balancedDevelopment">Balanced Development' in html,'Balanced Development option exposed')
ck('value="conditionEfficient">Condition Efficient' in html,'Condition Efficient option preserved')
ck('Balanced Development deliberately spreads useful work across more weak white skills and distinct drills' in html,'Balanced mode explanation visible')
ck("mode==='balancedDevelopment'" in eng and 'BALANCED_BEAM_WIDTH=1000' in eng,'training engine contains explicit balanced mode/deeper beam')
ck("balanced-weak-coverage-then-variety-then-utility" in eng,'balanced objective is explicit in metadata')
ck("mode.value=state.session.meta.mode" in app,'restored session synchronises the visible training-mode selector')
ck("$('#trainingMode')?.addEventListener('change'" in app and 'Training mode changed. Build a fresh 6-drill session.' in app,'changing mode clears stale rendered recommendation')
ck("result.meta.mode==='balancedDevelopment'?'Balanced Development'" in app,'training status reports actual selected mode')
failed=[m for ok,m in checks if not ok]
if failed:
 print(f'FAIL training mode UI contract — {len(failed)}/{len(checks)}')
 for m in failed: print('-',m)
 raise SystemExit(1)
print(f'PASS training mode UI contract — {len(checks)} assertions')
