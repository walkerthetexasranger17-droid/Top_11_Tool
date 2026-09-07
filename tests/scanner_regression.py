from PIL import Image
import numpy as np, cv2, json, os, sys
ROOT=os.path.dirname(os.path.dirname(__file__))
T=json.load(open(os.path.join(ROOT,'js','scanner-templates.json')))
FIX={
'1000009373.jpg':{'type':'gk','ovr':115,'age':23,'gk':[127,159,136,128,141,133,135,137,149,132],'phys':[168,34,42,54,56],'totals':[138,71]},
'1000009375.jpg':{'type':'out','ovr':101,'age':21,'def':[126,205,160,133,184],'att':[49,43,101,38,48],'phys':[124,106,107,65,23],'totals':[161,56,85]},
'1000009376.jpg':{'type':'out','ovr':102,'age':22,'def':[141,204,174,126,178],'att':[19,41,129,33,32],'phys':[120,124,119,64,24],'totals':[165,51,90]},
'1000009377.jpg':{'type':'out','ovr':110,'age':20,'def':[150,160,144,71,164],'att':[80,91,150,77,66],'phys':[153,48,126,126,43],'totals':[138,93,99]},
'1000009378.jpg':{'type':'out','ovr':110,'age':20,'def':[150,160,144,71,164],'att':[80,91,150,77,66],'phys':[153,48,126,126,43],'totals':[138,93,99]},
'1000009379.jpg':{'type':'out','ovr':114,'age':20,'def':[119,151,159,45,120],'att':[217,178,29,129,35],'phys':[155,23,68,181,109],'totals':[119,118,107]},
'1000009380.jpg':{'type':'out','ovr':102,'age':22,'def':[116,113,147,44,115],'att':[181,154,48,114,56],'phys':[134,32,45,132,96],'totals':[107,111,88]},
'1000009381.jpg':{'type':'out','ovr':104,'age':19,'def':[88,83,74,79,60],'att':[124,137,135,143,150],'phys':[136,64,48,117,121],'totals':[77,138,97]},
'1000009382.jpg':{'type':'out','ovr':103,'age':20,'def':[44,40,70,135,42],'att':[169,137,98,137,144],'phys':[154,46,56,133,138],'totals':[66,137,105]},
'1000009384.jpg':{'type':'out','ovr':153,'age':18,'def':[99,102,185,191,115],'att':[178,179,102,180,195],'phys':[119,180,107,187,173],'totals':[138,167,153]},
'1000009419.jpg':{'type':'out','ovr':105,'age':20,'def':[128,163,137,72,152],'att':[66,94,127,55,62],'phys':[144,75,121,133,47],'totals':[130,81,104]},
}
ROWS=[(332+44*i,377+44*i) for i in range(5)]
COL={'def':(675,735),'att':(948,1005),'phys':(1220,1278)}

def hex_bits(h,n):
    out=[]
    for i in range(0,len(h),2):
        b=int(h[i:i+2],16)
        out += [(b>>bit)&1 for bit in range(7,-1,-1)]
    return np.array(out[:n],np.uint8)

def comps(crop,mode,thr,min_area,min_h):
    g=cv2.cvtColor(crop,cv2.COLOR_RGB2GRAY)
    m=((g<thr) if mode=='dark' else (g>thr)).astype(np.uint8)*255
    n,_,stats,_=cv2.connectedComponentsWithStats(m,8)
    c=[]
    for i in range(1,n):
        x,y,w,h,a=stats[i]
        if a>=min_area and h>=min_h and w>=2:c.append((x,y,w,h,a))
    return m,sorted(c)

def norm(mask,c,w,h):
    x,y,sw,sh,_=c;g=(mask[y:y+sh,x:x+sw]>0).astype(np.uint8)*255
    scale=min((w-2)/sw,(h-2)/sh);nw=max(1,round(sw*scale));nh=max(1,round(sh*scale))
    r=cv2.resize(g,(nw,nh),interpolation=cv2.INTER_NEAREST);o=np.zeros((h,w),np.uint8);x0=(w-nw)//2;y0=(h-nh)//2;o[y0:y0+nh,x0:x0+nw]=r
    return (o>0).astype(np.uint8).flatten()

def read(crop,kind):
    s=T[kind]; mode='bright' if kind=='ovr' else 'dark';thr=T['meta']['ovrThreshold'] if kind=='ovr' else T['meta']['ageThreshold'] if kind=='age' else T['meta']['skillThreshold']
    ma,mh=(30,18) if kind=='ovr' else (20,15) if kind=='age' else (12,12)
    mask,cc=comps(crop,mode,thr,ma,mh); digits=[]
    for c in cc:
        x=norm(mask,c,s['width'],s['height']);best=None
        for d,temps in s['digits'].items():
            score=min(np.mean(np.abs(x.astype(np.int16)-hex_bits(t,len(x)).astype(np.int16))) for t in temps)
            if best is None or score<best[1]:best=(d,score)
        digits.append(best[0])
    return int(''.join(digits)) if digits else None

def panel_bounds(arr):
    gray=cv2.cvtColor(arr,cv2.COLOR_RGB2GRAY).astype(np.float32);h,w=gray.shape;bright=(gray>100).astype(np.uint8)
    cs=bright[int(.03*h):int(.96*h)].mean(axis=0);mask=cs>.55;runs=[];s=None
    for i,v in enumerate(mask):
        if v and s is None:s=i
        if s is not None and (not v or i==w-1):e=i if not v else i+1;runs.append((s,e,e-s));s=None
    x1,x2,_=max(runs,key=lambda r:r[2]);sub=gray[:,x1:x2];diff=np.mean(np.abs(np.diff(sub,axis=0)),axis=1)
    top=max(range(int(.015*h),int(.2*h)),key=lambda y:diff[y])+1;bot=max(range(int(.75*h),h-2),key=lambda y:diff[y])+1
    return x1,top,x2,bot

errors=[];count=0
for fn,f in FIX.items():
    path=os.path.join('/mnt/data',fn);arr=np.array(Image.open(path));b=panel_bounds(arr)
    if any(abs(v-e)>2 for v,e in zip(b,(243,35,1293,660))):errors.append((fn,'panel',b));
    got_ovr=read(arr[100:154,495:565],'ovr');got_age=read(arr[160:210,525:575],'age');count+=2
    if got_ovr!=f['ovr']:errors.append((fn,'ovr',got_ovr,f['ovr']))
    if got_age!=f['age']:errors.append((fn,'age',got_age,f['age']))
    if f['type']=='out':
        for key in ['def','att','phys']:
            x1,x2=COL[key]
            for i,val in enumerate(f[key]):
                y1,y2=ROWS[i];got=read(arr[y1:y2,x1:x2],'skill');count+=1
                if got!=val:errors.append((fn,key,i,got,val))
    else:
        vals=[]
        for col in ['def','att']:
            x1,x2=COL[col]
            for i in range(5):
                y1,y2=ROWS[i];vals.append(read(arr[y1:y2,x1:x2],'skill'));count+=1
        if vals!=f['gk']:errors.append((fn,'gk',vals,f['gk']))
        x1,x2=COL['phys']
        for i,val in enumerate(f['phys']):
            y1,y2=ROWS[i];got=read(arr[y1:y2,x1:x2],'skill');count+=1
            if got!=val:errors.append((fn,'phys',i,got,val))

if errors:
    print('FAIL',len(errors),'errors');[print(e) for e in errors];sys.exit(1)
print(f'PASS scanner regression: {len(FIX)} screenshots, {count} numeric fields, panel detection exact within 2px')
