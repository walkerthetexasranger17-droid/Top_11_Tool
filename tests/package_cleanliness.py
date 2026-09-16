from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
errs=[]
for p in ROOT.rglob('*'):
    if not p.is_file(): continue
    n=p.name.lower()
    rel=p.relative_to(ROOT).as_posix()
    if '.pre_' in n or n.endswith(('.tmp','.bak','.orig','.old')):
        errs.append(f'superseded scratch/backup file remains: {rel}')
    if p.suffix.lower() in {'.rar','.7z','.tar','.gz'}:
        errs.append(f'embedded archive remains: {rel}')
# Scanner fixtures and current runtime references intentionally dominate the remaining package.
size=sum(p.stat().st_size for p in ROOT.rglob('*') if p.is_file())
count=sum(1 for p in ROOT.rglob('*') if p.is_file())
if size>27_000_000: errs.append(f'package expanded above maintenance ceiling: {size} bytes')
if count>750: errs.append(f'package file count expanded above maintenance ceiling: {count}')
required=[
 'CALIBRATION_RECOVERY_HANDOFF_v0.5.17.md',
 'docs/continuity/CALIBRATION_RECOVERY_HANDOFF_v0.5.17.md',
 'V0517_DEV_PASS10_VALIDATION.md',
 'assets/scanner/reference-manifest.json',
 'assets/scanner/compact-reference-manifest.json',
]
for rel in required:
    if not (ROOT/rel).is_file(): errs.append(f'required recovery/runtime file missing: {rel}')
if errs:
    print('FAIL package cleanliness')
    for e in errs: print('-',e)
    sys.exit(1)
print(f'PASS package cleanliness: {count} files / {size} bytes; no pre-edit/scratch/archive baggage')
