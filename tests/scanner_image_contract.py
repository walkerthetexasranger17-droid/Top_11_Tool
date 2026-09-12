from pathlib import Path
from PIL import Image
import colorsys, numpy as np
ROOT=Path(__file__).resolve().parents[1]
FIX=ROOT/'tests/scanner-fixtures'
FRAME=(1536,695)
ROLE=(914,158,136,52)
SLOTS=[(1017,216,52,50),(1068,216,52,50),(1119,216,52,50)]

def canonical(name):
    im=Image.open(FIX/name).convert('RGB')
    return im.resize(FRAME,Image.Resampling.LANCZOS) if im.size!=FRAME else im

def blue_role_ratio(im):
    x,y,w,h=ROLE; a=np.asarray(im.crop((x,y,x+w,y+h))).reshape(-1,3)
    coloured=blue=0
    for R,G,B in a:
        h_,s,v=colorsys.rgb_to_hsv(R/255,G/255,B/255); deg=h_*360
        if s>.25 and v>.35:
            coloured+=1
            if 175<=deg<=235: blue+=1
    return blue/coloured if coloured else 0

def slot_metrics(im,roi):
    x,y,w,h=roi; d=np.asarray(im.crop((x,y,x+w,y+h))).astype(float); bw=4
    border=np.concatenate([d[:bw].reshape(-1,3),d[-bw:].reshape(-1,3),d[bw:-bw,:bw].reshape(-1,3),d[bw:-bw,-bw:].reshape(-1,3)])
    bg=np.median(border,axis=0); dist=np.linalg.norm(d-bg,axis=2)
    return float((dist>35).mean()),float((d.mean(axis=2)<85).mean())

gk=canonical('elinaldo-morais-gk.jpg')
out=canonical('matt-prescott-learning-sa.jpg')
assert blue_role_ratio(gk)>.35, f'GK role pill not detected: {blue_role_ratio(gk):.3f}'
assert blue_role_ratio(out)<.1, f'outfield role misdetected as GK: {blue_role_ratio(out):.3f}'
metrics=[slot_metrics(out,r) for r in SLOTS]
assert metrics[0][1]>.25, f'learning widget slot 1 dark fraction too low: {metrics[0]}'
assert metrics[1][1]>.25, f'learning widget spill/progress region not detected: {metrics[1]}'
# first learning slot is therefore 1 and no later region can be treated as an unlocked ability.
print('PASS scanner image contract: GK role colour + learning Special Ability widget detection')
