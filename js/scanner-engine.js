(() => {
  'use strict';
  const TE=window.TE5=window.TE5||{};
  const D=TE.Data,B=TE.BibleData;
  if(!D||!B) throw new Error('data.js and bible-data.js must load before scanner-engine.js');

  const VERSION=9;
  const MODEL='gemini-3.1-flash-live-preview';
  const MODELS=[MODEL],DOCUMENTED_MODELS=[MODEL];
  const API_KEY_STORAGE='te:scanner:geminiApiKey';
  const WS_BASE='wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent';
  const API_BASE='https://generativelanguage.googleapis.com/v1beta';
  const REQUEST_TIMEOUT_MS=90000;
  const RETRY_DELAY_MS=2000;
  const FRAME_W=1536,FRAME_H=695;
  const REFERENCE_MANIFEST_URL='assets/scanner/reference-manifest.json';
  const COMPACT_REFERENCE_MANIFEST_URL='assets/scanner/compact-reference-manifest.json';
  const referenceMedia={manifest:null,compactManifest:null,playstyles:null,abilities:null,raw:new Map()};

  const PLAYSTYLES=B.PLAYSTYLES.filter(x=>x.id!==1).map(x=>x.name);
  const PLAYSTYLE_LEVELS=['Locked','Standard','Intermediate','Advanced','Master'];
  const PLAYSTYLE_STATE_LABELS=['Locked','Standard','Standard Ready','Intermediate','Intermediate Ready','Advanced','Advanced Ready','Master','Standard Boosted','Intermediate Boosted','Advanced Boosted','Master Boosted','Wrong Position'];
  const ABILITIES=[...D.SPECIAL_ABILITIES];
  const SKILLS=['tackling','marking','positioning','heading','bravery','passing','dribbling','crossing','shooting','finishing','fitness','strength','aggression','speed','creativity'];
  const GK_CORE_SKILLS=['reflexes','agility','anticipation','rushingOut','communication','throwing','kicking','punching','aerialReach','concentration','fitness','strength','aggression','speed','creativity'];

  const ABILITY_CONFUSION_GROUPS=[
    {name:'Corner Specialist / Dribbler',rule:'Corner Specialist has a distinct STRAIGHT vertical corner-flag pole/flag beside the ball. Dribbler has a continuous sweeping curved ribbon/trail and NO straight flag pole.'},
    {name:'Free Kick Specialist / Defensive Wall',rule:'Free Kick Specialist has the grouped-player/free-kick emblem PLUS a curved/upward directional arrow or sweep on the right side. Defensive Wall is the grouped wall/players with a ball and has NO curved/upward directional arrow.'}
  ];

  const ROI={
    name:{x:452,y:40,w:305,h:58},ovr:{x:466,y:105,w:105,h:49},age:{x:463,y:158,w:105,h:52},roles:{x:914,y:158,w:136,h:52},
    totals:{defence:{x:675,y:281,w:61,h:48},attack:{x:946,y:281,w:61,h:48},physical:{x:1217,y:281,w:63,h:48}},
    skills:{
      tackling:{x:665,y:331,w:70,h:46},marking:{x:665,y:375,w:70,h:46},positioning:{x:665,y:419,w:70,h:46},heading:{x:665,y:463,w:70,h:46},bravery:{x:665,y:507,w:70,h:47},
      passing:{x:936,y:331,w:70,h:46},dribbling:{x:936,y:375,w:70,h:46},crossing:{x:936,y:419,w:70,h:46},shooting:{x:936,y:463,w:70,h:46},finishing:{x:936,y:507,w:70,h:47},
      fitness:{x:1207,y:331,w:72,h:46},strength:{x:1207,y:375,w:72,h:46},aggression:{x:1207,y:419,w:72,h:46},speed:{x:1207,y:463,w:72,h:46},creativity:{x:1207,y:507,w:72,h:47}
    },
    playstyleStrip:{x:620,y:34,w:225,h:67},abilityRow:{x:995,y:211,w:205,h:61},
    abilitySlots:[{x:1017,y:216,w:52,h:50},{x:1068,y:216,w:52,h:50},{x:1119,y:216,w:52,h:50}]
  };
  const GK_SKILL_ROI={
    reflexes:ROI.skills.tackling,agility:ROI.skills.marking,anticipation:ROI.skills.positioning,rushingOut:ROI.skills.heading,communication:ROI.skills.bravery,
    throwing:ROI.skills.passing,kicking:ROI.skills.dribbling,punching:ROI.skills.crossing,aerialReach:ROI.skills.shooting,concentration:ROI.skills.finishing,
    fitness:ROI.skills.fitness,strength:ROI.skills.strength,aggression:ROI.skills.aggression,speed:ROI.skills.speed,creativity:ROI.skills.creativity
  };

  function cleanKey(v){return String(v||'').trim()}
  async function getApiKey(){return cleanKey(localStorage.getItem(API_KEY_STORAGE))}
  async function setApiKey(v){const k=cleanKey(v);if(k)localStorage.setItem(API_KEY_STORAGE,k);else localStorage.removeItem(API_KEY_STORAGE);return k}
  async function clearApiKey(){localStorage.removeItem(API_KEY_STORAGE)}
  function scannerError(code,message,extra={}){const e=new Error(message);e.code=code;Object.assign(e,extra);return e}
  function abortError(){return scannerError('SCAN_CANCELLED','Scan cancelled.',{kind:'cancelled'})}
  function assertNotAborted(signal){if(signal?.aborted)throw abortError()}
  function clamp01(v){return Math.max(0,Math.min(1,Number(v)||0))}
  function normaliseText(v){return String(v??'').trim().replace(/[–—]/g,'-').replace(/\s+/g,' ')}
  function assetSlug(value){return String(value||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')}
  function abilityConfusionGuide(){return ABILITY_CONFUSION_GROUPS.map((g,i)=>`${i+1}. ${g.name}: ${g.rule}`).join('\n')}
  function canonicalPlaystyle(name){const n=normaliseText(name);if(/^box[ -]?to[ -]?box$/i.test(n))return'Box-to-Box';if(/^no[ -]?nonsense dc$/i.test(n))return'No-Nonsense DC';const hit=B.PLAYSTYLES.find(x=>x.name.toLowerCase()===n.toLowerCase());return hit?.name||n}
  function levelId(name){const hit=B.PLAYSTYLE_LEVELS.find(x=>x.name.toLowerCase()===normaliseText(name).toLowerCase());return hit?.id||0}
  function levelFromSegmentCount(count){const n=Number(count);return n===0?'Standard':n===1?'Intermediate':n===2?'Advanced':n===3?'Master':''}
  function levelFromSegmentFlags(right,bottom,left){if(!right&&!bottom&&!left)return'Standard';if(right&&!bottom&&!left)return'Intermediate';if(right&&bottom&&!left)return'Advanced';if(right&&bottom&&left)return'Master';return''}
  function canonicalAbility(name){const n=normaliseText(name);if(/^long shots$/i.test(n))return'Shadow Striker';const hit=D.SPECIAL_ABILITIES.find(x=>x.toLowerCase()===n.toLowerCase());return hit||n}
  function canonicalSkillName(k){const raw=String(k||'').replace(/([a-z])([A-Z])/g,'$1 $2').replace(/_/g,' ').trim();return D.OUTFIELD_SKILLS.find(x=>x.toLowerCase()===raw.toLowerCase())||D.GK_SKILLS.find(x=>x.toLowerCase()===raw.toLowerCase())||D.GK_PHYSICAL.find(x=>x.toLowerCase()===raw.toLowerCase())||raw}

  function dataUrlToMedia(dataUrl){const m=String(dataUrl||'').match(/^data:(image\/(?:png|jpe?g|webp));base64,([A-Za-z0-9+/=\r\n]+)$/i);if(!m)throw scannerError('INVALID_IMAGE','Choose a valid PNG, JPEG or WebP screenshot.',{scanFailure:true});return{mimeType:m[1].toLowerCase().replace('jpg','jpeg'),data:m[2].replace(/\s+/g,'')}}
  async function blobToBase64(blob){const ab=await blob.arrayBuffer(),bytes=new Uint8Array(ab);let binary='';const chunk=0x8000;for(let i=0;i<bytes.length;i+=chunk)binary+=String.fromCharCode(...bytes.subarray(i,i+chunk));return btoa(binary)}
  async function urlToMedia(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw scannerError('REFERENCE_LOAD',`Could not load scanner reference ${url} (HTTP ${r.status}).`,{scanFailure:true});const blob=await r.blob();return{data:await blobToBase64(blob),mimeType:blob.type||'image/png'}}
  function mediaToImage(media){return new Promise((res,rej)=>{const img=new Image();img.onload=()=>res(img);img.onerror=()=>rej(scannerError('INVALID_IMAGE','Could not decode screenshot.',{scanFailure:true}));img.src=`data:${media.mimeType};base64,${media.data}`})}
  function canvasToJpegMedia(c,q=.98){const u=c.toDataURL('image/jpeg',q);return{mimeType:'image/jpeg',data:u.slice(u.indexOf(',')+1)}}
  function drawCropPixels(ctx,img,roi,x,y,w,h,bg='#fff',smooth=true){ctx.fillStyle=bg;ctx.fillRect(x,y,w,h);const scale=Math.min(w/roi.w,h/roi.h),dw=Math.round(roi.w*scale),dh=Math.round(roi.h*scale);ctx.imageSmoothingEnabled=smooth;if(smooth)ctx.imageSmoothingQuality='high';ctx.drawImage(img,roi.x,roi.y,roi.w,roi.h,x+(w-dw)/2,y+(h-dh)/2,dw,dh)}
  function drawFieldCard(ctx,img,label,roi,x,y,w,h){ctx.fillStyle='#f8fafc';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#94a3b8';ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);ctx.fillStyle='#0f172a';ctx.font='bold 24px Arial';ctx.fillText(label,x+14,y+30);drawCropPixels(ctx,img,roi,x+10,y+42,w-20,h-52)}

  async function normaliseFrameMedia(media){
    const img=await mediaToImage(media);
    const sourceWidth=img.width,sourceHeight=img.height;
    const targetAspect=FRAME_W/FRAME_H,sourceAspect=sourceWidth/sourceHeight;
    const aspectError=Math.abs(sourceAspect-targetAspect)/targetAspect;
    // Phone screenshots can be the exact same Top Eleven Skills layout at a higher
    // native resolution (for example 2688×1216). Measure the real source size in
    // code, then normalise to the proven 1536×695 coordinate space used by v26.
    if(sourceWidth<1000||sourceHeight<450||aspectError>.0125){
      throw scannerError('INVALID_IMAGE_SIZE',`Scanner requires the standard Top Eleven Skills layout (${FRAME_W}×${FRAME_H} aspect); received ${sourceWidth}×${sourceHeight}.`,{scanFailure:true});
    }
    if(sourceWidth===FRAME_W&&sourceHeight===FRAME_H){
      return {...media,sourceWidth,sourceHeight,normalisedWidth:FRAME_W,normalisedHeight:FRAME_H,wasNormalised:false};
    }
    const c=document.createElement('canvas');c.width=FRAME_W;c.height=FRAME_H;
    const ctx=c.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,FRAME_W,FRAME_H);
    ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(img,0,0,FRAME_W,FRAME_H);
    return {...canvasToJpegMedia(c,.99),sourceWidth,sourceHeight,normalisedWidth:FRAME_W,normalisedHeight:FRAME_H,wasNormalised:true};
  }
  function frameSizeContext(media){
    const sw=Number(media?.sourceWidth)||FRAME_W,sh=Number(media?.sourceHeight)||FRAME_H;
    return `SOURCE SCREENSHOT DIMENSIONS (measured by app code): ${sw}x${sh}. NORMALISED SCANNER FRAME: ${FRAME_W}x${FRAME_H}. The images/crops supplied to you are already normalised to the canonical coordinate space. Do not invent another scale, crop, or coordinate transform.`;
  }
  async function requireFrame(media){const normalized=await normaliseFrameMedia(media);return mediaToImage(normalized)}
  async function detectLayoutHint(playerMedia){const player=await requireFrame(playerMedia),r=ROI.roles,c=document.createElement('canvas');c.width=r.w;c.height=r.h;const ctx=c.getContext('2d',{alpha:false});ctx.drawImage(player,r.x,r.y,r.w,r.h,0,0,r.w,r.h);const d=ctx.getImageData(0,0,r.w,r.h).data;let coloured=0,blue=0;for(let i=0;i<d.length;i+=4){const hsv=rgbToHsv01(d[i],d[i+1],d[i+2]);if(hsv.s>.25&&hsv.v>.35){coloured++;if(hsv.h>=175&&hsv.h<=235)blue++;}}return coloured&&blue/coloured>.35?'gk':'outfield'}
  async function buildCoreEvidenceBoard(playerMedia,layout='outfield'){const player=await requireFrame(playerMedia),W=1800,H=1810,M=24,gap=18,c=document.createElement('canvas');c.width=W;c.height=H;const ctx=c.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.font='bold 31px Arial';ctx.fillText(`COORDINATE-LOCKED ${layout==='gk'?'GOALKEEPER':'OUTFIELD'} CORE DATA — EACH FIELD IS ALREADY LABELLED`,M,42);ctx.font='21px Arial';ctx.fillText('Read only the value inside each labelled crop. Do not borrow a neighbouring number.',M,78);let y=110;const topW=Math.floor((W-M*2-gap*3)/4),topH=180;[['NAME',ROI.name],['OVR',ROI.ovr],['AGE',ROI.age],['ROLES',ROI.roles]].forEach((it,i)=>drawFieldCard(ctx,player,it[0],it[1],M+i*(topW+gap),y,topW,topH));y+=topH+gap;
    if(layout==='gk'){const totalW=Math.floor((W-M*2-gap)/2),totalH=155;[['GOALKEEPING TOTAL',ROI.totals.attack],['PHYSICAL TOTAL',ROI.totals.physical]].forEach((it,i)=>drawFieldCard(ctx,player,it[0],it[1],M+i*(totalW+gap),y,totalW,totalH));y+=totalH+gap+8;const cols=[[['REFLEXES','reflexes'],['AGILITY','agility'],['ANTICIPATION','anticipation'],['RUSHING OUT','rushingOut'],['COMMUNICATION','communication']],[['THROWING','throwing'],['KICKING','kicking'],['PUNCHING','punching'],['AERIAL REACH','aerialReach'],['CONCENTRATION','concentration']],[['FITNESS','fitness'],['STRENGTH','strength'],['AGGRESSION','aggression'],['SPEED','speed'],['CREATIVITY','creativity']]],cellW=Math.floor((W-M*2-gap*2)/3),cellH=245;cols.forEach((col,ci)=>col.forEach((it,ri)=>drawFieldCard(ctx,player,it[0],GK_SKILL_ROI[it[1]],M+ci*(cellW+gap),y+ri*(cellH+10),cellW,cellH)));}
    else{const totalW=Math.floor((W-M*2-gap*2)/3),totalH=155;[['DEFENCE TOTAL',ROI.totals.defence],['ATTACK TOTAL',ROI.totals.attack],['PHYSICAL TOTAL',ROI.totals.physical]].forEach((it,i)=>drawFieldCard(ctx,player,it[0],it[1],M+i*(totalW+gap),y,totalW,totalH));y+=totalH+gap+8;const cols=[[['TACKLING','tackling'],['MARKING','marking'],['POSITIONING','positioning'],['HEADING','heading'],['BRAVERY','bravery']],[['PASSING','passing'],['DRIBBLING','dribbling'],['CROSSING','crossing'],['SHOOTING','shooting'],['FINISHING','finishing']],[['FITNESS','fitness'],['STRENGTH','strength'],['AGGRESSION','aggression'],['SPEED','speed'],['CREATIVITY','creativity']]],totalW2=Math.floor((W-M*2-gap*2)/3),cellH=245;cols.forEach((col,ci)=>col.forEach((it,ri)=>drawFieldCard(ctx,player,it[0],ROI.skills[it[1]],M+ci*(totalW2+gap),y+ri*(cellH+10),totalW2,cellH)));}
    return canvasToJpegMedia(c,.98)}
  function median(a){const x=[...a].sort((m,n)=>m-n),n=x.length;return n%2?x[(n-1)/2]:(x[n/2-1]+x[n/2])/2}
  async function detectAbilityOccupancy(playerMedia){const player=await requireFrame(playerMedia),out=[];for(let i=0;i<ROI.abilitySlots.length;i++){const r=ROI.abilitySlots[i],c=document.createElement('canvas');c.width=r.w;c.height=r.h;const ctx=c.getContext('2d',{alpha:false});ctx.drawImage(player,r.x,r.y,r.w,r.h,0,0,r.w,r.h);const d=ctx.getImageData(0,0,r.w,r.h).data,rr=[],gg=[],bb=[],bw=4;for(let y=0;y<r.h;y++)for(let x=0;x<r.w;x++){if(x>=bw&&x<r.w-bw&&y>=bw&&y<r.h-bw)continue;const k=(y*r.w+x)*4;rr.push(d[k]);gg.push(d[k+1]);bb.push(d[k+2])}const bg=[median(rr),median(gg),median(bb)];let fg=0,total=r.w*r.h,sum=0,dark=0;for(let y=0;y<r.h;y++)for(let x=0;x<r.w;x++){const k=(y*r.w+x)*4,R=d[k],G=d[k+1],B=d[k+2],dr=R-bg[0],dg=G-bg[1],db=B-bg[2],dist=Math.sqrt(dr*dr+dg*dg+db*db);sum+=dist;if(dist>35)fg++;if((R+G+B)/3<85)dark++}const fraction=fg/total,darkFraction=dark/total;out.push({slot:i+1,occupied:fraction>.03,learning:darkFraction>.25,foregroundFraction:fraction,darkFraction,meanDistance:sum/total})}return out}
  function locateBadgeComponent(img){
    const r=ROI.playstyleStrip,c=document.createElement('canvas');c.width=r.w;c.height=r.h;const ctx=c.getContext('2d',{alpha:false});ctx.drawImage(img,r.x,r.y,r.w,r.h,0,0,r.w,r.h);const data=ctx.getImageData(0,0,r.w,r.h).data,rs=[],gs=[],bs=[];for(let i=0;i<data.length;i+=4){rs.push(data[i]);gs.push(data[i+1]);bs.push(data[i+2])}const bg=[median(rs),median(gs),median(bs)],mask=new Uint8Array(r.w*r.h);for(let y=0;y<r.h;y++)for(let x=0;x<r.w;x++){const k=(y*r.w+x)*4,dr=data[k]-bg[0],dg=data[k+1]-bg[1],db=data[k+2]-bg[2];if(Math.sqrt(dr*dr+dg*dg+db*db)>35)mask[y*r.w+x]=1}
    const seen=new Uint8Array(mask.length),dirs=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]],cands=[];for(let y=0;y<r.h;y++)for(let x=0;x<r.w;x++){const start=y*r.w+x;if(!mask[start]||seen[start])continue;const q=[[x,y]];seen[start]=1;let qi=0,minX=x,maxX=x,minY=y,maxY=y,area=0;while(qi<q.length){const[pX,pY]=q[qi++];area++;if(pX<minX)minX=pX;if(pX>maxX)maxX=pX;if(pY<minY)minY=pY;if(pY>maxY)maxY=pY;for(const[dx,dy]of dirs){const nx=pX+dx,ny=pY+dy;if(nx<0||ny<0||nx>=r.w||ny>=r.h)continue;const ni=ny*r.w+nx;if(mask[ni]&&!seen[ni]){seen[ni]=1;q.push([nx,ny])}}}const w=maxX-minX+1,h=maxY-minY+1,aspect=w/h;if(w>=22&&w<=72&&h>=31&&h<=67&&area>=400&&aspect>=.55&&aspect<=1.45){const score=area+h*20-Math.abs(aspect-.9)*500-Math.abs(h-36)*15;cands.push({x:minX,y:minY,w,h,area,score})}}
    if(!cands.length)return{...r,detected:false};cands.sort((a,b)=>b.score-a.score);const b=cands[0],pad=9,x=Math.max(0,b.x-pad),y=Math.max(0,b.y-pad),right=Math.min(r.w,b.x+b.w+pad),bottom=Math.min(r.h,b.y+b.h+pad);return{x:r.x+x,y:r.y+y,w:right-x,h:bottom-y,detected:true,component:b};
  }
  async function playstyleBadgeSource(playerMedia){const player=await requireFrame(playerMedia);return{player,roi:locateBadgeComponent(player)}}
  async function buildPlaystyleEvidence(playerMedia){const{player,roi}=await playstyleBadgeSource(playerMedia),c=document.createElement('canvas');c.width=900;c.height=760;const ctx=c.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#111827';ctx.font='bold 28px Arial';ctx.fillText('CURRENT PLAYER — ISOLATED PLAYSTYLE BADGE',24,42);ctx.font='18px Arial';ctx.fillStyle='#475569';ctx.fillText(roi.detected?'Badge located automatically from the real screenshot.':'Badge locator fallback: full playstyle strip.',24,70);drawCropPixels(ctx,player,roi,24,92,852,640,'#fff',true);return canvasToJpegMedia(c,.995)}
  async function buildPlaystyleLevelEvidence(playerMedia){
    const{player,roi}=await playstyleBadgeSource(playerMedia);
    const make=(smooth,label,maskReady=false)=>{const c=document.createElement('canvas');c.width=900;c.height=760;const ctx=c.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#111827';ctx.font='bold 30px Arial';ctx.fillText(`CURRENT PLAYER — COMPACT PLAYSTYLE LEVEL — ${label}`,24,42);ctx.font='18px Arial';ctx.fillStyle='#475569';ctx.fillText(maskReady?'Bottom-centre Ready-arrow zone is deliberately masked. Judge the visible ring sides only.':'This is the compact header badge from the real screenshot. Ready arrow is an overlay, never a level segment.',24,70);const x=24,y=92,w=852,h=640,scale=Math.min(w/roi.w,h/roi.h),dw=Math.round(roi.w*scale),dh=Math.round(roi.h*scale),dx=x+(w-dw)/2,dy=y+(h-dh)/2;ctx.fillStyle='#fff';ctx.fillRect(x,y,w,h);ctx.imageSmoothingEnabled=smooth;if(smooth)ctx.imageSmoothingQuality='high';ctx.drawImage(player,roi.x,roi.y,roi.w,roi.h,dx,dy,dw,dh);if(maskReady){ctx.fillStyle='#94a3b8';const mx=dx+dw*.37,mw=dw*.26,my=dy+dh*.58,mh=dh*.42;ctx.fillRect(mx,my,mw,mh);ctx.fillStyle='#334155';ctx.font='bold 16px Arial';ctx.fillText('READY OVERLAY MASK',mx+4,my+20)}return canvasToJpegMedia(c,.995)};
    return{raw:make(false,'RAW PIXELS'),smooth:make(true,'SMOOTH ENLARGEMENT'),masked:make(true,'READY-ARROW MASKED',true),roi};
  }
  function rgbToHsv01(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;let h=0;if(d){if(mx===r)h=((g-b)/d)%6;else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60;if(h<0)h+=360}return{h,s:mx===0?0:d/mx,v:mx}}
  async function loadReferenceManifest(){
    if(referenceMedia.manifest)return referenceMedia.manifest;
    let r;try{r=await fetch(REFERENCE_MANIFEST_URL,{cache:'no-store'})}catch(e){throw scannerError('REFERENCE_LOAD',`Could not load exact scanner reference manifest: ${e.message||e}`,{scanFailure:true})}
    if(!r.ok)throw scannerError('REFERENCE_LOAD',`Could not load exact scanner reference manifest (HTTP ${r.status}).`,{scanFailure:true});
    const m=await r.json();
    if(m?.counts?.playstyles!==20||m?.counts?.statesPerPlaystyle!==13||m?.counts?.playstyleImages!==260||m?.counts?.specialAbilityImages!==19||m?.counts?.totalReferenceImages!==279)throw scannerError('REFERENCE_LOAD','Exact scanner reference manifest failed integrity counts (expected 20 playstyles × 13 states + 19 coloured Special Abilities = 279 images).',{scanFailure:true});
    for(const ps of m.playstyles||[])for(const state of PLAYSTYLE_STATE_LABELS)if(!ps.states?.[state]?.path)throw scannerError('REFERENCE_LOAD',`Exact scanner reference manifest is missing ${ps.name} / ${state}.`,{scanFailure:true});
    const abilityNames=new Set((m.specialAbilities||[]).map(x=>x.name));for(const name of ABILITIES)if(!abilityNames.has(name))throw scannerError('REFERENCE_LOAD',`Exact scanner reference manifest is missing coloured Special Ability ${name}.`,{scanFailure:true});
    referenceMedia.manifest=m;return m;
  }
  async function loadCompactReferenceManifest(){
    if(referenceMedia.compactManifest)return referenceMedia.compactManifest;
    let r;try{r=await fetch(COMPACT_REFERENCE_MANIFEST_URL,{cache:'no-store'})}catch(e){throw scannerError('REFERENCE_LOAD',`Could not load compact scanner reference manifest: ${e.message||e}`,{scanFailure:true})}
    if(!r.ok)throw scannerError('REFERENCE_LOAD',`Could not load compact scanner reference manifest (HTTP ${r.status}).`,{scanFailure:true});
    const m=await r.json();
    if(m?.counts?.playstyles!==20||m?.counts?.levelsPerPlaystyle!==5||m?.counts?.playstyleImages!==100||m?.counts?.overlayImages!==6||m?.counts?.totalImages!==106)throw scannerError('REFERENCE_LOAD','Compact scanner reference manifest failed integrity counts (expected 20 playstyles × 5 levels + 6 overlays = 106 images).',{scanFailure:true});
    for(const ps of m.playstyles||[])for(const level of PLAYSTYLE_LEVELS)if(!ps.states?.[level]?.path)throw scannerError('REFERENCE_LOAD',`Compact scanner reference manifest is missing ${ps.name} / ${level}.`,{scanFailure:true});
    referenceMedia.compactManifest=m;return m;
  }
  async function cachedReference(path){
    if(referenceMedia.raw.has(path))return referenceMedia.raw.get(path);
    const media=await urlToMedia(path);referenceMedia.raw.set(path,media);return media;
  }
  function fitText(ctx,text,maxWidth,fontSize=22){let size=fontSize;while(size>14){ctx.font=`bold ${size}px Arial`;if(ctx.measureText(text).width<=maxWidth)break;size--}return size}
  async function drawReferenceBoard(title,subtitle,entries,{cols=5,cellW=320,cellH=290,imageW=220,imageH=205}={}){
    const rows=Math.ceil(entries.length/cols),headerH=105,W=cols*cellW,H=headerH+rows*cellH,c=document.createElement('canvas');c.width=W;c.height=H;const ctx=c.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.font='bold 30px Arial';ctx.textAlign='center';ctx.fillText(title,W/2,38);ctx.font='18px Arial';ctx.fillStyle='#475569';ctx.fillText(subtitle,W/2,70);ctx.textAlign='left';
    for(let i=0;i<entries.length;i++){const e=entries[i],row=Math.floor(i/cols),col=i%cols,x=col*cellW,y=headerH+row*cellH;ctx.fillStyle='#f8fafc';ctx.fillRect(x+8,y+8,cellW-16,cellH-16);ctx.strokeStyle='#cbd5e1';ctx.lineWidth=2;ctx.strokeRect(x+8,y+8,cellW-16,cellH-16);const media=await cachedReference(e.path),img=await mediaToImage(media),maxW=imageW,maxH=imageH,scale=Math.min(maxW/img.width,maxH/img.height),dw=Math.round(img.width*scale),dh=Math.round(img.height*scale),dx=x+(cellW-dw)/2,dy=y+18+(imageH-dh)/2;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(img,dx,dy,dw,dh);const labelY=y+26+imageH;ctx.fillStyle='#111827';const fs=fitText(ctx,e.label,cellW-30,21);ctx.font=`bold ${fs}px Arial`;ctx.textAlign='center';ctx.fillText(e.label,x+cellW/2,labelY+25);ctx.textAlign='left';}
    return canvasToJpegMedia(c,.995);
  }
  async function buildPlaystyleIdentityReference(){
    if(referenceMedia.playstyles)return referenceMedia.playstyles;const m=await loadCompactReferenceManifest();const entries=m.playstyles.map(ps=>({label:ps.name,path:ps.states.Standard.path}));referenceMedia.playstyles=await drawReferenceBoard('EXACT COMPACT PLAYSTYLE IDENTITY REFERENCES','20 PlaystyleSmallAtlas Standard badges from the same compact renderer used beside player names.',entries,{cols:5,cellW:300,cellH:280,imageW:190,imageH:205});return referenceMedia.playstyles;
  }
  async function exactPlaystyleStateMedia(playstyleName,stateLabel){
    const canonical=canonicalPlaystyle(playstyleName),m=await loadReferenceManifest(),ps=m.playstyles.find(x=>x.name===canonical),entry=ps?.states?.[stateLabel];
    if(!entry?.path)throw scannerError('REFERENCE_LOAD',`No exact HQ playstyle reference exists for ${canonical} / ${stateLabel}.`,{scanFailure:true});
    return cachedReference(entry.path);
  }
  async function compactPlaystyleStateMedia(playstyleName,level){
    const canonical=canonicalPlaystyle(playstyleName),m=await loadCompactReferenceManifest(),ps=m.playstyles.find(x=>x.name===canonical),entry=ps?.states?.[level];
    if(!entry?.path)throw scannerError('REFERENCE_LOAD',`No compact playstyle reference exists for ${canonical} / ${level}.`,{scanFailure:true});
    return cachedReference(entry.path);
  }
  async function compactOverlayMedia(name){const m=await loadCompactReferenceManifest(),entry=m?.overlays?.[name];if(!entry?.path)throw scannerError('REFERENCE_LOAD',`No compact overlay reference exists for ${name}.`,{scanFailure:true});return cachedReference(entry.path)}
  async function compactPlaystyleMeta(playstyleName){const canonical=canonicalPlaystyle(playstyleName),m=await loadCompactReferenceManifest();return m.playstyles.find(x=>x.name===canonical)||null}

  async function buildAbilityReference(){
    if(referenceMedia.abilities)return referenceMedia.abilities;const m=await loadReferenceManifest();const entries=m.specialAbilities.map(a=>({label:a.name,path:a.path}));referenceMedia.abilities=await drawReferenceBoard('EXACT COLOURED SPECIAL ABILITY REFERENCES','19 approved coloured icons only. Gold/boosted ability references are intentionally not used.',entries,{cols:5,cellW:320,cellH:245,imageW:150,imageH:150});return referenceMedia.abilities;
  }

  async function buildAbilitySlotEvidence(playerMedia,slotIndex){const player=await requireFrame(playerMedia),roi=ROI.abilitySlots[slotIndex],make=(smooth,label)=>{const W=1100,H=620,c=document.createElement('canvas');c.width=W;c.height=H;const ctx=c.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.fillStyle='#111827';ctx.font='bold 30px Arial';ctx.fillText(`SPECIAL ABILITY SLOT ${slotIndex+1} — ${label}`,24,42);ctx.fillStyle='#f8fafc';ctx.fillRect(24,70,W-48,H-94);ctx.strokeStyle='#94a3b8';ctx.lineWidth=2;ctx.strokeRect(24,70,W-48,H-94);const pad=26,x=24+pad,y=70+pad,w=W-48-pad*2,h=H-94-pad*2,scale=Math.min(w/roi.w,h/roi.h),dw=Math.round(roi.w*scale),dh=Math.round(roi.h*scale);ctx.imageSmoothingEnabled=smooth;if(smooth)ctx.imageSmoothingQuality='high';ctx.drawImage(player,roi.x,roi.y,roi.w,roi.h,x+(w-dw)/2,y+(h-dh)/2,dw,dh);return canvasToJpegMedia(c,.995)};return{raw:make(false,'RAW PIXELS'),smooth:make(true,'SMOOTH ENLARGEMENT')}}

  function coreResponseSchema(layout='outfield'){const keys=layout==='gk'?GK_CORE_SKILLS:SKILLS,skillProps={};for(const skill of keys)skillProps[skill]={type:'integer'};const totals=layout==='gk'?{type:'object',properties:{goalkeeping:{type:'integer'},physical:{type:'integer'}},required:['goalkeeping','physical']}:{type:'object',properties:{defence:{type:'integer'},attack:{type:'integer'},physical:{type:'integer'}},required:['defence','attack','physical']};return{type:'object',properties:{name:{type:'string'},age:{type:'integer'},ovr:{type:'integer'},roles:{type:'array',items:{type:'string'}},totals,skills:{type:'object',properties:skillProps,required:keys},uncertainFields:{type:'array',items:{type:'string'}},notes:{type:'string'}},required:['name','age','ovr','roles','totals','skills','uncertainFields','notes']}}
  function playstyleIdentityResponseSchema(){return {type:'object',properties:{
    playstyle:{type:'string',description:`Use exactly one of these approved names: ${[...PLAYSTYLES,'Not visible'].join(', ')}`},
    uncertainFields:{type:'array',items:{type:'string'}},notes:{type:'string'}
  },required:['playstyle','uncertainFields','notes']};}
  function playstyleLevelResponseSchema(){return {type:'object',properties:{
    level:{type:'string',description:`Underlying playstyle level. Use exactly one of: ${PLAYSTYLE_LEVELS.join(', ')}, Not visible`},
    rightSegmentDark:{type:'boolean',description:'Right ring segment (top separator around right edge to lower-right separator) is dark/category-coloured.'},
    bottomSegmentDark:{type:'boolean',description:'Bottom ring segment (lower-right separator around the bottom to lower-left separator) is dark/category-coloured.'},
    leftSegmentDark:{type:'boolean',description:'Left ring segment (lower-left separator around left edge to top separator) is dark/category-coloured.'},
    darkSegmentCount:{type:'integer',description:'Sum of the three dark segment booleans. Standard=0, Intermediate=1, Advanced=2, Master=3. Use -1 only for Locked or Not visible.'},
    locked:{type:'boolean',description:'True only when the exact padlock notification is visibly present.'},
    uncertainFields:{type:'array',items:{type:'string'}},notes:{type:'string'}
  },required:['level','rightSegmentDark','bottomSegmentDark','leftSegmentDark','darkSegmentCount','locked','uncertainFields','notes']};}
  function playstyleLevelConfirmationResponseSchema(){return {type:'object',properties:{
    level:{type:'string',description:`Choose exactly one compact-renderer reference: ${PLAYSTYLE_LEVELS.join(', ')}`},
    closestReference:{type:'string',description:'Repeat the exact reference label you judged visually closest.'},
    readyArrowVisible:{type:'boolean',description:'True only if the separate dark level-up arrow overlay is present; this must never change the underlying level.'},
    uncertainFields:{type:'array',items:{type:'string'}},notes:{type:'string'}
  },required:['level','closestReference','readyArrowVisible','uncertainFields','notes']};}
  function playstyleLevelTieBreakResponseSchema(candidates){return {type:'object',properties:{level:{type:'string',description:`Choose exactly one of: ${candidates.join(', ')}`},uncertainFields:{type:'array',items:{type:'string'}},notes:{type:'string'}},required:['level','uncertainFields','notes']};}
  function playstyleOverlayResponseSchema(){return {type:'object',properties:{
    ready:{type:'boolean',description:'True only when the exact level-up arrow notification is visible.'},
    boosted:{type:'boolean',description:'True only when the exact boosted shell/wings are visible.'},
    wrongPosition:{type:'boolean',description:'True only when the exact red wrong-position notification is visible.'},
    uncertainFields:{type:'array',items:{type:'string'}},notes:{type:'string'}
  },required:['ready','boosted','wrongPosition','uncertainFields','notes']};}
  function playstylePairResponseSchema(names){return {type:'object',properties:{playstyle:{type:'string',description:`Choose exactly one of: ${names.join(', ')}`},uncertainFields:{type:'array',items:{type:'string'}},notes:{type:'string'}},required:['playstyle','uncertainFields','notes']};}
  function abilitySlotResponseSchema(){return {type:'object',properties:{
    ability:{type:'string',description:`Exactly ONE Special Ability identity for this single occupied slot. Use only: ${ABILITIES.join(', ')}`},
    uncertainFields:{type:'array',items:{type:'string'}},notes:{type:'string'}
  },required:['ability','uncertainFields','notes']};}
  function toolDecl(name,description,parameters){return{name,description,parameters}}
  function inlinePart(media){return{inlineData:{mimeType:media.mimeType,data:media.data}}}

  function baseSystemInstruction(){return `
You are a dedicated Top Eleven visual scanner running inside Gemini 3.1 Flash Live.
Accuracy is more important than speed. Think carefully before selecting a visual match.
CRITICAL REFERENCE RULE: the supplied exact reference boards are the authority for Playstyle and Special Ability identity. They are built at runtime from the approved atlas/code-derived PNG reference pack bundled with this app.
CRITICAL INDEPENDENCE RULE: you are never given benchmark answers, expected player data, or test ground truth. Do not guess from a player name. Derive every result from the CURRENT screenshot and the supplied exact references only.
Never infer a playstyle or Special Ability from position, role, stats, OVR, player name, or football semantics. Match the actual emblem geometry.
Never invent a visual symbol, substitute a similar football icon, or use an identity that is not present on the supplied board.
When the evidence is genuinely ambiguous, mark the relevant field uncertain instead of inventing certainty.
Call the requested submit function exactly once. Do not output prose instead of the function call.
`;}
  function corePrompt(layout='outfield'){return layout==='gk'?`
TASK: transcribe GOALKEEPER core player data only.
IMAGE A = full 1536x695 player card for context.
IMAGE B = coordinate-locked labelled GOALKEEPER core board and is the authority.
Read name, age, OVR, roles, GOALKEEPING TOTAL, PHYSICAL TOTAL, all 10 goalkeeper skills and all 5 physical skills from IMAGE B only.
Goalkeeper skills are Reflexes, Agility, Anticipation, Rushing Out, Communication, Throwing, Kicking, Punching, Aerial Reach and Concentration.
Physical skills are Fitness, Strength, Aggression, Speed and Creativity.
Each crop is already labelled. Never borrow a neighbouring value. Do not recalculate anything.
When complete call submit_core_scan exactly once.`:`
TASK: transcribe OUTFIELD core player data only.
IMAGE A = full 1536x695 player card for context.
IMAGE B = coordinate-locked labelled OUTFIELD core board and is the authority.
Read name, age, OVR, roles, the three totals and all 15 outfield skills from IMAGE B only.
Each crop is already labelled. Never borrow a neighbouring value. Do not recalculate anything.
When complete call submit_core_scan exactly once.`}
  function playstyleIdentityPrompt(){return `
TASK: identify PLAYSTYLE IDENTITY only.
IMAGE A = full current player card.
IMAGE B = isolated enlarged playstyle badge from this same player.
IMAGE C = EXACT COMPACT PLAYSTYLE IDENTITY REFERENCES extracted from the real PlaystyleSmallAtlas used by the small badge beside the player name.

MANDATORY MATCH PROCESS:
1. Find the actual playstyle badge in IMAGE B.
2. Ignore its level ring, lock, ready arrow, wrong-position notification and boosted shell. Those are state layers, not identity.
3. Compare only the INNER EMBLEM geometry against all 20 labelled compact-renderer candidates in IMAGE C.
4. The IMAGE C labels are authoritative. Return the label of the exact geometry match; do not rename it and do not use a synonym.
5. Do not use player name, role, position, stats, OVR, category colour or football semantics.
6. DEFENDER LOOKALIKE CHECK: Ball Playing DC has the shield/ball emblem. No-Nonsense DC has the shield with a clear exclamation mark. Never substitute one for the other.
7. If no playstyle badge is genuinely visible, return Not visible.

The reference board contains these exact approved identities:
${PLAYSTYLES.join(' | ')}

Call submit_playstyle_identity exactly once.`;}
  function playstyleLevelPrompt(playstyleName){return `
TASK: identify ONLY the UNDERLYING PLAYSTYLE LEVEL for ${playstyleName} from the COMPACT header badge.
These references come from PlaystyleSmallAtlas — the same renderer family as the badge beside the player name. They are the authority for this task.

CURRENT PLAYER:
- IMAGE A = RAW isolated compact badge.
- IMAGE B = SMOOTH enlargement of the same compact badge.
- IMAGE C = the same current badge with ONLY the bottom-centre Ready-arrow area masked. Use IMAGE C when the max-XP arrow covers the bottom centre.

EXACT SAME-PLAYSTYLE COMPACT REFERENCES:
- IMAGE D = Standard.
- IMAGE E = Intermediate.
- IMAGE F = Advanced.
- IMAGE G = Master.
- IMAGE H = Locked.
- IMAGE I = the exact standalone max-XP / Ready arrow. IMAGE I IS NOT A LEVEL. If this shape is on the current badge, mentally remove it before comparing D-H.

MANDATORY METHOD — DO NOT SHORTCUT:
1. Compare the CURRENT badge against EACH of D, E, F, G and H one by one. Do not decide before checking all five.
2. If the standalone arrow from IMAGE I is present, explicitly ignore every pixel belonging to that arrow. It sits at bottom-centre and may cover part of the badge, but it NEVER upgrades the underlying level.
3. Locked requires the padlock state from H. A Ready arrow is not a lock.
4. For unlocked levels, compare the OUTER LEVEL RING geometry/colour progression, not the inner emblem. Identity is already known.
5. The exact compact progression remains: Standard=0 category-coloured ring segments, Intermediate=1 (RIGHT), Advanced=2 (RIGHT+BOTTOM), Master=3 (RIGHT+BOTTOM+LEFT).
6. IMPORTANT FOR YELLOW/MIDFIELD BADGES: the Intermediate right-hand yellow segment can be close in brightness to the pale Standard border. Do not call Standard until you have directly compared the RIGHT side with both D and E. If the right edge is the stronger category yellow matching E, it is Intermediate.
7. IMAGE C deliberately masks only the Ready-arrow zone. Never interpret the grey mask as part of the ring.
8. Set the three segment booleans only after the five-reference comparison. They must agree with the chosen exact reference.
9. Never use player name, role, stats, OVR or football semantics.
10. If uncertain, mark playstyleLevel uncertain instead of defaulting to Standard.

Call submit_playstyle_level exactly once.`;}
  function playstyleLevelConfirmationPrompt(playstyleName,firstLevel){return `
SECOND, INDEPENDENT LEVEL CONFIRMATION for ${playstyleName}. First pass resolved ${firstLevel}, but you MUST verify it from scratch.
IMAGE A = current compact badge, Ready-arrow zone masked.
IMAGE B = current compact badge, full RAW pixels.
IMAGE C = exact compact Standard reference.
IMAGE D = exact compact Intermediate reference.
IMAGE E = exact compact Advanced reference.
IMAGE F = exact compact Master reference.
IMAGE G = exact compact Locked reference.
IMAGE H = exact standalone Ready/max-XP arrow to REMOVE MENTALLY from the current image.

MANDATORY:
- Inspect every one of C-G individually before answering.
- Pick the SINGLE reference whose badge ring matches after ignoring IMAGE-H arrow pixels.
- Do not inherit or favour the first-pass answer.
- Standard versus Intermediate: compare the RIGHT outer segment specifically. Intermediate has the stronger category-coloured RIGHT segment; Standard does not.
- Intermediate versus Advanced: the bottom category-coloured segment exists only in Advanced, but a centred Ready arrow can cover it. Use the uncovered lower-left/lower-right ring portions and IMAGE A.
- Master requires all three ring sides category-coloured.
Return the exact level label and repeat it in closestReference.
Call submit_playstyle_level_confirmation exactly once.`;}
  function playstyleLevelTieBreakPrompt(playstyleName,candidates){return `
FINAL LEVEL TIE-BREAK for ${playstyleName}. Two independent reads disagreed.
Candidates are ONLY: ${candidates.join(' versus ')}.
IMAGE A = current compact badge with the Ready-arrow zone masked.
IMAGE B = current compact badge full RAW.
Then the exact candidate references follow, one image per candidate, plus the standalone Ready arrow last.
Compare the ring geometry pixel-for-pixel in spirit. Ignore the standalone Ready arrow completely. Choose ONLY one of the two candidate labels. Do not default to Standard.
Call submit_playstyle_level_tiebreak exactly once.`;}
  function playstyleOverlayPrompt(playstyleName,levelName,category){return `
TASK: identify ONLY the VISUAL OVERLAYS on the compact ${playstyleName} badge. Underlying level ${levelName} is already fixed; DO NOT change it.
IMAGE A = full current compact badge RAW.
IMAGE B = full current compact badge SMOOTH.
IMAGE C = exact standalone Ready/max-XP arrow from PlaystyleSmallAtlas.
IMAGE D = exact standalone ${category} boosted shell from PlaystyleSmallAtlas.
IMAGE E = exact standalone Wrong Position notification from PlaystyleSmallAtlas.

Rules:
1. ready=true ONLY when the current badge visibly contains the exact dark upward arrow shape from IMAGE C. The arrow is an overlay, never a level segment.
2. boosted=true ONLY when the compact boosted shell/wings from IMAGE D are present.
3. wrongPosition=true ONLY when the exact wrong-position notification from IMAGE E is present.
4. The underlying level stays ${levelName}, even when Ready is present.
5. Master Ready and Locked Ready are invalid.
Call submit_playstyle_overlay exactly once.`;}
  function defenderIdentityConfirmationPrompt(){return `
TASK: resolve ONLY this defender playstyle lookalike pair from exact references.
IMAGE A = RAW/large current player playstyle evidence.
IMAGE B = exact Ball Playing DC Standard reference.
IMAGE C = exact No-Nonsense DC Standard reference.

Ball Playing DC has the shield containing a BALL/CIRCLE motif.
No-Nonsense DC has the shield containing a clear EXCLAMATION MARK.
Ignore level-ring state, colour intensity, player name, position and stats. Compare the INNER EMBLEM geometry only.
Return exactly Ball Playing DC or No-Nonsense DC.
Call submit_playstyle_pair exactly once.`;}
  function abilitySlotPrompt(slot){return `
TASK: identify exactly ONE COLOURED SPECIAL ABILITY from exactly ONE code-confirmed occupied slot.
This request contains NO other player ability slots. Treat this slot independently.
IMAGE A = RAW pixel-preserving enlargement of occupied slot ${slot}.
IMAGE B = SMOOTH enlargement of the SAME occupied slot ${slot}.
IMAGE C = EXACT COLOURED SPECIAL ABILITY REFERENCES built from the newly supplied 19-image reference pack.

CRITICAL RULES:
- The user will capture the coloured/unboosted Special Ability version from now on. There is intentionally NO gold/boosted reference path in this scanner.
- Return exactly ONE ability name from IMAGE C.
- IMAGE C is authoritative. Match the icon geometry directly to its labelled exact reference; do not invent, redraw, recolour or infer an ability.
- A black progress/training widget such as 3/50 is NOT an unlocked Special Ability. The app excludes training/progress slots before this call.
- Do NOT infer from player identity, role, stats, OVR, or any other slot.
- Use IMAGE A for tiny straight lines/poles and IMAGE B for overall silhouette.
- Compare the candidate against every visually similar exact reference before committing.

LOOKALIKE CHECKS (secondary to the exact board):
${abilityConfusionGuide()}

If genuinely ambiguous, still choose the closest exact board identity but include "specialAbilitySlot${slot}" in uncertainFields.
Call submit_ability_slot_scan exactly once.`;}
  async function preloadReferences(){await Promise.all([loadReferenceManifest(),loadCompactReferenceManifest()]);await Promise.all([buildPlaystyleIdentityReference(),buildAbilityReference()]);}

  async function readWsMessageData(data){if(typeof data==='string')return data;if(data instanceof Blob)return await data.text();if(data instanceof ArrayBuffer)return new TextDecoder().decode(data);return String(data??'')}
  async function preflightKeyAndModel(key,model,signal){assertNotAborted(signal);let r;try{r=await fetch(`${API_BASE}/models/${encodeURIComponent(model)}?key=${encodeURIComponent(key)}`,{cache:'no-store',signal})}catch(e){if(signal?.aborted)throw abortError();throw scannerError('NETWORK','Could not reach Gemini model endpoint.',{kind:'network',retryable:true})}let body={};try{body=await r.json()}catch{}if(!r.ok){const msg=body?.error?.message||`Model check failed HTTP ${r.status}`;const kind=r.status===401||r.status===403?'auth':r.status===429?'rate_limit':'request';throw scannerError('GEMINI_API_ERROR',msg,{status:r.status,kind,retryable:r.status===429})}return body}
  function liveSetup(model,systemText,toolDeclaration){const setup={model:`models/${model}`,generationConfig:{responseModalities:['AUDIO'],temperature:0,thinkingConfig:{thinkingLevel:'HIGH'}},systemInstruction:{parts:[{text:systemText||baseSystemInstruction()}]}};if(toolDeclaration)setup.tools=[{functionDeclarations:[toolDeclaration]}];return setup}
  async function openLiveSocket(key,model,purpose='Gemini Live session',toolDeclaration=null,signal=null){assertNotAborted(signal);return await new Promise((resolve,reject)=>{const ws=new WebSocket(`${WS_BASE}?key=${encodeURIComponent(key)}`);let settled=false;const cleanup=()=>{clearTimeout(timer);signal?.removeEventListener?.('abort',abort)};const fail=e=>{if(settled)return;settled=true;cleanup();try{ws.close()}catch{};reject(e instanceof Error?e:new Error(String(e)))};const ok=()=>{if(settled)return;settled=true;cleanup();resolve(ws)};const abort=()=>fail(abortError());const timer=setTimeout(()=>fail(scannerError('SCAN_TIMEOUT',`${purpose} timed out before setup completed.`,{kind:'timeout',retryable:true})),25000);signal?.addEventListener?.('abort',abort,{once:true});ws.onopen=()=>{try{ws.send(JSON.stringify({setup:liveSetup(model,baseSystemInstruction(),toolDeclaration)}))}catch(e){fail(e)}};ws.onmessage=async ev=>{let m;try{m=JSON.parse(await readWsMessageData(ev.data))}catch{return}if(m.setupComplete)ok();else if(m.error)fail(scannerError('GEMINI_LIVE_ERROR',m.error.message||JSON.stringify(m.error),{kind:'request'}))};ws.onerror=()=>{};ws.onclose=ev=>{if(!settled)fail(scannerError('GEMINI_LIVE_CLOSED',`${purpose} closed before setup completed (${ev.code}${ev.reason?`: ${ev.reason}`:''}).`,{kind:'temporary',retryable:true}))}})}
  async function runLiveFunctionTask({key,model,purpose,toolName,toolDeclaration,parts,signal}){const ws=await openLiveSocket(key,model,purpose,toolDeclaration,signal);let result=null;return await new Promise((resolve,reject)=>{let settled=false;const finish=(err,value)=>{if(settled)return;settled=true;clearTimeout(timeout);signal?.removeEventListener?.('abort',abort);try{ws.close(1000,value?'Task complete':'Task stopped')}catch{};err?reject(err):resolve(value)};const abort=()=>finish(abortError());const timeout=setTimeout(()=>finish(scannerError('SCAN_TIMEOUT',`${purpose} timed out waiting for ${toolName}.`,{kind:'timeout',retryable:true})),REQUEST_TIMEOUT_MS);signal?.addEventListener?.('abort',abort,{once:true});ws.onmessage=async ev=>{let msg;try{msg=JSON.parse(await readWsMessageData(ev.data))}catch{return}if(msg.error){finish(scannerError('GEMINI_LIVE_ERROR',msg.error.message||JSON.stringify(msg.error),{kind:'request'}));return}if(msg.toolCall?.functionCalls?.length){const fc=msg.toolCall.functionCalls.find(x=>x.name===toolName);if(fc){result=fc.args||{};try{ws.send(JSON.stringify({toolResponse:{functionResponses:[{id:fc.id,name:fc.name,response:{result:'accepted'}}]}}))}catch{}finish(null,result)}}};ws.onerror=()=>{};ws.onclose=ev=>{if(!settled&&!result)finish(scannerError('GEMINI_LIVE_CLOSED',`${purpose} closed before result (${ev.code}${ev.reason?`: ${ev.reason}`:''}).`,{kind:'temporary',retryable:true}))};try{ws.send(JSON.stringify({clientContent:{turns:[{role:'user',parts}],turnComplete:true}}))}catch(e){finish(e)}})}

  function checkAggregate(values,total){const nums=(values||[]).map(Number).filter(Number.isFinite),t=Number(total);if(!nums.length||!Number.isFinite(t))return{average:null,error:null,ok:false};const average=nums.reduce((a,b)=>a+b,0)/nums.length,error=Math.abs(average-t);return{average,error,ok:error<=1.5}}
  function normaliseResult(core,ps,levelResult,specialAbilities,model,uncertain=[],notes='',layoutHint='outfield',abilityTraining=null){
    const roles=(core.roles||[]).map(D.normaliseRole).filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i);if(layoutHint==='gk'&&!roles.includes('GK'))roles.unshift('GK');
    const skills={};for(const[k,v]of Object.entries(core.skills||{})){const name=canonicalSkillName(k),n=Number(v);if(Number.isFinite(n))skills[name]=n}
    const rawTotals={def:Number(core.totals?.defence),att:Number(core.totals?.goalkeeping??core.totals?.attack),phys:Number(core.totals?.physical)};
    const pName=ps&&normaliseText(ps)!=='Not visible'?canonicalPlaystyle(ps):'';const lvl=pName?levelId(levelResult):0;
    const abilities=[...new Set((specialAbilities||[]).map(canonicalAbility).filter(x=>D.SPECIAL_ABILITIES.includes(x)))];
    const allUncertain=[...new Set(uncertain||[])];const conf=allUncertain.length?Math.max(.65,.95-allUncertain.length*.05):.96,resolvedLayout=layoutHint==='gk'?'gk':(roles.includes('GK')?'gk':'outfield');
    const result={version:VERSION,provider:'google-gemini-live',model,name:normaliseText(core.name),age:Number(core.age),ovr:Number(core.ovr),roles,position:roles[0]||(resolvedLayout==='gk'?'GK':null),layout:resolvedLayout,skills,playstyle:pName?{name:pName,level:lvl,levelName:levelResult}:null,specialAbilities:abilities,confidence:{overall:clamp01(conf),text:clamp01(conf),numbers:clamp01(conf),roles:clamp01(conf),playstyle:pName?clamp01(conf):0,specialAbilities:abilities.length?clamp01(conf):1},raw:{totals:rawTotals,model,warnings:allUncertain,providerResponseVersion:10,scannerScope:'full-player-live-visual-compact-confirm-v9',specialAbilityTraining:abilityTraining||{active:false}},repairNotes:notes?[notes]:[],validation:{resolved:false,unresolvedChecks:[]}};
    const required=result.layout==='gk'?[...D.GK_SKILLS,...D.GK_PHYSICAL]:[...D.OUTFIELD_SKILLS],missing=required.filter(s=>!Number.isFinite(Number(result.skills[s]))),problems=[];if(!result.name)problems.push('name missing');if(!Number.isFinite(result.age))problems.push('age missing');if(!Number.isFinite(result.ovr))problems.push('OVR missing');if(!roles.length)problems.push('role missing');if(missing.length)problems.push(`${missing.length} skill values missing`);const checks={};if(!missing.length){if(result.layout==='gk'){checks.goalkeeping=checkAggregate(D.GK_SKILLS.map(s=>result.skills[s]),rawTotals.att);checks.physical=checkAggregate(D.GK_PHYSICAL.map(s=>result.skills[s]),rawTotals.phys)}else{checks.defence=checkAggregate(D.GROUPS_OUTFIELD.Defence.map(s=>result.skills[s]),rawTotals.def);checks.attack=checkAggregate(D.GROUPS_OUTFIELD.Attack.map(s=>result.skills[s]),rawTotals.att);checks.physical=checkAggregate(D.GROUPS_OUTFIELD.Physical.map(s=>result.skills[s]),rawTotals.phys)}checks.ovr=checkAggregate(required.map(s=>result.skills[s]),result.ovr)}result.checks=checks;result.validation={resolved:problems.length===0,unresolvedChecks:problems.map(name=>({name}))};return result
  }

  async function scan(dataUrl,onProgress=()=>{},options={}){
    const signal=options?.signal||null,key=await getApiKey();if(!key)throw scannerError('NOT_CONFIGURED','Gemini Scanner is not configured. Open Settings and paste your Google AI Studio API key.');assertNotAborted(signal);const rawPlayerMedia=dataUrlToMedia(dataUrl);const playerMedia=await normaliseFrameMedia(rawPlayerMedia);await requireFrame(playerMedia);await preloadReferences();const model=MODEL;
    const emit=(progress,label,event='scan')=>onProgress({progress,label,event,model});
    const sizeContext=frameSizeContext(playerMedia),sizeLabel=playerMedia.wasNormalised?`${playerMedia.sourceWidth}×${playerMedia.sourceHeight} → ${FRAME_W}×${FRAME_H}`:`${FRAME_W}×${FRAME_H}`;
    emit(.03,`Preparing scanner evidence · ${sizeLabel}`);const layoutHint=await detectLayoutHint(playerMedia),occupancy=await detectAbilityOccupancy(playerMedia),firstLearning=occupancy.find(x=>x.learning)?.slot||null,abilityTraining=firstLearning?{active:true,firstLearningSlot:firstLearning,detail:'Special Ability learning/progress UI detected; learning slots are not treated as unlocked abilities.'}:{active:false};const[coreBoard,playstyleEvidence]=await Promise.all([buildCoreEvidenceBoard(playerMedia,layoutHint),buildPlaystyleEvidence(playerMedia)]);
    assertNotAborted(signal);emit(.12,`${layoutHint==='gk'?'Goalkeeper':'Outfield'} core data · HIGH thinking`);const core=await runLiveFunctionTask({key,model,purpose:'Core scan',toolName:'submit_core_scan',toolDeclaration:toolDecl('submit_core_scan','Submit core text and numerical fields for the current player only.',coreResponseSchema(layoutHint)),parts:[{text:sizeContext+'\n'+corePrompt(layoutHint)+'\nIMAGE A — FULL PLAYER CARD'},inlinePart(playerMedia),{text:`IMAGE B — LABELLED ${layoutHint==='gk'?'GOALKEEPER':'OUTFIELD'} CORE BOARD`},inlinePart(coreBoard)],signal});
    assertNotAborted(signal);emit(.38,'Playstyle identity · exact references · HIGH thinking');let ps=await runLiveFunctionTask({key,model,purpose:'Playstyle identity scan',toolName:'submit_playstyle_identity',toolDeclaration:toolDecl('submit_playstyle_identity','Submit only the visual playstyle identity from the exact approved reference board.',playstyleIdentityResponseSchema()),parts:[{text:sizeContext+'\n'+playstyleIdentityPrompt()+'\nIMAGE A — FULL PLAYER CARD'},inlinePart(playerMedia),{text:'IMAGE B — ENLARGED CURRENT PLAYSTYLE BADGE STRIP'},inlinePart(playstyleEvidence),{text:'IMAGE C — EXACT APPROVED PLAYSTYLE IDENTITY REFERENCES'},inlinePart(referenceMedia.playstyles)],signal});
    if(ps?.playstyle&&['Ball Playing DC','No-Nonsense DC'].includes(canonicalPlaystyle(ps.playstyle))){
      emit(.46,'Defender playstyle confirmation · exact pair · HIGH thinking');
      const bp=await compactPlaystyleStateMedia('Ball Playing DC','Standard'),nn=await compactPlaystyleStateMedia('No-Nonsense DC','Standard');
      const pair=await runLiveFunctionTask({key,model,purpose:'Defender playstyle confirmation',toolName:'submit_playstyle_pair',toolDeclaration:toolDecl('submit_playstyle_pair','Resolve Ball Playing DC versus No-Nonsense DC from the exact inner emblem.',playstylePairResponseSchema(['Ball Playing DC','No-Nonsense DC'])),parts:[{text:sizeContext+'\n'+defenderIdentityConfirmationPrompt()+'\nIMAGE A — CURRENT PLAYER PLAYSTYLE EVIDENCE'},inlinePart(playstyleEvidence),{text:'IMAGE B — EXACT BALL PLAYING DC STANDARD REFERENCE'},inlinePart(bp),{text:'IMAGE C — EXACT NO-NONSENSE DC STANDARD REFERENCE'},inlinePart(nn)],signal});
      if(pair?.playstyle)ps={...ps,playstyle:pair.playstyle,uncertainFields:[...(ps.uncertainFields||[]),...(pair.uncertainFields||[])],notes:[ps.notes,pair.notes].filter(Boolean).join(' | ')};
    }
    let levelName='Not visible',levelUncertain=[],levelNotes='',playstyleVisualState=null;
    if(ps?.playstyle&&!/^not visible$/i.test(ps.playstyle)){
      const canonical=canonicalPlaystyle(ps.playstyle),levelEvidence=await buildPlaystyleLevelEvidence(playerMedia),meta=await compactPlaystyleMeta(canonical);
      emit(.52,'Playstyle level · compact renderer · compare all exact levels · HIGH thinking');
      const standardRef=await compactPlaystyleStateMedia(canonical,'Standard'),intermediateRef=await compactPlaystyleStateMedia(canonical,'Intermediate'),advancedRef=await compactPlaystyleStateMedia(canonical,'Advanced'),masterRef=await compactPlaystyleStateMedia(canonical,'Master'),lockedRef=await compactPlaystyleStateMedia(canonical,'Locked'),readyArrowRef=await compactOverlayMedia('indicator_levelup');
      const level=await runLiveFunctionTask({key,model,purpose:'Compact playstyle level scan',toolName:'submit_playstyle_level',toolDeclaration:toolDecl('submit_playstyle_level','Compare the compact current badge against all five exact same-playstyle level references and submit only the underlying level.',playstyleLevelResponseSchema()),parts:[{text:sizeContext+'\n'+playstyleLevelPrompt(canonical)+'\nIMAGE A — CURRENT COMPACT BADGE · RAW'},inlinePart(levelEvidence.raw),{text:'IMAGE B — CURRENT COMPACT BADGE · SMOOTH'},inlinePart(levelEvidence.smooth),{text:'IMAGE C — CURRENT COMPACT BADGE · READY-ARROW ZONE MASKED'},inlinePart(levelEvidence.masked),{text:'IMAGE D — EXACT COMPACT STANDARD'},inlinePart(standardRef),{text:'IMAGE E — EXACT COMPACT INTERMEDIATE'},inlinePart(intermediateRef),{text:'IMAGE F — EXACT COMPACT ADVANCED'},inlinePart(advancedRef),{text:'IMAGE G — EXACT COMPACT MASTER'},inlinePart(masterRef),{text:'IMAGE H — EXACT COMPACT LOCKED'},inlinePart(lockedRef),{text:'IMAGE I — EXACT READY/MAX-XP ARROW · IGNORE THIS SHAPE WHEN READING LEVEL'},inlinePart(readyArrowRef)],signal});
      const declared=PLAYSTYLE_LEVELS.includes(normaliseText(level?.level))?normaliseText(level.level):'Not visible',flagsValid=['rightSegmentDark','bottomSegmentDark','leftSegmentDark'].every(k=>typeof level?.[k]==='boolean'),flagLevel=flagsValid?levelFromSegmentFlags(level.rightSegmentDark,level.bottomSegmentDark,level.leftSegmentDark):'',counted=levelFromSegmentCount(level?.darkSegmentCount);
      let firstLevel=level?.locked===true?'Locked':(flagLevel||counted||declared);
      if(!PLAYSTYLE_LEVELS.includes(firstLevel))firstLevel=declared;
      levelUncertain=[...(level?.uncertainFields||[])];
      emit(.60,'Playstyle level · mandatory independent confirmation · HIGH thinking');
      const confirm=await runLiveFunctionTask({key,model,purpose:'Compact playstyle level independent confirmation',toolName:'submit_playstyle_level_confirmation',toolDeclaration:toolDecl('submit_playstyle_level_confirmation','Independently compare the current compact badge against every exact same-playstyle level reference.',playstyleLevelConfirmationResponseSchema()),parts:[{text:sizeContext+'\n'+playstyleLevelConfirmationPrompt(canonical,firstLevel)+'\nIMAGE A — CURRENT COMPACT BADGE · READY-ARROW ZONE MASKED'},inlinePart(levelEvidence.masked),{text:'IMAGE B — CURRENT COMPACT BADGE · RAW'},inlinePart(levelEvidence.raw),{text:'IMAGE C — EXACT COMPACT STANDARD'},inlinePart(standardRef),{text:'IMAGE D — EXACT COMPACT INTERMEDIATE'},inlinePart(intermediateRef),{text:'IMAGE E — EXACT COMPACT ADVANCED'},inlinePart(advancedRef),{text:'IMAGE F — EXACT COMPACT MASTER'},inlinePart(masterRef),{text:'IMAGE G — EXACT COMPACT LOCKED'},inlinePart(lockedRef),{text:'IMAGE H — EXACT READY/MAX-XP ARROW · REMOVE THIS OVERLAY MENTALLY'},inlinePart(readyArrowRef)],signal});
      let confirmLevel=PLAYSTYLE_LEVELS.includes(normaliseText(confirm?.level))?normaliseText(confirm.level):firstLevel;
      levelUncertain.push(...(confirm?.uncertainFields||[]));
      if(confirmLevel!==firstLevel){
        emit(.66,`Playstyle level disagreement · ${firstLevel} vs ${confirmLevel} · final exact tie-break`);
        const candidates=[...new Set([firstLevel,confirmLevel])].filter(x=>PLAYSTYLE_LEVELS.includes(x));
        if(candidates.length===2){
          const r1=await compactPlaystyleStateMedia(canonical,candidates[0]),r2=await compactPlaystyleStateMedia(canonical,candidates[1]);
          const tie=await runLiveFunctionTask({key,model,purpose:'Compact playstyle level tie-break',toolName:'submit_playstyle_level_tiebreak',toolDeclaration:toolDecl('submit_playstyle_level_tiebreak','Resolve the two remaining compact level candidates from exact references only.',playstyleLevelTieBreakResponseSchema(candidates)),parts:[{text:sizeContext+'\n'+playstyleLevelTieBreakPrompt(canonical,candidates)+'\nIMAGE A — CURRENT COMPACT BADGE · READY-ARROW ZONE MASKED'},inlinePart(levelEvidence.masked),{text:'IMAGE B — CURRENT COMPACT BADGE · RAW'},inlinePart(levelEvidence.raw),{text:`IMAGE C — EXACT COMPACT ${candidates[0].toUpperCase()}`},inlinePart(r1),{text:`IMAGE D — EXACT COMPACT ${candidates[1].toUpperCase()}`},inlinePart(r2),{text:'IMAGE E — EXACT READY/MAX-XP ARROW · IGNORE THIS OVERLAY'},inlinePart(readyArrowRef)],signal});
          const tieLevel=normaliseText(tie?.level);levelName=candidates.includes(tieLevel)?tieLevel:confirmLevel;levelUncertain.push(...(tie?.uncertainFields||[]));levelNotes+=`Level first pass=${firstLevel}; independent confirmation=${confirmLevel}; tie-break=${levelName}. `;
        }else levelName=confirmLevel;
      }else{levelName=confirmLevel;levelNotes+=`Level first pass and independent confirmation agreed: ${levelName}. `}
      if(levelName!==declared&&declared!=='Not visible')levelNotes+=`Initial label=${declared}; compact confirmed=${levelName}. `;
      let overlay={ready:!!confirm?.readyArrowVisible,boosted:false,wrongPosition:false,uncertainFields:[],notes:''};
      if(levelName!=='Not visible'&&levelName!=='Locked'){
        emit(.70,'Playstyle overlays · exact compact standalone sprites · HIGH thinking');
        const category=meta?.category||'defender',boostName=`level_boosted_${category}`,boostRef=await compactOverlayMedia(boostName),wrongRef=await compactOverlayMedia('indicator_wrong_position');
        overlay=await runLiveFunctionTask({key,model,purpose:'Compact playstyle overlay scan',toolName:'submit_playstyle_overlay',toolDeclaration:toolDecl('submit_playstyle_overlay','Detect compact Ready, Boosted and Wrong Position overlays without changing the confirmed level.',playstyleOverlayResponseSchema()),parts:[{text:sizeContext+'\n'+playstyleOverlayPrompt(canonical,levelName,category)+'\nIMAGE A — CURRENT COMPACT BADGE · RAW'},inlinePart(levelEvidence.raw),{text:'IMAGE B — CURRENT COMPACT BADGE · SMOOTH'},inlinePart(levelEvidence.smooth),{text:'IMAGE C — EXACT COMPACT READY/MAX-XP ARROW'},inlinePart(readyArrowRef),{text:`IMAGE D — EXACT COMPACT ${category.toUpperCase()} BOOSTED SHELL`},inlinePart(boostRef),{text:'IMAGE E — EXACT COMPACT WRONG-POSITION NOTIFICATION'},inlinePart(wrongRef)],signal});
      }
      levelUncertain.push(...(overlay?.uncertainFields||[]));
      playstyleVisualState={level:levelName,ready:levelName==='Master'||levelName==='Locked'?false:!!overlay?.ready,boosted:levelName==='Locked'?false:!!overlay?.boosted,wrongPosition:levelName==='Locked'?false:!!overlay?.wrongPosition,firstPassLevel:firstLevel,confirmationLevel:confirmLevel,badgeLocatorDetected:!!levelEvidence?.roi?.detected,referenceRenderer:'compact'};
      levelNotes+=`Compact renderer confirmation. Ready=${playstyleVisualState.ready?'yes':'no'}, boosted=${playstyleVisualState.boosted?'yes':'no'}, wrongPosition=${playstyleVisualState.wrongPosition?'yes':'no'}. ${level?.notes||''} ${confirm?.notes||''} ${overlay?.notes||''}`;
    }
    const occupied=occupancy.filter(x=>x.occupied&&(!firstLearning||x.slot<firstLearning)),specialAbilities=[],abilityUncertain=[],abilityNotes=[];if(firstLearning)abilityNotes.push(`Special Ability learning/progress UI detected from slot ${firstLearning}; it is not counted as an unlocked ability.`);for(let i=0;i<occupied.length;i++){assertNotAborted(signal);const slot=occupied[i].slot,slotIndex=slot-1;emit(.74+(.22*Math.max(i,0)/Math.max(occupied.length,1)),`Special Ability ${i+1}/${occupied.length} · exact coloured references · HIGH thinking`);const evidence=await buildAbilitySlotEvidence(playerMedia,slotIndex),ab=await runLiveFunctionTask({key,model,purpose:`Ability slot ${slot} scan`,toolName:'submit_ability_slot_scan',toolDeclaration:toolDecl('submit_ability_slot_scan','Submit exactly one unlocked coloured Special Ability identity from the exact approved reference board.',abilitySlotResponseSchema()),parts:[{text:sizeContext+'\n'+abilitySlotPrompt(slot)+'\nIMAGE A — RAW PIXEL SLOT'},inlinePart(evidence.raw),{text:'IMAGE B — SMOOTH SLOT'},inlinePart(evidence.smooth),{text:'IMAGE C — EXACT COLOURED SPECIAL ABILITY REFERENCES'},inlinePart(referenceMedia.abilities)],signal});if(ab?.ability)specialAbilities.push(ab.ability);abilityUncertain.push(...(ab?.uncertainFields||[]));if(ab?.notes)abilityNotes.push(`slot ${slot}: ${ab.notes}`)}
    const uncertain=[...(core.uncertainFields||[]),...(ps.uncertainFields||[]),...levelUncertain,...abilityUncertain],notes=[core.notes,ps.notes,levelNotes,...abilityNotes].filter(Boolean).join(' | '),result=normaliseResult(core,ps.playstyle,levelName,specialAbilities,model,uncertain,notes,layoutHint,abilityTraining);result.raw.sourceDimensions={width:playerMedia.sourceWidth||FRAME_W,height:playerMedia.sourceHeight||FRAME_H};result.raw.normalisedDimensions={width:FRAME_W,height:FRAME_H};result.raw.wasNormalised=!!playerMedia.wasNormalised;result.raw.playstyleVisualState=playstyleVisualState;result.raw.referencePack={hqDisplayPlaystyles:260,compactScannerPlaystyles:100,compactOverlays:6,colouredSpecialAbilities:19,goldSpecialAbilities:0,totalVisualReferences:385};emit(1,'Player ready · compact playstyle confirmation + coloured ability references','complete');return result
  }

  async function health(){const key=await getApiKey();if(!key)throw scannerError('NOT_CONFIGURED','Gemini Scanner is not configured. Paste your Google AI Studio API key first.');await preloadReferences();await preflightKeyAndModel(key,MODEL,null);const ws=await openLiveSocket(key,MODEL,'Live scanner probe',null,null);try{ws.close(1000,'Probe complete')}catch{}const m=await loadReferenceManifest();const cm=await loadCompactReferenceManifest();return{ok:true,provider:'Gemini 3.1 Flash Live',model:MODEL,models:[MODEL],orderedModels:[MODEL],freeTierOnly:true,requestTimeoutMs:REQUEST_TIMEOUT_MS,thinkingLevel:'HIGH',visualReferences:m.counts.totalReferenceImages+cm.counts.totalImages,hqPlaystyleDisplayReferences:m.counts.playstyleImages,compactPlaystyleScannerReferences:cm.counts.playstyleImages,compactOverlayReferences:cm.counts.overlayImages,colouredSpecialAbilityReferences:m.counts.specialAbilityImages,goldSpecialAbilityReferences:0,referenceMode:'compact-playstylesmallatlas-double-confirm-v9'}}
  async function discoverModels(){return[MODEL]}
  async function modelOrder(){return{ready:[MODEL],cooling:[],all:[MODEL]}}

  TE.Scanner={VERSION,MODEL,MODELS,DOCUMENTED_MODELS,REQUEST_TIMEOUT_MS,RETRY_DELAY_MS,scan,health,discoverModels,modelOrder,getApiKey,setApiKey,clearApiKey,checkAggregate,_canonicalPlaystyle:canonicalPlaystyle,_baseSystemInstruction:baseSystemInstruction,_loadReferenceManifest:loadReferenceManifest,_loadCompactReferenceManifest:loadCompactReferenceManifest};
})();
