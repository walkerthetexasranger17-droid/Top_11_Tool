(() => {
  'use strict';
  const TE=window.TE5=window.TE5||{};
  const D=TE.Data,B=TE.BibleData;
  if(!D||!B) throw new Error('data.js and bible-data.js must load before scanner-engine.js');

  const VERSION=4;
  const MODEL='gemini-3.1-flash-live-preview';
  const MODELS=[MODEL],DOCUMENTED_MODELS=[MODEL];
  const API_KEY_STORAGE='te:scanner:geminiApiKey';
  const WS_BASE='wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent';
  const API_BASE='https://generativelanguage.googleapis.com/v1beta';
  const REQUEST_TIMEOUT_MS=90000;
  const RETRY_DELAY_MS=2000;
  const FRAME_W=1536,FRAME_H=695;
  const referenceMedia={};

  const PLAYSTYLES=['Poacher','False Nine','Target Man','Enganche','Inside Forward','Winger','False Winger','Mezzala','Box To Box','Regista','Ball Winner','Anchor Man','No Nonsense DC','Stopper','Ball Playing DC','Full Back','Wing Back','Ball Playing GK','Sweeper Keeper','Box Commander'];
  const PLAYSTYLE_FAMILIES={
    attacking:new Set(['Poacher','False Nine','Target Man','Enganche','Inside Forward','Winger']),
    midfield:new Set(['False Winger','Mezzala','Box To Box','Regista','Ball Winner','Anchor Man']),
    defending:new Set(['No Nonsense DC','Stopper','Ball Playing DC','Full Back','Wing Back','Ball Playing GK','Sweeper Keeper','Box Commander'])
  };
  const ABILITIES=['Aerial Defender','Blocker','Corner Specialist','Counter Attack Stopper','Cross Expert','Defensive Wall','Dribbler','Free Kick Specialist','Intercepting Specialist','Long Shots','One-on-One Scorer','One-on-One Stopper','Penalty Kick Specialist','Penalty Kick Stopper','Playmaker','Rebound Specialist','Set Piece Stopper','Set Piece Taker','Versatile Attacker'];
  const SKILLS=['tackling','marking','positioning','heading','bravery','passing','dribbling','crossing','shooting','finishing','fitness','strength','aggression','speed','creativity'];

  const PLAYSTYLE_CONFUSION_GROUPS=[
    {name:'Inside Forward / Poacher',rule:'Inside Forward has one tall central upward arrow plus TWO narrow vertical side bars (three upright elements). Poacher has a broad roof/chevron above ONE shorter upward arrow and no two tall side bars.'},
    {name:'False Winger / Winger',rule:'False Winger has a winged-ball style emblem with a distinct central crossed/X-like detail. Winger has the cleaner winged-ball emblem without that crossed centre.'},
    {name:'Defensive badge family',rule:'Ball Playing DC = shield containing a football/ball motif. Full Back = TWO overlapping shield outlines. No Nonsense DC = shield with a clear exclamation mark. Stopper = shield containing a prohibition/circle-slash motif. Wing Back = central shield with distinct wing/feather bars extending on BOTH sides.'},
    {name:'Goalkeeper hand family',rule:'Ball Playing GK = glove/hand visibly controlling a football. Box Commander = glove/hand with a STAR above it. Sweeper Keeper = glove/hand with a prominent CURVED ARROW around/beside it.'},
    {name:'Enganche / False Nine',rule:'Enganche has two linked/interlocking rounded shapes. False Nine has the longer bent tactical-route emblem with a separate X/cross mark.'},
    {name:'Mezzala / Regista',rule:'Mezzala is a single winding S/snake-like path ending at a small ball. Regista is a network of separate connected nodes/dots joined by short lines.'}
  ];
  const ABILITY_CONFUSION_GROUPS=[
    {name:'Corner Specialist / Dribbler',rule:'Corner Specialist has a distinct STRAIGHT vertical corner-flag pole/flag beside the ball. Dribbler has a continuous sweeping curved ribbon/trail and NO straight flag pole.'},
    {name:'Free Kick Specialist / Defensive Wall',rule:'Free Kick Specialist has the grouped-player/free-kick emblem PLUS a curved/upward directional arrow or sweep on the right side. On tiny player cards this arrow may be small or faint. Defensive Wall is the grouped wall/players with a ball and has NO curved/upward directional arrow.'}
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

  function cleanKey(v){return String(v||'').trim()}
  async function getApiKey(){return cleanKey(localStorage.getItem(API_KEY_STORAGE))}
  async function setApiKey(v){const k=cleanKey(v);if(k)localStorage.setItem(API_KEY_STORAGE,k);else localStorage.removeItem(API_KEY_STORAGE);return k}
  async function clearApiKey(){localStorage.removeItem(API_KEY_STORAGE)}
  function scannerError(code,message,extra={}){const e=new Error(message);e.code=code;Object.assign(e,extra);return e}
  function abortError(){return scannerError('SCAN_CANCELLED','Scan cancelled.',{kind:'cancelled'})}
  function assertNotAborted(signal){if(signal?.aborted)throw abortError()}
  function clamp01(v){return Math.max(0,Math.min(1,Number(v)||0))}
  function normaliseText(v){return String(v??'').trim().replace(/[–—]/g,'-').replace(/\s+/g,' ')}
  function playstyleConfusionGuide(){return PLAYSTYLE_CONFUSION_GROUPS.map((g,i)=>`${i+1}. ${g.name}: ${g.rule}`).join('\n')}
  function abilityConfusionGuide(){return ABILITY_CONFUSION_GROUPS.map((g,i)=>`${i+1}. ${g.name}: ${g.rule}`).join('\n')}
  function playstyleFamily(name){const n=normaliseText(name);for(const [family,set] of Object.entries(PLAYSTYLE_FAMILIES))if(set.has(n))return family;return null}
  function canonicalPlaystyle(name){const n=normaliseText(name);if(/^box[ -]?to[ -]?box$/i.test(n))return'Box-to-Box';if(/^no[ -]?nonsense dc$/i.test(n))return'No-Nonsense DC';const hit=B.PLAYSTYLES.find(x=>x.name.toLowerCase()===n.toLowerCase());return hit?.name||n}
  function levelId(name){const hit=B.PLAYSTYLE_LEVELS.find(x=>x.name.toLowerCase()===normaliseText(name).toLowerCase());return hit?.id||0}
  function canonicalAbility(name){const n=normaliseText(name);const hit=D.SPECIAL_ABILITIES.find(x=>x.toLowerCase()===n.toLowerCase());return hit||n}
  function canonicalSkillName(k){return D.OUTFIELD_SKILLS.find(x=>x.toLowerCase()===String(k).toLowerCase())||D.GK_SKILLS.find(x=>x.toLowerCase()===String(k).toLowerCase())||D.GK_PHYSICAL.find(x=>x.toLowerCase()===String(k).toLowerCase())||k}

  function dataUrlToMedia(dataUrl){const m=String(dataUrl||'').match(/^data:(image\/(?:png|jpe?g|webp));base64,([A-Za-z0-9+/=\r\n]+)$/i);if(!m)throw scannerError('INVALID_IMAGE','Choose a valid PNG, JPEG or WebP screenshot.',{scanFailure:true});return{mimeType:m[1].toLowerCase().replace('jpg','jpeg'),data:m[2].replace(/\s+/g,'')}}
  async function blobToBase64(blob){const ab=await blob.arrayBuffer(),bytes=new Uint8Array(ab);let binary='';const chunk=0x8000;for(let i=0;i<bytes.length;i+=chunk)binary+=String.fromCharCode(...bytes.subarray(i,i+chunk));return btoa(binary)}
  async function urlToMedia(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw scannerError('REFERENCE_LOAD',`Could not load scanner reference ${url} (HTTP ${r.status}).`,{scanFailure:true});const blob=await r.blob();return{data:await blobToBase64(blob),mimeType:blob.type||'image/png'}}
  function mediaToImage(media){return new Promise((res,rej)=>{const img=new Image();img.onload=()=>res(img);img.onerror=()=>rej(scannerError('INVALID_IMAGE','Could not decode screenshot.',{scanFailure:true}));img.src=`data:${media.mimeType};base64,${media.data}`})}
  function canvasToJpegMedia(c,q=.98){const u=c.toDataURL('image/jpeg',q);return{mimeType:'image/jpeg',data:u.slice(u.indexOf(',')+1)}}
  function drawCropPixels(ctx,img,roi,x,y,w,h,bg='#fff',smooth=true){ctx.fillStyle=bg;ctx.fillRect(x,y,w,h);const scale=Math.min(w/roi.w,h/roi.h),dw=Math.round(roi.w*scale),dh=Math.round(roi.h*scale);ctx.imageSmoothingEnabled=smooth;if(smooth)ctx.imageSmoothingQuality='high';ctx.drawImage(img,roi.x,roi.y,roi.w,roi.h,x+(w-dw)/2,y+(h-dh)/2,dw,dh)}
  function drawFieldCard(ctx,img,label,roi,x,y,w,h){ctx.fillStyle='#f8fafc';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#94a3b8';ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);ctx.fillStyle='#0f172a';ctx.font='bold 24px Arial';ctx.fillText(label,x+14,y+30);drawCropPixels(ctx,img,roi,x+10,y+42,w-20,h-52)}

  async function requireFrame(media){const img=await mediaToImage(media);if(img.width!==FRAME_W||img.height!==FRAME_H)throw scannerError('INVALID_IMAGE_SIZE',`Scanner requires the standard ${FRAME_W}×${FRAME_H} Top Eleven Skills screenshot; received ${img.width}×${img.height}.`,{scanFailure:true});return img}
  async function buildCoreEvidenceBoard(playerMedia){const player=await requireFrame(playerMedia),W=1800,H=1810,M=24,gap=18,c=document.createElement('canvas');c.width=W;c.height=H;const ctx=c.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.font='bold 31px Arial';ctx.fillText('COORDINATE-LOCKED CORE DATA — EACH FIELD IS ALREADY LABELLED',M,42);ctx.font='21px Arial';ctx.fillText('Read only the value inside each labelled crop. Do not borrow a neighbouring number.',M,78);let y=110;const topW=Math.floor((W-M*2-gap*3)/4),topH=180;[['NAME',ROI.name],['OVR',ROI.ovr],['AGE',ROI.age],['ROLES',ROI.roles]].forEach((it,i)=>drawFieldCard(ctx,player,it[0],it[1],M+i*(topW+gap),y,topW,topH));y+=topH+gap;const totalW=Math.floor((W-M*2-gap*2)/3),totalH=155;[['DEFENCE TOTAL',ROI.totals.defence],['ATTACK TOTAL',ROI.totals.attack],['PHYSICAL TOTAL',ROI.totals.physical]].forEach((it,i)=>drawFieldCard(ctx,player,it[0],it[1],M+i*(totalW+gap),y,totalW,totalH));y+=totalH+gap+8;const cols=[[['TACKLING','tackling'],['MARKING','marking'],['POSITIONING','positioning'],['HEADING','heading'],['BRAVERY','bravery']],[['PASSING','passing'],['DRIBBLING','dribbling'],['CROSSING','crossing'],['SHOOTING','shooting'],['FINISHING','finishing']],[['FITNESS','fitness'],['STRENGTH','strength'],['AGGRESSION','aggression'],['SPEED','speed'],['CREATIVITY','creativity']]];const cellH=245;cols.forEach((col,ci)=>col.forEach((it,ri)=>drawFieldCard(ctx,player,it[0],ROI.skills[it[1]],M+ci*(totalW+gap),y+ri*(cellH+10),totalW,cellH)));return canvasToJpegMedia(c,.98)}
  function median(a){const x=[...a].sort((m,n)=>m-n),n=x.length;return n%2?x[(n-1)/2]:(x[n/2-1]+x[n/2])/2}
  async function detectAbilityOccupancy(playerMedia){const player=await requireFrame(playerMedia),out=[];for(let i=0;i<ROI.abilitySlots.length;i++){const r=ROI.abilitySlots[i],c=document.createElement('canvas');c.width=r.w;c.height=r.h;const ctx=c.getContext('2d',{alpha:false});ctx.drawImage(player,r.x,r.y,r.w,r.h,0,0,r.w,r.h);const d=ctx.getImageData(0,0,r.w,r.h).data;const rr=[],gg=[],bb=[],bw=4;for(let y=0;y<r.h;y++)for(let x=0;x<r.w;x++){if(x>=bw&&x<r.w-bw&&y>=bw&&y<r.h-bw)continue;const k=(y*r.w+x)*4;rr.push(d[k]);gg.push(d[k+1]);bb.push(d[k+2])}const bg=[median(rr),median(gg),median(bb)];let fg=0,total=r.w*r.h,sum=0;for(let y=0;y<r.h;y++)for(let x=0;x<r.w;x++){const k=(y*r.w+x)*4,dr=d[k]-bg[0],dg=d[k+1]-bg[1],db=d[k+2]-bg[2],dist=Math.sqrt(dr*dr+dg*dg+db*db);sum+=dist;if(dist>35)fg++}const fraction=fg/total;out.push({slot:i+1,occupied:fraction>.03,foregroundFraction:fraction,meanDistance:sum/total})}return out}
  async function buildPlaystyleEvidence(playerMedia){const player=await requireFrame(playerMedia),c=document.createElement('canvas');c.width=1200;c.height=430;const ctx=c.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#111827';ctx.font='bold 28px Arial';ctx.fillText('CURRENT PLAYER — PLAYSTYLE BADGE STRIP',24,42);drawCropPixels(ctx,player,ROI.playstyleStrip,24,70,1152,330);return canvasToJpegMedia(c,.99)}
  function rgbToHsv01(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;let h=0;if(d){if(mx===r)h=((g-b)/d)%6;else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60;if(h<0)h+=360}return{h,s:mx===0?0:d/mx,v:mx}}
  function hueMatchesFamily(h,family){if(family==='attacking')return h<=24||h>=336;if(family==='midfield')return h>=28&&h<=78;if(family==='defending')return h>=72&&h<=165;return false}
  function locatePlaystyleBadgeInStrip(player,family){const r=ROI.playstyleStrip,c=document.createElement('canvas');c.width=r.w;c.height=r.h;const ctx=c.getContext('2d',{alpha:false});ctx.drawImage(player,r.x,r.y,r.w,r.h,0,0,r.w,r.h);const data=ctx.getImageData(0,0,r.w,r.h).data,col=new Int32Array(r.w);for(let y=4;y<r.h-4;y++)for(let x=0;x<r.w;x++){const k=(y*r.w+x)*4,hsv=rgbToHsv01(data[k],data[k+1],data[k+2]);if(hsv.s>=.12&&hsv.v>=.28&&hueMatchesFamily(hsv.h,family))col[x]++}const prefix=new Int32Array(r.w+1);for(let x=0;x<r.w;x++)prefix[x+1]=prefix[x]+col[x];let bestX=Math.floor(r.w/2),best=-1;for(let cx=24;cx<r.w-24;cx++){const n=prefix[Math.min(r.w,cx+24)]-prefix[Math.max(0,cx-24)];if(n>best){best=n;bestX=cx}}return{x:bestX,y:31,score:best}}
  async function buildLevelRingOnlyEvidence(playerMedia,family){const player=await requireFrame(playerMedia),loc=locatePlaystyleBadgeInStrip(player,family),r=ROI.playstyleStrip,cropSize=50,half=cropSize/2,srcX=Math.max(r.x,Math.min(r.x+r.w-cropSize,r.x+loc.x-half)),srcY=Math.max(r.y,Math.min(r.y+r.h-cropSize,r.y+loc.y-half)),W=980,H=980,c=document.createElement('canvas');c.width=W;c.height=H;const ctx=c.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.fillStyle='#111827';ctx.font='bold 31px Arial';ctx.fillText('CURRENT PLAYER — RING ONLY (CENTRE MASKED)',24,44);ctx.font='21px Arial';ctx.fillText('Use ONLY the three outer ring segments below for level. Ignore the central fill/symbol.',24,78);const pad=70,boxY=110,boxW=W-pad*2,boxH=H-boxY-55;ctx.fillStyle='#f8fafc';ctx.fillRect(pad,boxY,boxW,boxH);ctx.strokeStyle='#94a3b8';ctx.lineWidth=3;ctx.strokeRect(pad,boxY,boxW,boxH);const drawSize=Math.min(boxW-80,boxH-80),dx=pad+(boxW-drawSize)/2,dy=boxY+(boxH-drawSize)/2;ctx.imageSmoothingEnabled=false;ctx.drawImage(player,srcX,srcY,cropSize,cropSize,dx,dy,drawSize,drawSize);const cx=dx+drawSize/2,cy=dy+drawSize/2,radius=drawSize*.245,verts=[];for(let i=0;i<6;i++){const a=(-90+i*60)*Math.PI/180;verts.push([cx+Math.cos(a)*radius,cy+Math.sin(a)*radius])}ctx.beginPath();ctx.moveTo(verts[0][0],verts[0][1]);for(let i=1;i<verts.length;i++)ctx.lineTo(verts[i][0],verts[i][1]);ctx.closePath();ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#d1d5db';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#475569';ctx.font='19px Arial';ctx.fillText(`Badge locator score: ${loc.score}. Centre masked programmatically; no expected level used.`,24,H-20);return canvasToJpegMedia(c,.995)}
  async function buildLevelFamilyReference(family){const img=await mediaToImage(referenceMedia.levels),rows={attacking:{x:250,y:105,w:1165,h:290},midfield:{x:250,y:400,w:1165,h:290},defending:{x:250,y:690,w:1165,h:310}},roi=rows[family];if(!roi)throw new Error(`Unknown playstyle family: ${family}`);const c=document.createElement('canvas');c.width=1500;c.height=430;const ctx=c.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#111827';ctx.font='bold 30px Arial';ctx.fillText(`${family.toUpperCase()} LEVEL REFERENCES`,24,42);ctx.font='21px Arial';ctx.fillText('Locked | Intermediate | Advanced | Master — compare level appearance only.',24,72);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(img,roi.x,roi.y,roi.w,roi.h,24,94,1452,312);return canvasToJpegMedia(c,.995)}
  async function buildAbilitySlotEvidence(playerMedia,slotIndex){const player=await requireFrame(playerMedia),roi=ROI.abilitySlots[slotIndex],make=(smooth,label)=>{const W=1100,H=620,c=document.createElement('canvas');c.width=W;c.height=H;const ctx=c.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.fillStyle='#111827';ctx.font='bold 30px Arial';ctx.fillText(`SPECIAL ABILITY SLOT ${slotIndex+1} — ${label}`,24,42);ctx.fillStyle='#f8fafc';ctx.fillRect(24,70,W-48,H-94);ctx.strokeStyle='#94a3b8';ctx.lineWidth=2;ctx.strokeRect(24,70,W-48,H-94);const pad=26,x=24+pad,y=70+pad,w=W-48-pad*2,h=H-94-pad*2,scale=Math.min(w/roi.w,h/roi.h),dw=Math.round(roi.w*scale),dh=Math.round(roi.h*scale);ctx.imageSmoothingEnabled=smooth;if(smooth)ctx.imageSmoothingQuality='high';ctx.drawImage(player,roi.x,roi.y,roi.w,roi.h,x+(w-dw)/2,y+(h-dh)/2,dw,dh);return canvasToJpegMedia(c,.995)};return{raw:make(false,'RAW PIXELS'),smooth:make(true,'SMOOTH ENLARGEMENT')}}

  function coreResponseSchema(){const skillProps={};for(const skill of SKILLS)skillProps[skill]={type:'integer'};return{type:'object',properties:{name:{type:'string'},age:{type:'integer'},ovr:{type:'integer'},roles:{type:'array',items:{type:'string'}},totals:{type:'object',properties:{defence:{type:'integer'},attack:{type:'integer'},physical:{type:'integer'}},required:['defence','attack','physical']},skills:{type:'object',properties:skillProps,required:SKILLS},uncertainFields:{type:'array',items:{type:'string'}},notes:{type:'string'}},required:['name','age','ovr','roles','totals','skills','uncertainFields','notes']}}
  function playstyleIdentityResponseSchema(){return {type:'object',properties:{
    playstyle:{type:'string',description:`Use one of: ${[...PLAYSTYLES,'Not visible'].join(', ')}`},
    uncertainFields:{type:'array',items:{type:'string'}},notes:{type:'string'}
  },required:['playstyle','uncertainFields','notes']};}
  function playstyleLevelResponseSchema(){return {type:'object',properties:{
    lockVisible:{type:'boolean',description:'True only if a padlock is visibly present on the current player badge.'},
    leftSolid:{type:'boolean',description:'Whether the single LEFT logical segment (upper-left side + left side together) is solid rather than faded.'},
    upperRightSolid:{type:'boolean',description:'Whether the single UPPER-RIGHT logical segment (upper-right side + right side together) is solid rather than faded.'},
    bottomSolid:{type:'boolean',description:'Whether the single BOTTOM logical segment (both bottom sides together) is solid rather than faded.'},
    uncertainFields:{type:'array',items:{type:'string'}},notes:{type:'string'}
  },required:['lockVisible','leftSolid','upperRightSolid','bottomSolid','uncertainFields','notes']};}
  function abilitySlotResponseSchema(){return {type:'object',properties:{
    ability:{type:'string',description:`Exactly ONE Special Ability identity for this single occupied slot. Use only: ${ABILITIES.join(', ')}`},
    uncertainFields:{type:'array',items:{type:'string'}},notes:{type:'string'}
  },required:['ability','uncertainFields','notes']};}
  function toolDecl(name,description,parameters){return{name,description,parameters}}
  function inlinePart(media){return{inlineData:{mimeType:media.mimeType,data:media.data}}}

  function baseSystemInstruction(){return `
You are a dedicated Top Eleven visual scanner running inside Gemini 3.1 Flash Live.
Accuracy is more important than speed. Think carefully before selecting a visual match.
CRITICAL INDEPENDENCE RULE: you are never given benchmark answers, expected player data, or test ground truth. Do not guess from a player name. Derive every result from the CURRENT screenshot and the supplied reference indexes only.
Never infer a playstyle or Special Ability from position, role, stats, OVR, player name, or football semantics. Match the actual emblem geometry.
When the evidence is genuinely ambiguous, mark the relevant field uncertain instead of inventing certainty.
Call the requested submit function exactly once. Do not output prose instead of the function call.
`;}
  function corePrompt(){return `
TASK: transcribe core player data only.
IMAGE A = full 1536x695 player card for context.
IMAGE B = coordinate-locked labelled core board and is the authority.
Read name, age, OVR, roles, the three totals and all 15 skills from IMAGE B only.
Each crop is already labelled. Never borrow a neighbouring value. Do not recalculate anything.
When complete call submit_core_scan exactly once.`;}
  function playstyleIdentityPrompt(){return `
TASK: identify PLAYSTYLE IDENTITY only.
IMAGE A = full current player card.
IMAGE B = enlarged playstyle badge strip from this same player.
IMAGE C = official playstyle identity index.

IDENTITY RULES:
- Compare the player's INNER EMBLEM in IMAGE B against IMAGE C.
- Do not use name, role, position, stats, OVR, or expected/test data as clues.
- Match emblem geometry only.
- First choose the closest visual candidate, then apply every relevant global lookalike check below.
${playstyleConfusionGuide()}
- Defensive family reminder: Wing Back has a central shield with wing/feather bars on BOTH sides; Stopper uses the prohibition/circle-slash emblem; Ball Playing DC has the ball/football inside the shield; Full Back shows two overlapping shields; No Nonsense DC shows an exclamation mark.
- If no playstyle badge is genuinely visible, return Not visible.

Call submit_playstyle_identity exactly once.`;}
  function playstyleLevelPrompt(family){
    const familyName=family?family.toUpperCase():'UNKNOWN';
    return `
TASK: inspect PLAYSTYLE LEVEL RING SEGMENTS only.
The independent identity pass placed this badge in the ${familyName} colour family. This routing comes from the badge identity only, never benchmark/test truth.
IMAGE A = enlarged CURRENT PLAYER playstyle badge strip for context only.
IMAGE B = RING-ONLY crop of the SAME current player badge. The central playstyle symbol and centre fill have been masked out programmatically. IMAGE B is AUTHORITATIVE for deciding solid/faded segment states.
IMAGE C = ONLY the matching ${familyName} family level reference examples.

CRITICAL GEOMETRY: THERE ARE EXACTLY THREE LOGICAL COLOURED RING SEGMENTS, NOT SIX SIDES.
- LEFT = upper-left side + left side together as ONE continuous segment.
- UPPER-RIGHT = top-right side + right side together as ONE continuous segment.
- BOTTOM = both bottom sides together as ONE continuous segment.

REFERENCE PATTERN:
- Locked: padlock present; all three segments faded.
- Intermediate: ONLY UPPER-RIGHT is solid. LEFT and BOTTOM are faded.
- Advanced: UPPER-RIGHT and BOTTOM are solid. LEFT is faded.
- Master: LEFT, UPPER-RIGHT and BOTTOM are all solid.

MANDATORY HIGH-THINKING PROCESS:
1. Use IMAGE A only to confirm that IMAGE B is the same badge. Do NOT use IMAGE A's centre fill to judge level.
2. Use IMAGE B as the authoritative evidence for LEFT, UPPER-RIGHT and BOTTOM. The centre has deliberately been removed so it cannot bleed into the ring.
3. Check for a visible padlock using IMAGE A and IMAGE B.
4. Deliberately inspect LEFT in IMAGE B and decide solid/faded.
5. Deliberately inspect UPPER-RIGHT in IMAGE B and decide solid/faded.
6. Deliberately inspect BOTTOM in IMAGE B and decide solid/faded.
7. Compare each whole logical segment in IMAGE B with the matching family examples in IMAGE C.
8. Do NOT count hexagon sides. Two adjacent sides can belong to one logical segment.
9. Do NOT infer a segment from the colour of the central playstyle fill; it is irrelevant and masked in IMAGE B.
10. Do NOT use player identity, role, stats, or benchmark knowledge.
11. Only after inspecting all three segments, call submit_playstyle_level_segments exactly once with the four booleans and concise notes explaining what you saw in IMAGE B.
`;
  }
  function abilitySlotPrompt(slot){
    return `
TASK: identify exactly ONE SPECIAL ABILITY from exactly ONE code-confirmed occupied slot.
This request contains NO other player ability slots. Treat this slot independently.
IMAGE A = RAW pixel-preserving enlargement of occupied slot ${slot}.
IMAGE B = SMOOTH enlargement of the SAME occupied slot ${slot}.
IMAGE C = standard/unlocked Special Ability index.
IMAGE D = boosted gold/orange Special Ability index.

RULES:
- Return exactly ONE ability name for this slot.
- Match the slot independently against BOTH indexes. The two indexes use the SAME underlying icon geometry; the boosted sheet is an exact recolour of the standard sheet. Use emblem geometry first; colour/state is secondary.
- Do NOT infer from player identity, role, stats, OVR, or any other slot.
- Compare the candidate against every visually similar ability before committing. Do not reject a match just because a tiny line/arrow is faint in the player-card crop; compare the whole silhouette against the exact-geometry references.
- The RAW image preserves tiny straight lines and poles; use it to distinguish fine geometry. The SMOOTH image provides the overall silhouette.

GLOBAL LOOKALIKE CHECKS:
${abilityConfusionGuide()}

MANDATORY DETAILS:
- Corner Specialist: ball + clearly STRAIGHT corner-flag pole/flag. Dribbler: curved/sweeping trail, NO straight pole.
- Free Kick Specialist: grouped-player/free-kick emblem WITH a curved/upward arrow or sweep on the right; on tiny cards it may be subtle. Defensive Wall: grouped wall/players + ball with NO curved/upward arrow.

If genuinely ambiguous, still choose the closest visual identity but include "specialAbilitySlot${slot}" in uncertainFields.
Call submit_ability_slot_scan exactly once.`;
  }
  async function preloadReferences(){if(referenceMedia.playstyles&&referenceMedia.levels&&referenceMedia.abilitiesStandard&&referenceMedia.abilitiesBoosted)return;const urls={playstyles:'assets/scanner/playstyles-index-final.png',levels:'assets/scanner/playstyle-levels-index-final.png',abilitiesStandard:'assets/scanner/special-abilities-standard-index-final.png',abilitiesBoosted:'assets/scanner/special-abilities-boosted-index-final.png'};for(const[k,u]of Object.entries(urls))referenceMedia[k]=await urlToMedia(u)}
  async function readWsMessageData(data){if(typeof data==='string')return data;if(data instanceof Blob)return await data.text();if(data instanceof ArrayBuffer)return new TextDecoder().decode(data);return String(data??'')}
  async function preflightKeyAndModel(key,model,signal){assertNotAborted(signal);let r;try{r=await fetch(`${API_BASE}/models/${encodeURIComponent(model)}?key=${encodeURIComponent(key)}`,{cache:'no-store',signal})}catch(e){if(signal?.aborted)throw abortError();throw scannerError('NETWORK','Could not reach Gemini model endpoint.',{kind:'network',retryable:true})}let body={};try{body=await r.json()}catch{}if(!r.ok){const msg=body?.error?.message||`Model check failed HTTP ${r.status}`;const kind=r.status===401||r.status===403?'auth':r.status===429?'rate_limit':'request';throw scannerError('GEMINI_API_ERROR',msg,{status:r.status,kind,retryable:r.status===429})}return body}
  function liveSetup(model,systemText,toolDeclaration){const setup={model:`models/${model}`,generationConfig:{responseModalities:['AUDIO'],temperature:0,thinkingConfig:{thinkingLevel:'HIGH'}},systemInstruction:{parts:[{text:systemText||baseSystemInstruction()}]}};if(toolDeclaration)setup.tools=[{functionDeclarations:[toolDeclaration]}];return setup}
  async function openLiveSocket(key,model,purpose='Gemini Live session',toolDeclaration=null,signal=null){assertNotAborted(signal);return await new Promise((resolve,reject)=>{const ws=new WebSocket(`${WS_BASE}?key=${encodeURIComponent(key)}`);let settled=false;const cleanup=()=>{clearTimeout(timer);signal?.removeEventListener?.('abort',abort)};const fail=e=>{if(settled)return;settled=true;cleanup();try{ws.close()}catch{};reject(e instanceof Error?e:new Error(String(e)))};const ok=()=>{if(settled)return;settled=true;cleanup();resolve(ws)};const abort=()=>fail(abortError());const timer=setTimeout(()=>fail(scannerError('SCAN_TIMEOUT',`${purpose} timed out before setup completed.`,{kind:'timeout',retryable:true})),25000);signal?.addEventListener?.('abort',abort,{once:true});ws.onopen=()=>{try{ws.send(JSON.stringify({setup:liveSetup(model,baseSystemInstruction(),toolDeclaration)}))}catch(e){fail(e)}};ws.onmessage=async ev=>{let m;try{m=JSON.parse(await readWsMessageData(ev.data))}catch{return}if(m.setupComplete)ok();else if(m.error)fail(scannerError('GEMINI_LIVE_ERROR',m.error.message||JSON.stringify(m.error),{kind:'request'}))};ws.onerror=()=>{};ws.onclose=ev=>{if(!settled)fail(scannerError('GEMINI_LIVE_CLOSED',`${purpose} closed before setup completed (${ev.code}${ev.reason?`: ${ev.reason}`:''}).`,{kind:'temporary',retryable:true}))}})}
  async function runLiveFunctionTask({key,model,purpose,toolName,toolDeclaration,parts,signal}){const ws=await openLiveSocket(key,model,purpose,toolDeclaration,signal);let result=null;return await new Promise((resolve,reject)=>{let settled=false;const finish=(err,value)=>{if(settled)return;settled=true;clearTimeout(timeout);signal?.removeEventListener?.('abort',abort);try{ws.close(1000,value?'Task complete':'Task stopped')}catch{};err?reject(err):resolve(value)};const abort=()=>finish(abortError());const timeout=setTimeout(()=>finish(scannerError('SCAN_TIMEOUT',`${purpose} timed out waiting for ${toolName}.`,{kind:'timeout',retryable:true})),REQUEST_TIMEOUT_MS);signal?.addEventListener?.('abort',abort,{once:true});ws.onmessage=async ev=>{let msg;try{msg=JSON.parse(await readWsMessageData(ev.data))}catch{return}if(msg.error){finish(scannerError('GEMINI_LIVE_ERROR',msg.error.message||JSON.stringify(msg.error),{kind:'request'}));return}if(msg.toolCall?.functionCalls?.length){const fc=msg.toolCall.functionCalls.find(x=>x.name===toolName);if(fc){result=fc.args||{};try{ws.send(JSON.stringify({toolResponse:{functionResponses:[{id:fc.id,name:fc.name,response:{result:'accepted'}}]}}))}catch{}finish(null,result)}}};ws.onerror=()=>{};ws.onclose=ev=>{if(!settled&&!result)finish(scannerError('GEMINI_LIVE_CLOSED',`${purpose} closed before result (${ev.code}${ev.reason?`: ${ev.reason}`:''}).`,{kind:'temporary',retryable:true}))};try{ws.send(JSON.stringify({clientContent:{turns:[{role:'user',parts}],turnComplete:true}}))}catch(e){finish(e)}})}

  function checkAggregate(values,total){const nums=(values||[]).map(Number).filter(Number.isFinite),t=Number(total);if(!nums.length||!Number.isFinite(t))return{average:null,error:null,ok:false};const average=nums.reduce((a,b)=>a+b,0)/nums.length,error=Math.abs(average-t);return{average,error,ok:error<=1.5}}
  function normaliseResult(core,ps,levelResult,specialAbilities,model,uncertain=[],notes=''){
    const roles=(core.roles||[]).map(D.normaliseRole).filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i);
    const skills={};for(const[k,v]of Object.entries(core.skills||{})){const name=canonicalSkillName(k),n=Number(v);if(Number.isFinite(n))skills[name]=n}
    const rawTotals={def:Number(core.totals?.defence),att:Number(core.totals?.attack),phys:Number(core.totals?.physical)};
    const pName=ps&&normaliseText(ps)!=='Not visible'?canonicalPlaystyle(ps):'';const lvl=pName?levelId(levelResult):0;
    const abilities=[...new Set((specialAbilities||[]).map(canonicalAbility).filter(x=>D.SPECIAL_ABILITIES.includes(x)))];
    const allUncertain=[...new Set(uncertain||[])];const conf=allUncertain.length?Math.max(.65,.95-allUncertain.length*.05):.96;
    const result={version:VERSION,provider:'google-gemini-live',model,name:normaliseText(core.name),age:Number(core.age),ovr:Number(core.ovr),roles,position:roles[0]||null,layout:roles.includes('GK')?'gk':'outfield',skills,playstyle:pName?{name:pName,level:lvl,levelName:levelResult}:null,specialAbilities:abilities,confidence:{overall:clamp01(conf),text:clamp01(conf),numbers:clamp01(conf),roles:clamp01(conf),playstyle:pName?clamp01(conf):0,specialAbilities:abilities.length?clamp01(conf):1},raw:{totals:rawTotals,model,warnings:allUncertain,providerResponseVersion:6,scannerScope:'full-player-live-visual'},repairNotes:notes?[notes]:[],validation:{resolved:false,unresolvedChecks:[]}};
    const required=result.layout==='gk'?[...D.GK_SKILLS,...D.GK_PHYSICAL]:[...D.OUTFIELD_SKILLS];const missing=required.filter(s=>!Number.isFinite(Number(result.skills[s]))),problems=[];if(!result.name)problems.push('name missing');if(!Number.isFinite(result.age))problems.push('age missing');if(!Number.isFinite(result.ovr))problems.push('OVR missing');if(!roles.length)problems.push('role missing');if(missing.length)problems.push(`${missing.length} skill values missing`);const checks={};if(!missing.length){if(result.layout==='gk'){checks.goalkeeping=checkAggregate(D.GK_SKILLS.map(s=>result.skills[s]),rawTotals.att);checks.physical=checkAggregate(D.GK_PHYSICAL.map(s=>result.skills[s]),rawTotals.phys)}else{checks.defence=checkAggregate(D.GROUPS_OUTFIELD.Defence.map(s=>result.skills[s]),rawTotals.def);checks.attack=checkAggregate(D.GROUPS_OUTFIELD.Attack.map(s=>result.skills[s]),rawTotals.att);checks.physical=checkAggregate(D.GROUPS_OUTFIELD.Physical.map(s=>result.skills[s]),rawTotals.phys)}checks.ovr=checkAggregate(required.map(s=>result.skills[s]),result.ovr)}result.checks=checks;result.validation={resolved:problems.length===0,unresolvedChecks:problems.map(name=>({name}))};return result
  }

  async function scan(dataUrl,onProgress=()=>{},options={}){
    const signal=options?.signal||null,key=await getApiKey();if(!key)throw scannerError('NOT_CONFIGURED','Gemini Scanner is not configured. Open Settings and paste your Google AI Studio API key.');assertNotAborted(signal);const playerMedia=dataUrlToMedia(dataUrl);await requireFrame(playerMedia);await preloadReferences();const model=MODEL;
    const emit=(progress,label,event='scan')=>onProgress({progress,label,event,model});
    emit(.03,'Preparing scanner evidence');const occupancy=await detectAbilityOccupancy(playerMedia);const[coreBoard,playstyleEvidence]=await Promise.all([buildCoreEvidenceBoard(playerMedia),buildPlaystyleEvidence(playerMedia)]);
    assertNotAborted(signal);emit(.12,'Core player data · HIGH thinking');const core=await runLiveFunctionTask({key,model,purpose:'Core scan',toolName:'submit_core_scan',toolDeclaration:toolDecl('submit_core_scan','Submit core text and numerical fields for the current player only.',coreResponseSchema()),parts:[{text:corePrompt()+'\nIMAGE A — FULL PLAYER CARD'},inlinePart(playerMedia),{text:'IMAGE B — LABELLED CORE BOARD'},inlinePart(coreBoard)],signal});
    assertNotAborted(signal);emit(.40,'Playstyle identity · HIGH thinking');const ps=await runLiveFunctionTask({key,model,purpose:'Playstyle identity scan',toolName:'submit_playstyle_identity',toolDeclaration:toolDecl('submit_playstyle_identity','Submit only the visual playstyle identity.',playstyleIdentityResponseSchema()),parts:[{text:playstyleIdentityPrompt()+'\nIMAGE A — FULL PLAYER CARD'},inlinePart(playerMedia),{text:'IMAGE B — ENLARGED PLAYSTYLE BADGE STRIP'},inlinePart(playstyleEvidence),{text:'IMAGE C — OFFICIAL PLAYSTYLE IDENTITY INDEX'},inlinePart(referenceMedia.playstyles)],signal});
    let levelName='Not visible',levelUncertain=[],levelNotes='';if(ps?.playstyle&&!/^not visible$/i.test(ps.playstyle)){const family=playstyleFamily(ps.playstyle);if(family){emit(.57,'Playstyle level · HIGH thinking');const[familyRef,ringOnly]=await Promise.all([buildLevelFamilyReference(family),buildLevelRingOnlyEvidence(playerMedia,family)]);const seg=await runLiveFunctionTask({key,model,purpose:'Playstyle level scan',toolName:'submit_playstyle_level_segments',toolDeclaration:toolDecl('submit_playstyle_level_segments','Inspect the current badge level against the matching family references.',playstyleLevelResponseSchema()),parts:[{text:playstyleLevelPrompt(family)+'\nIMAGE A — CURRENT PLAYER BADGE STRIP'},inlinePart(playstyleEvidence),{text:'IMAGE B — CURRENT PLAYER RING ONLY (CENTRE MASKED)'},inlinePart(ringOnly),{text:`IMAGE C — ${family.toUpperCase()} LEVEL REFERENCES ONLY`},inlinePart(familyRef)],signal});const solidCount=[seg.leftSolid,seg.upperRightSolid,seg.bottomSolid].filter(Boolean).length;levelName=seg.lockVisible?'Locked':solidCount===1?'Intermediate':solidCount===2?'Advanced':solidCount===3?'Master':'Locked';levelUncertain=seg.uncertainFields||[];levelNotes=`Level read: LEFT=${seg.leftSolid?'solid':'faded'}, UPPER-RIGHT=${seg.upperRightSolid?'solid':'faded'}, BOTTOM=${seg.bottomSolid?'solid':'faded'}, lock=${seg.lockVisible?'yes':'no'} => ${levelName}. ${seg.notes||''}`}}
    const occupied=occupancy.filter(x=>x.occupied),specialAbilities=[],abilityUncertain=[],abilityNotes=[];for(let i=0;i<occupied.length;i++){assertNotAborted(signal);const slot=occupied[i].slot,slotIndex=slot-1;emit(.70+(.24*Math.max(i,0)/Math.max(occupied.length,1)),`Special Ability ${i+1}/${occupied.length} · HIGH thinking`);const evidence=await buildAbilitySlotEvidence(playerMedia,slotIndex),ab=await runLiveFunctionTask({key,model,purpose:`Ability slot ${slot} scan`,toolName:'submit_ability_slot_scan',toolDeclaration:toolDecl('submit_ability_slot_scan','Submit exactly one Special Ability identity for the single occupied slot.',abilitySlotResponseSchema()),parts:[{text:abilitySlotPrompt(slot)+'\nIMAGE A — RAW PIXEL SLOT'},inlinePart(evidence.raw),{text:'IMAGE B — SMOOTH SLOT'},inlinePart(evidence.smooth),{text:'IMAGE C — STANDARD SPECIAL ABILITY INDEX'},inlinePart(referenceMedia.abilitiesStandard),{text:'IMAGE D — BOOSTED GOLD SPECIAL ABILITY INDEX'},inlinePart(referenceMedia.abilitiesBoosted)],signal});if(ab?.ability)specialAbilities.push(ab.ability);abilityUncertain.push(...(ab?.uncertainFields||[]));if(ab?.notes)abilityNotes.push(`slot ${slot}: ${ab.notes}`)}
    const uncertain=[...(core.uncertainFields||[]),...(ps.uncertainFields||[]),...levelUncertain,...abilityUncertain];const notes=[core.notes,ps.notes,levelNotes,...abilityNotes].filter(Boolean).join(' | ');const result=normaliseResult(core,ps.playstyle,levelName,specialAbilities,model,uncertain,notes);emit(1,'Player ready · core + playstyle + level + abilities','complete');return result
  }

  async function health(){const key=await getApiKey();if(!key)throw scannerError('NOT_CONFIGURED','Gemini Scanner is not configured. Paste your Google AI Studio API key first.');await preloadReferences();await preflightKeyAndModel(key,MODEL,null);const ws=await openLiveSocket(key,MODEL,'Live scanner probe',null,null);try{ws.close(1000,'Probe complete')}catch{}return{ok:true,provider:'Gemini 3.1 Flash Live',model:MODEL,models:[MODEL],orderedModels:[MODEL],freeTierOnly:true,requestTimeoutMs:REQUEST_TIMEOUT_MS,thinkingLevel:'HIGH',visualReferences:4}}
  async function discoverModels(){return[MODEL]}
  async function modelOrder(){return{ready:[MODEL],cooling:[],all:[MODEL]}}

  TE.Scanner={VERSION,MODEL,MODELS,DOCUMENTED_MODELS,REQUEST_TIMEOUT_MS,RETRY_DELAY_MS,scan,health,discoverModels,modelOrder,getApiKey,setApiKey,clearApiKey,checkAggregate,_canonicalPlaystyle:canonicalPlaystyle,_playstyleFamily:playstyleFamily,_baseSystemInstruction:baseSystemInstruction};
})();
