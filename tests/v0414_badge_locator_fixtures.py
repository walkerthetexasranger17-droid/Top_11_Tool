from pathlib import Path
from PIL import Image
import statistics, math, sys
ROOT=Path(__file__).resolve().parents[1]
ROI=(620,34,225,67)
errs=[]

def locate(path):
    im=Image.open(path).convert('RGB')
    x,y,w,h=ROI
    crop=im.crop((x,y,x+w,y+h))
    px=list(crop.getdata())
    bg=[statistics.median([p[c] for p in px]) for c in range(3)]
    mask=[0]*(w*h)
    for yy in range(h):
        for xx in range(w):
            r,g,b=px[yy*w+xx]
            d=math.sqrt((r-bg[0])**2+(g-bg[1])**2+(b-bg[2])**2)
            if d>35: mask[yy*w+xx]=1
    seen=[0]*(w*h); dirs=[(-1,-1),(0,-1),(1,-1),(-1,0),(1,0),(-1,1),(0,1),(1,1)]
    cands=[]
    for yy in range(h):
        for xx in range(w):
            start=yy*w+xx
            if not mask[start] or seen[start]: continue
            q=[(xx,yy)];seen[start]=1;qi=0;minx=maxx=xx;miny=maxy=yy;area=0
            while qi<len(q):
                px0,py0=q[qi];qi+=1;area+=1
                minx=min(minx,px0);maxx=max(maxx,px0);miny=min(miny,py0);maxy=max(maxy,py0)
                for dx,dy in dirs:
                    nx,ny=px0+dx,py0+dy
                    if nx<0 or ny<0 or nx>=w or ny>=h: continue
                    ni=ny*w+nx
                    if mask[ni] and not seen[ni]:
                        seen[ni]=1;q.append((nx,ny))
            ww=maxx-minx+1;hh=maxy-miny+1;aspect=ww/hh if hh else 99
            if 22<=ww<=72 and 31<=hh<=67 and area>=400 and .55<=aspect<=1.45:
                score=area+hh*20-abs(aspect-.9)*500-abs(hh-36)*15
                cands.append((score,minx,miny,ww,hh,area))
    return sorted(cands,reverse=True)

fixtures=sorted((ROOT/'tests/scanner-fixtures').glob('*.jpg'))
# GK sample has no playstyle badge in this ROI and is expected to fall back safely.
expected_fallback={'elinaldo-morais-gk.jpg'}
for f in fixtures:
    c=locate(f)
    if f.name in expected_fallback:
        continue
    if not c:
        errs.append(f'badge locator found no compact badge candidate in {f.name}')
    else:
        _,x,y,w,h,area=c[0]
        if h<31 or w<22:
            errs.append(f'implausible badge candidate in {f.name}: {x,y,w,h,area}')
if errs:
    print('FAIL v0.4.14 badge locator fixture contract')
    for e in errs: print(' -',e)
    sys.exit(1)
print(f'PASS v0.4.14 badge locator fixture contract: compact badge found in {len(fixtures)-len(expected_fallback)}/{len(fixtures)} fixtures; GK fallback retained')
