(() => {
  const TE=window.TE5=window.TE5||{};
  const D=TE.Data,B=TE.BibleData;
  if(!D||!B) throw new Error('data.js and bible-data.js must load before scanner-engine.js');

  const VERSION=3;
  const DOCUMENTED_MODELS=['gemini-3.8-flash'];
  const MODEL='gemini-3.8-flash';
  const MODELS=[MODEL];
  const API_KEY_STORAGE='te:scanner:geminiApiKey';
  const MODEL_HEALTH_STORAGE='te:scanner:modelHealth:v1';
  const API_BASE='https://generativelanguage.googleapis.com/v1beta';
  const REFERENCE_MANIFEST='./assets/scanner/reference-manifest.json';
  const LEVELS=['Locked','Intermediate','Advanced','Master'];
  const ABILITIES=[...D.SPECIAL_ABILITIES];
  const DISCOVERY_TTL_MS=15*60*1000;
  const REQUEST_TIMEOUT_MS=20000;
  const REQUEST_RETRY_DELAYS_MS=[0,3000,8000];
  const VISUAL_BOX_SCALE=1000;
  let referencePromise=null,discoveryCache=null;
  const visualDescriptorCache=new Map();

  function cleanKey(value){return String(value||'').trim();}
  async function getApiKey(){return cleanKey(localStorage.getItem(API_KEY_STORAGE));}
  async function setApiKey(value){
    const key=cleanKey(value);
    if(key)localStorage.setItem(API_KEY_STORAGE,key); else localStorage.removeItem(API_KEY_STORAGE);
    discoveryCache=null;
    return key;
  }
  async function clearApiKey(){localStorage.removeItem(API_KEY_STORAGE);discoveryCache=null;}

  function finiteOrNull(v){const n=Number(v);return Number.isFinite(n)?n:null;}
  function validRole(v){const r=D.normaliseRole(v);return r||null;}
  function clamp01(v){return Math.max(0,Math.min(1,Number(v)||0));}
  function dataUrlPart(dataUrl){
    const m=String(dataUrl||'').match(/^data:(image\/(?:png|jpe?g|webp));base64,([A-Za-z0-9+/=\r\n]+)$/i);
    if(!m)throw scannerError('INVALID_IMAGE','Choose a valid PNG, JPEG or WebP screenshot.',{scanFailure:true});
    return {inline_data:{mime_type:m[1].toLowerCase().replace('jpg','jpeg'),data:m[2].replace(/\s+/g,'')}};
  }
  function loadImage(src){
    return new Promise((resolve,reject)=>{
      const img=new Image();img.decoding='async';img.onload=()=>resolve(img);img.onerror=()=>reject(new Error(`Scanner reference asset is missing or unreadable: ${src}`));img.src=src;
    });
  }
  async function references(){
    if(!referencePromise)referencePromise=(async()=>{
      const r=await fetch(REFERENCE_MANIFEST,{cache:'force-cache'});if(!r.ok)throw new Error('Scanner reference manifest is missing.');
      const manifest=await r.json();
      const load=async row=>({...row,image:await loadImage(row.file)});
      const [playstyles,playstyleLevels,specialAbilities]=await Promise.all([
        Promise.all((manifest.playstyles||[]).map(load)),
        Promise.all((manifest.playstyleLevels||[]).map(load)),
        Promise.all((manifest.specialAbilities||[]).map(load))
      ]);
      if(playstyles.length!==20||playstyleLevels.length!==4||specialAbilities.length!==19)throw new Error('Scanner reference library is incomplete. Expected 20 playstyle identities, 4 playstyle levels and 19 special abilities.');
      return{manifest,playstyles,playstyleLevels,specialAbilities};
    })();
    return referencePromise;
  }

  function buildPrompt(){
    const outfield=[...D.OUTFIELD_SKILLS],gk=[...D.GK_SKILLS,...D.GK_PHYSICAL];
    return `You are Scanner v3 for a private Top Eleven companion app. Analyse ONLY the supplied current Top Eleven player screenshot. There are NO reference images in this request. Read the visible player text and numbers directly from the screenshot with extreme care.

IMPORTANT: this request has two jobs only:
A) read the visible player data exactly;
B) locate any visible playstyle badge and visible special-ability icons by bounding box WITHOUT naming or classifying those icons. The app will identify icons locally from exact game assets after your response.

HARD RULES
1. Never invent, infer, average, reconcile or alter a number to make OVR or column totals agree. If a number is unclear, omit that skill and add a warning.
2. Read player name, age, OVR, every visible natural role, the three large group totals and every visible skill value.
3. A playstyle badge is considered visible only when the actual playstyle badge/icon is visibly displayed. The word "Playstyle" in a menu/navigation row is NOT a badge. If no actual badge is visible, return playstyleBadge=null.
4. For special abilities, inspect the row after the words "Special ability:" and return ONE tight bounding box per visible ability icon, left to right. Do not name the ability. If there are no visible ability icons, return an empty array.
5. Bounding boxes are relative to the ENTIRE supplied screenshot and use a 0..1000 coordinate system: [x,y,width,height], with x/y at the top-left. Keep each box tight around the icon/badge and exclude nearby text.
6. Do not identify playstyle names, playstyle levels or special-ability names yourself. The app performs those comparisons locally.
7. Return JSON only. Confidence fields are numbers from 0 to 1.

Allowed roles: ${D.ALL_POSITIONS.join(', ')}.
Outfield skills (exact names): ${outfield.join(', ')}.
Goalkeeper skills (exact names): ${gk.join(', ')}.

For an outfield player, totals.def/att/phys are the large DEFENCE/ATTACK/PHYSICAL numbers above the columns. For a goalkeeper put the GOALKEEPING total in totals.att for app compatibility, totals.phys is PHYSICAL, and totals.def may be null.

Return exactly this object shape:
{
  "name": string|null,
  "age": number|null,
  "ovr": number|null,
  "roles": string[],
  "layout": "outfield"|"gk",
  "totals": {"def": number|null, "att": number|null, "phys": number|null},
  "skills": {"Skill Name": number},
  "visualRegions": {
    "playstyleBadge": {"bbox":[number,number,number,number]}|null,
    "specialAbilityIcons": [{"bbox":[number,number,number,number]}]
  },
  "confidence": {"overall":number,"text":number,"numbers":number,"roles":number,"visualRegions":number},
  "warnings": string[]
}`;
  }

  function extractText(body){
    const parts=body?.candidates?.[0]?.content?.parts||[];
    const text=parts.map(p=>p?.text||'').join('').trim();
    if(!text)throw scannerError('EMPTY_RESPONSE','Gemini returned no scanner result.',{scanFailure:true});
    return text;
  }
  function parseJson(text){
    const s=String(text||'').trim();
    try{return JSON.parse(s);}catch(_){const a=s.indexOf('{'),b=s.lastIndexOf('}');if(a>=0&&b>a){try{return JSON.parse(s.slice(a,b+1));}catch(__){/* fall through */}}throw scannerError('INVALID_RESPONSE','Gemini returned an unreadable scanner result.',{scanFailure:true});}
  }

  function scannerError(code,message,extra={}){const e=new Error(message);e.code=code;Object.assign(e,extra);return e;}
  function parseDurationMs(value){
    if(value==null)return 0;const s=String(value).trim();
    const m=s.match(/^([0-9]+(?:\.[0-9]+)?)s$/i);if(m)return Math.ceil(Number(m[1])*1000);
    const ms=s.match(/^([0-9]+(?:\.[0-9]+)?)ms$/i);if(ms)return Math.ceil(Number(ms[1]));
    return 0;
  }
  function retryAfterFrom(response,body,detail=''){
    let ms=0;
    const header=response?.headers?.get?.('Retry-After');
    if(header){const n=Number(header);if(Number.isFinite(n))ms=Math.max(ms,n*1000);else{const t=Date.parse(header);if(Number.isFinite(t))ms=Math.max(ms,t-Date.now());}}
    for(const d of body?.error?.details||[]){if(String(d?.['@type']||'').includes('RetryInfo'))ms=Math.max(ms,parseDurationMs(d.retryDelay));}
    const m=String(detail).match(/retry in\s+([0-9]+(?:\.[0-9]+)?)s/i);if(m)ms=Math.max(ms,Math.ceil(Number(m[1])*1000));
    return Math.max(0,ms);
  }
  function quotaInfo(body,detail=''){
    const violations=[];for(const d of body?.error?.details||[]){if(String(d?.['@type']||'').includes('QuotaFailure'))for(const v of d.violations||[])violations.push(v);}
    const ids=violations.map(v=>String(v.quotaId||''));
    const daily=ids.some(x=>/PerDay/i.test(x))||/per day|daily quota|day-free/i.test(detail);
    const perMinute=ids.some(x=>/PerMinute/i.test(x))||/per minute|rate limit/i.test(detail);
    return{violations,daily,perMinute};
  }
  function classifyApiError(response,body,model){
    const status=Number(response?.status)||0,detail=body?.error?.message||body?.message||`HTTP ${status}`;
    const retryAfterMs=retryAfterFrom(response,body,detail),quota=quotaInfo(body,detail);
    const demand=/high demand|overload|overloaded|temporar|capacity|unavailable|service unavailable|try again/i.test(detail);
    let kind='request',retryable=false,failover=false,scanFailure=false;
    if(status===408||[500,502,503,504].includes(status)){kind='temporary';retryable=true;failover=true;}
    else if(status===429){kind=quota.daily?'quota_daily':'rate_limit';retryable=!quota.daily;failover=true;}
    else if(status===404&&/model|not found|not supported|unavailable/i.test(detail)){kind='model_unavailable';failover=true;}
    else if(status===401||status===403){kind='auth';}
    else if(status===400&&/API key|key not valid|invalid api key/i.test(detail)){kind='auth';}
    else if(status>=400&&status<500){kind='request';scanFailure=true;}
    if(demand&&status===429&&!quota.daily){kind='temporary';retryable=true;failover=true;}
    let message=`Gemini scanner error: ${detail}`;
    if(kind==='auth')message=`Gemini API key was rejected. ${detail}`;
    else if(kind==='quota_daily')message=`${modelLabel(model)} free-tier daily quota is exhausted. Try again after Google resets the free quota.`;
    else if(kind==='rate_limit')message=`${modelLabel(model)} is rate limited right now.`;
    else if(kind==='temporary')message=`${modelLabel(model)} is temporarily busy or unavailable.`;
    else if(kind==='model_unavailable')message=`${modelLabel(model)} is not available to this API key.`;
    return scannerError('GEMINI_API_ERROR',message,{status,detail,kind,retryable,failover,scanFailure,retryAfterMs,model,quota});
  }
  async function apiFetch(path,options={},model=''){
    const key=await getApiKey();
    if(!key)throw scannerError('NOT_CONFIGURED','Gemini Scanner is not configured. Open Settings and paste your free Gemini API key.');
    let response;
    try{response=await fetch(`${API_BASE}${path}`,{...options,headers:{'Content-Type':'application/json','x-goog-api-key':key,...(options.headers||{})}});}catch(err){
      if(options.signal?.aborted)throw err;
      throw scannerError('NETWORK','Could not reach the Gemini API. Check your internet connection.',{retryable:true,kind:'network'});
    }
    let body=null;try{body=await response.json();}catch(_){/* ignored */}
    if(!response.ok)throw classifyApiError(response,body,model);
    return body;
  }

  function modelLabel(model){return String(model||'Gemini').replace(/^gemini-/,'Gemini ').replace(/-flash$/,' Flash').replace(/-/g,' ');}
  function loadHealth(){try{return JSON.parse(localStorage.getItem(MODEL_HEALTH_STORAGE)||'{}')||{};}catch(_){return{};}}
  function saveHealth(h){try{localStorage.setItem(MODEL_HEALTH_STORAGE,JSON.stringify(h));}catch(_){/* best effort */}}
  function noteModelResult(model,{success=false,error=null}={}){
    const all=loadHealth(),h=all[model]||{};h.lastTriedAt=Date.now();
    if(success){h.lastSuccessAt=Date.now();h.consecutiveTransient=0;h.cooldownUntil=0;all.lastSuccessfulModel=model;}
    else if(error){h.lastErrorKind=error.kind||error.code||'error';h.lastErrorAt=Date.now();h.consecutiveTransient=(h.consecutiveTransient||0)+1;}
    all[model]=h;saveHealth(all);
  }
  async function discoverModels(force=false){
    const now=Date.now();if(!force&&discoveryCache&&now-discoveryCache.at<DISCOVERY_TTL_MS)return discoveryCache.models;
    let body;try{body=await apiFetch('/models?pageSize=1000',{method:'GET',headers:{Accept:'application/json'}});}catch(err){if(discoveryCache)return discoveryCache.models;return [...DOCUMENTED_MODELS];}
    const listed=(body?.models||[]).filter(m=>(m.supportedGenerationMethods||m.supportedActions||[]).some(x=>String(x).toLowerCase()==='generatecontent')).map(m=>String(m.name||'').replace(/^models\//,''));
    const supported=DOCUMENTED_MODELS.filter(id=>listed.includes(id));
    discoveryCache={at:now,models:supported.length?supported:[...DOCUMENTED_MODELS],listed};
    return discoveryCache.models;
  }
  async function modelOrder(){
    const available=await discoverModels();const ready=available.includes(MODEL)?[MODEL]:[];return{ready,cooling:[],all:ready.length?ready:[MODEL]};
  }

  function sleep(ms,signal){
    return new Promise((resolve,reject)=>{
      if(signal?.aborted)return reject(scannerError('SCAN_CANCELLED','Scan cancelled.',{kind:'cancelled'}));
      const t=setTimeout(done,ms);function done(){cleanup();resolve();}function abort(){clearTimeout(t);cleanup();reject(scannerError('SCAN_CANCELLED','Scan cancelled.',{kind:'cancelled'}));}
      function cleanup(){signal?.removeEventListener?.('abort',abort);}
      signal?.addEventListener?.('abort',abort,{once:true});
    });
  }
  async function apiFetchWithTimeout(path,options={},model='',timeoutMs=REQUEST_TIMEOUT_MS,externalSignal=null){
    const controller=new AbortController();let timedOut=false;
    const timer=setTimeout(()=>{timedOut=true;controller.abort();},timeoutMs);
    const abortExternal=()=>controller.abort();
    if(externalSignal?.aborted)controller.abort();else externalSignal?.addEventListener?.('abort',abortExternal,{once:true});
    try{return await apiFetch(path,{...options,signal:controller.signal},model);}catch(err){
      if(controller.signal.aborted){
        if(externalSignal?.aborted)throw scannerError('SCAN_CANCELLED','Scan cancelled.',{kind:'cancelled'});
        if(timedOut)throw scannerError('SCAN_TIMEOUT',`${modelLabel(model)} did not answer within ${Math.round(timeoutMs/1000)} seconds.`,{retryable:true,kind:'timeout',model});
      }
      throw err;
    }finally{clearTimeout(timer);externalSignal?.removeEventListener?.('abort',abortExternal);}
  }

  function normaliseBox(raw){
    const a=Array.isArray(raw)?raw:raw?.bbox;
    if(!Array.isArray(a)||a.length!==4)return null;
    const vals=a.map(Number);if(vals.some(v=>!Number.isFinite(v)))return null;
    let [x,y,w,h]=vals;x=Math.max(0,Math.min(VISUAL_BOX_SCALE,x));y=Math.max(0,Math.min(VISUAL_BOX_SCALE,y));w=Math.max(0,Math.min(VISUAL_BOX_SCALE-x,w));h=Math.max(0,Math.min(VISUAL_BOX_SCALE-y,h));
    if(w<3||h<3)return null;return[x,y,w,h];
  }
  function normaliseCoreResult(raw={},usedModel=MODEL){
    const roles=[...(Array.isArray(raw.roles)?raw.roles:[])].map(validRole).filter(Boolean).filter((x,i,a)=>a.indexOf(x)===i).slice(0,3);
    const layout=(raw.layout==='gk'||roles.includes('GK'))?'gk':'outfield';
    const allowedSkills=layout==='gk'?[...D.GK_SKILLS,...D.GK_PHYSICAL]:[...D.OUTFIELD_SKILLS];
    const skills={};for(const name of allowedSkills){const n=finiteOrNull(raw.skills?.[name]);if(n!=null&&n>=0&&n<=520)skills[name]=n;}
    const regions=raw.visualRegions||{};const playstyleBadge=normaliseBox(regions.playstyleBadge);const specialAbilityIcons=(Array.isArray(regions.specialAbilityIcons)?regions.specialAbilityIcons:[]).map(normaliseBox).filter(Boolean).slice(0,6);
    const c=raw.confidence||{},warnings=[...(Array.isArray(raw.warnings)?raw.warnings:[])].map(String).slice(0,30);
    return{version:VERSION,provider:'google-gemini-developer-api-free',model:usedModel,name:String(raw.name||'').trim(),age:finiteOrNull(raw.age),ovr:finiteOrNull(raw.ovr),roles,position:roles[0]||null,layout,skills,playstyle:null,specialAbilities:[],confidence:{overall:clamp01(c.overall),text:clamp01(c.text),numbers:clamp01(c.numbers),roles:clamp01(c.roles),playstyle:0,specialAbilities:0,visualRegions:clamp01(c.visualRegions)},raw:{totals:{def:finiteOrNull(raw.totals?.def),att:finiteOrNull(raw.totals?.att),phys:finiteOrNull(raw.totals?.phys)},visualRegions:{playstyleBadge,specialAbilityIcons},visualMatch:null,model:usedModel,warnings,providerResponseVersion:4},repairNotes:warnings,validation:{resolved:true,unresolvedChecks:[]}};
  }

  function makeCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
  function boxToRect(box,image){
    if(!box)return null;const iw=image.naturalWidth||image.width,ih=image.naturalHeight||image.height;const [x,y,w,h]=box;
    const pad=.04;let rx=x/VISUAL_BOX_SCALE*iw,ry=y/VISUAL_BOX_SCALE*ih,rw=w/VISUAL_BOX_SCALE*iw,rh=h/VISUAL_BOX_SCALE*ih;
    rx-=rw*pad;ry-=rh*pad;rw*=1+pad*2;rh*=1+pad*2;rx=Math.max(0,rx);ry=Math.max(0,ry);rw=Math.min(iw-rx,rw);rh=Math.min(ih-ry,rh);return{x:rx,y:ry,w:rw,h:rh};
  }
  function median(values){if(!values.length)return 0;const a=[...values].sort((x,y)=>x-y),m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2;}
  function percentile(values,q){if(!values.length)return 0;const a=[...values].sort((x,y)=>x-y),i=Math.max(0,Math.min(a.length-1,Math.floor((a.length-1)*q)));return a[i];}
  function tightPixels(image,rect=null,size=64,isReference=false){
    const probe=96,src=makeCanvas(probe,probe),ctx=src.getContext('2d',{willReadFrequently:true});ctx.clearRect(0,0,probe,probe);
    const sx=rect?.x??0,sy=rect?.y??0,sw=rect?.w??image.naturalWidth??image.width,sh=rect?.h??image.naturalHeight??image.height;
    ctx.drawImage(image,sx,sy,sw,sh,0,0,probe,probe);const raw=ctx.getImageData(0,0,probe,probe),d=raw.data;
    let transparent=0;for(let p=0;p<probe*probe;p++)if(d[p*4+3]<220)transparent++;
    const useAlpha=isReference&&transparent>probe*probe*.02;const br=[],bg=[],bb=[];
    if(!useAlpha){for(let y=0;y<probe;y++)for(let x=0;x<probe;x++){if(x>2&&x<probe-3&&y>2&&y<probe-3)continue;const i=(y*probe+x)*4;if(d[i+3]<15)continue;br.push(d[i]);bg.push(d[i+1]);bb.push(d[i+2]);}}
    const base=[median(br),median(bg),median(bb)],distances=[];
    if(!useAlpha){for(let p=0;p<probe*probe;p++){const i=p*4;if(d[i+3]<15){distances.push(0);continue;}const dr=d[i]-base[0],dg=d[i+1]-base[1],db=d[i+2]-base[2];distances.push(Math.sqrt(dr*dr+dg*dg+db*db));}}
    const threshold=useAlpha?0:Math.max(18,percentile(distances,.45));
    let x1=probe,y1=probe,x2=-1,y2=-1;
    for(let y=0;y<probe;y++)for(let x=0;x<probe;x++){const p=y*probe+x,i=p*4;const on=useAlpha?d[i+3]>20:distances[p]>threshold;if(on){x1=Math.min(x1,x);y1=Math.min(y1,y);x2=Math.max(x2,x);y2=Math.max(y2,y);}}
    if(x2<x1||y2<y1){x1=0;y1=0;x2=probe-1;y2=probe-1;}
    const bw=x2-x1+1,bh=y2-y1+1,out=makeCanvas(size,size),octx=out.getContext('2d',{willReadFrequently:true});octx.clearRect(0,0,size,size);octx.drawImage(src,x1,y1,bw,bh,0,0,size,size);
    return{data:octx.getImageData(0,0,size,size),aspect:bw/Math.max(1,bh)};
  }
  function hogDescriptor(image,rect=null,isReference=false){
    const tight=tightPixels(image,rect,64,isReference),d=tight.data.data,n=64*64,gray=new Float32Array(n);let mean=0;
    for(let p=0;p<n;p++){const i=p*4,a=d[i+3]/255,r=d[i]*a+220*(1-a),g=d[i+1]*a+220*(1-a),b=d[i+2]*a+220*(1-a);const v=.299*r+.587*g+.114*b;gray[p]=v;mean+=v;}mean/=n;
    let variance=0;for(let p=0;p<n;p++){const q=gray[p]-mean;variance+=q*q;}const sd=Math.sqrt(variance/n)||1;for(let p=0;p<n;p++)gray[p]=(gray[p]-mean)/sd;
    const gx=new Float32Array(n),gy=new Float32Array(n),mag=new Float32Array(n),ang=new Float32Array(n);
    for(let y=1;y<63;y++)for(let x=1;x<63;x++){const p=y*64+x,xx=gray[p+1]-gray[p-1],yy=gray[p+64]-gray[p-64];gx[p]=xx;gy[p]=yy;mag[p]=Math.sqrt(xx*xx+yy*yy);let a=Math.atan2(yy,xx);while(a<0)a+=Math.PI;while(a>=Math.PI)a-=Math.PI;ang[p]=a;}
    const bins=9,cells=8,cellSize=8,vec=[];
    for(let cy=0;cy<cells;cy++)for(let cx=0;cx<cells;cx++){const hist=new Float32Array(bins);for(let y=cy*cellSize;y<(cy+1)*cellSize;y++)for(let x=cx*cellSize;x<(cx+1)*cellSize;x++){const p=y*64+x,z=ang[p]/Math.PI*bins,bi=Math.floor(z)%bins,f=z-Math.floor(z),m=mag[p];hist[bi]+=m*(1-f);hist[(bi+1)%bins]+=m*f;}let norm=0;for(const v of hist)norm+=v*v;norm=Math.sqrt(norm)||1;for(const v of hist)vec.push(v/norm);}
    let norm=0;for(const v of vec)norm+=v*v;norm=Math.sqrt(norm)||1;return{vector:vec.map(v=>v/norm),aspect:tight.aspect};
  }
  function levelDescriptor(image,rect=null,isReference=false){
    const tight=tightPixels(image,rect,64,isReference),d=tight.data.data;
    const region=(x1,y1,x2,y2)=>{let red=0,dark=0,n=0;for(let y=y1;y<y2;y++)for(let x=x1;x<x2;x++){const i=(y*64+x)*4,a=d[i+3]/255,r=d[i]*a+245*(1-a),g=d[i+1]*a+245*(1-a),b=d[i+2]*a+245*(1-a),lum=.299*r+.587*g+.114*b;red+=(r-(g+b)/2)/255;dark+=(255-lum)/255;n++;}return[red/Math.max(1,n),dark/Math.max(1,n)];};
    const left=region(6,19,14,42),right=region(50,19,58,42),bottom=region(22,52,42,60),lock=region(25,39,39,60);
    return{vector:[left[0],right[0],bottom[0],lock[1]],aspect:tight.aspect};
  }
  function cosine(a,b){let dot=0,aa=0,bb=0;for(let i=0;i<Math.min(a.length,b.length);i++){dot+=a[i]*b[i];aa+=a[i]*a[i];bb+=b[i]*b[i];}return aa&&bb?dot/Math.sqrt(aa*bb):0;}
  function euclidean(a,b){let sum=0;for(let i=0;i<Math.min(a.length,b.length);i++){const d=a[i]-b[i];sum+=d*d;}return Math.sqrt(sum);}
  function diceShift(a,b,size=48,maxShift=4){
    let best=0;for(let dy=-maxShift;dy<=maxShift;dy++)for(let dx=-maxShift;dx<=maxShift;dx++){let inter=0,na=0,nb=0;for(let y=0;y<size;y++){const by=y+dy;if(by<0||by>=size)continue;for(let x=0;x<size;x++){const bx=x+dx;if(bx<0||bx>=size)continue;const av=a[y*size+x],bv=b[by*size+bx];if(av)na++;if(bv)nb++;if(av&&bv)inter++;}}const score=na+nb?2*inter/(na+nb):0;if(score>best)best=score;}return best;
  }
  function rankedMatch(screenDescriptor,rows,kind){
    const scores=rows.map(row=>{const key=`${kind}:${row.file}`;let ref=visualDescriptorCache.get(key);if(!ref){ref=kind==='level'?levelDescriptor(row.image,null,true):hogDescriptor(row.image,null,true);visualDescriptorCache.set(key,ref);}let score=0;if(kind==='level'){score=1/(1+2*euclidean(screenDescriptor.vector,ref.vector));}else{const h=Math.max(0,cosine(screenDescriptor.vector,ref.vector));if(kind==='ability'){const ratio=Math.min(screenDescriptor.aspect,ref.aspect)/Math.max(screenDescriptor.aspect,ref.aspect);score=.85*h+.15*ratio;}else score=h;}return{row,score};}).sort((a,b)=>b.score-a.score);
    return{best:scores[0]||null,second:scores[1]||null,all:scores};
  }
  function acceptMatch(match,{minScore,margin}){
    const best=match?.best,second=match?.second;if(!best)return null;const gap=best.score-(second?.score||0);return best.score>=minScore&&gap>=margin?{name:best.row.name,score:best.score,margin:gap,runnerUp:second?.row?.name||null,runnerUpScore:second?.score||0}:null;
  }
  async function localVisualMatch(dataUrl,regions,refs,onProgress=()=>{}){
    const image=await loadImage(dataUrl);const debug={playstyleIdentity:null,playstyleLevel:null,specialAbilities:[]};let playstyle=null,specialAbilities=[];
    if(regions?.playstyleBadge){
      const rect=boxToRect(regions.playstyleBadge,image);if(rect){
        const idRank=rankedMatch(hogDescriptor(image,rect,false),refs.playstyles,'playstyle');const lvlRank=rankedMatch(levelDescriptor(image,rect,false),refs.playstyleLevels,'level');
        const id=acceptMatch(idRank,{minScore:.70,margin:.009}),lvl=acceptMatch(lvlRank,{minScore:.65,margin:.03});
        debug.playstyleIdentity={best:idRank.best?.row?.name||null,score:idRank.best?.score||0,runnerUp:idRank.second?.row?.name||null,margin:(idRank.best?.score||0)-(idRank.second?.score||0),accepted:!!id};
        debug.playstyleLevel={best:lvlRank.best?.row?.name||null,score:lvlRank.best?.score||0,runnerUp:lvlRank.second?.row?.name||null,margin:(lvlRank.best?.score||0)-(lvlRank.second?.score||0),accepted:!!lvl};
        if(id&&lvl){const psDef=D.playstyleDefinition(id.name),legacy=id.name==='Holding Midfielder';const levelDef=D.PLAYSTYLE_LEVELS.find(x=>String(x.name).toLowerCase()===String(lvl.name).toLowerCase());if(levelDef&&((psDef&&psDef.id!==1)||legacy))playstyle={name:psDef?.name||id.name,type:psDef?.type||id.name,level:levelDef.id,levelName:levelDef.name,confidence:clamp01((id.score+lvl.score)/2)};}
      }
    }
    const boxes=regions?.specialAbilityIcons||[];for(let i=0;i<boxes.length;i++){
      onProgress({progress:.91+Math.min(.05,(i+1)*.05/Math.max(1,boxes.length)),label:`Matching ability ${i+1}/${boxes.length} locally`,event:'local-match'});
      const rect=boxToRect(boxes[i],image);if(!rect)continue;const rank=rankedMatch(hogDescriptor(image,rect,false),refs.specialAbilities,'ability');const hit=acceptMatch(rank,{minScore:.50,margin:.018});debug.specialAbilities.push({index:i,best:rank.best?.row?.name||null,score:rank.best?.score||0,runnerUp:rank.second?.row?.name||null,margin:(rank.best?.score||0)-(rank.second?.score||0),accepted:!!hit});if(hit&&!specialAbilities.includes(hit.name))specialAbilities.push(hit.name);
    }
    const saAccepted=debug.specialAbilities.filter(x=>x.accepted);const specialAbilityConfidence=saAccepted.length?saAccepted.reduce((a,b)=>a+b.score,0)/saAccepted.length:boxes.length?0:1;
    return{playstyle,specialAbilities,confidence:{playstyle:playstyle?.confidence||0,specialAbilities:clamp01(specialAbilityConfidence)},debug};
  }

  // Backward-compatible normaliser for deterministic tests and imported legacy results.
  function normaliseResult(raw={},usedModel=MODEL){
    const core=normaliseCoreResult(raw,usedModel);
    if(raw.playstyle){
      const psName=String(raw.playstyle?.name||'').trim(),psDef=D.playstyleDefinition(psName),levelName=String(raw.playstyle?.levelName||'').trim(),levelDef=D.PLAYSTYLE_LEVELS.find(x=>String(x.name).toLowerCase()===levelName.toLowerCase()),legacy=psName==='Holding Midfielder';
      if(levelDef&&LEVELS.includes(levelDef.name)&&((psDef&&psDef.id!==1)||legacy))core.playstyle={name:psDef?.name||psName,type:psDef?.type||psName,level:levelDef.id,levelName:levelDef.name,confidence:clamp01(raw.playstyle?.confidence)};
    }
    if(Array.isArray(raw.specialAbilities))core.specialAbilities=raw.specialAbilities.map(String).map(x=>x.trim()).filter(x=>ABILITIES.includes(x)).filter((x,i,a)=>a.indexOf(x)===i);
    return core;
  }

  async function scan(dataUrl,onProgress=()=>{},options={}){
    const externalSignal=options?.signal||null,screenshot=dataUrlPart(dataUrl),model=MODEL,label=modelLabel(model);
    const parts=[{text:buildPrompt()},screenshot];
    const payload={contents:[{role:'user',parts}],generationConfig:{responseMimeType:'application/json',maxOutputTokens:5000,thinkingConfig:{thinkingLevel:'low'}}};
    let body=null,lastErr=null;
    for(let attempt=1;attempt<=REQUEST_RETRY_DELAYS_MS.length;attempt++){
      if(externalSignal?.aborted)throw scannerError('SCAN_CANCELLED','Scan cancelled.',{kind:'cancelled'});
      const wait=REQUEST_RETRY_DELAYS_MS[attempt-1];if(wait){onProgress({progress:.08,label:`${label} busy · retry ${attempt}/3 in ${Math.round(wait/1000)}s`,event:'retry-wait',model,attempt,totalModels:1});await sleep(wait,externalSignal);}
      onProgress({progress:.10,label:`Reading screenshot with ${label} · attempt ${attempt}/3`,event:'model-start',model,attempt,totalModels:1});
      try{
        body=await apiFetchWithTimeout(`/models/${model}:generateContent`,{method:'POST',body:JSON.stringify(payload)},model,REQUEST_TIMEOUT_MS,externalSignal);noteModelResult(model,{success:true});lastErr=null;break;
      }catch(err){
        if(err?.code==='SCAN_CANCELLED')throw err;noteModelResult(model,{error:err});lastErr=err;
        const retryable=err?.retryable||['temporary','rate_limit','network','timeout'].includes(err?.kind);
        if(err?.kind==='quota_daily')throw scannerError('SCANNER_QUOTA','Gemini 3.8 Flash free-tier daily quota is exhausted. Try again after the free quota resets.',{kind:'quota_daily',retryable:false,model});
        if(!retryable||attempt===REQUEST_RETRY_DELAYS_MS.length)break;
      }
    }
    if(!body){const detail=lastErr?.message||`${label} did not complete the scan.`;throw scannerError('SCANNER_RETRY_EXHAUSTED',`${detail} Three attempts were made. Tap Retry Scan when you want to try again.`,{kind:lastErr?.kind||'temporary',retryable:false,model,status:lastErr?.status||0,detail:lastErr?.detail||''});}

    onProgress({progress:.76,label:'Validating Gemini player data',event:'validating',model});
    const parsed=parseJson(extractText(body)),result=normaliseCoreResult(parsed,model);result.raw.modelAttempts=REQUEST_RETRY_DELAYS_MS.length;
    if(!result.name&&!result.roles.length&&!Object.keys(result.skills).length)throw scannerError('NOT_TOP_ELEVEN','Gemini could not read this as a Top Eleven player screenshot.',{scanFailure:true,kind:'scan'});
    const required=result.layout==='gk'?[...D.GK_SKILLS,...D.GK_PHYSICAL]:[...D.OUTFIELD_SKILLS],missing=required.filter(s=>!Number.isFinite(Number(result.skills[s])));
    if(missing.length)result.repairNotes.push(`Needs review: Gemini could not confidently read ${missing.join(', ')}`);

    onProgress({progress:.84,label:'Matching visible icons locally',event:'local-match-start'});
    try{
      const refs=await references();const visual=await localVisualMatch(dataUrl,result.raw.visualRegions,refs,onProgress);result.playstyle=visual.playstyle;result.specialAbilities=visual.specialAbilities;result.confidence.playstyle=visual.confidence.playstyle;result.confidence.specialAbilities=visual.confidence.specialAbilities;result.raw.visualMatch=visual.debug;
      if(result.raw.visualRegions.playstyleBadge&&!result.playstyle)result.repairNotes.push('Playstyle badge was visible but local asset matching was not confident enough. Review manually.');
      if(result.raw.visualRegions.specialAbilityIcons.length!==result.specialAbilities.length)result.repairNotes.push(`Gemini located ${result.raw.visualRegions.specialAbilityIcons.length} special-ability icon(s); local matching confidently identified ${result.specialAbilities.length}. Review manually.`);
    }catch(err){result.repairNotes.push(`Local visual matching unavailable: ${err?.message||err}`);result.raw.visualMatch={error:String(err?.message||err)};}
    onProgress({progress:1,label:`Scan complete · ${label}`,event:'complete',model});return result;
  }

  async function health(){
    const available=await discoverModels(true),order=await modelOrder();if(!available.length)throw new Error('No compatible stable Gemini Flash scanner models were returned for this API key.');
    return{ok:true,provider:'Gemini Developer API',model:order.ready[0]||available[0],models:available,orderedModels:order.all,freeTierOnly:true,requestTimeoutMs:REQUEST_TIMEOUT_MS,maxAttempts:REQUEST_RETRY_DELAYS_MS.length};
  }

  function checkAggregate(values,total){
    const nums=(values||[]).map(Number).filter(Number.isFinite),t=Number(total);if(!nums.length||!Number.isFinite(t))return{average:null,error:null,ok:false};
    const average=nums.reduce((a,b)=>a+b,0)/nums.length,error=Math.abs(average-t);return{average,error,ok:error<=1.5};
  }

  TE.Scanner={VERSION,MODEL,MODELS,DOCUMENTED_MODELS,REQUEST_TIMEOUT_MS,REQUEST_RETRY_DELAYS_MS,scan,health,discoverModels,modelOrder,getApiKey,setApiKey,clearApiKey,checkAggregate,_normaliseResult:normaliseResult,_normaliseCoreResult:normaliseCoreResult,_buildPrompt:buildPrompt,_classifyApiError:classifyApiError,_parseDurationMs:parseDurationMs,_diceShift:diceShift,_acceptMatch:acceptMatch};
})();
