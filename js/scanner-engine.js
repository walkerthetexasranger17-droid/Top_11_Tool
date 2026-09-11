(() => {
  const TE=window.TE5=window.TE5||{};
  const D=TE.Data,B=TE.BibleData;
  if(!D||!B) throw new Error('data.js and bible-data.js must load before scanner-engine.js');

  const VERSION=3;
  // Confirmed stable full Flash models in the Gemini Developer API as of 2026-09.
  // The suggested 3.4 generation is intentionally absent: Google does not expose it as a supported Flash model.
  const DOCUMENTED_MODELS=['gemini-3.8-flash'];
  const MODEL='gemini-3.8-flash';
  const MODELS=[MODEL];
  const API_KEY_STORAGE='te:scanner:geminiApiKey';
  const MODEL_HEALTH_STORAGE='te:scanner:modelHealth:v1';
  const API_BASE='https://generativelanguage.googleapis.com/v1beta';
  const PLAYSTYLE_REF='./assets/scanner/playstyles-reference.png';
  const ABILITY_REF='./assets/scanner/special-abilities-reference.jpg';
  const PLAYSTYLES=B.PLAYSTYLES.filter(x=>x.id!==1).map(x=>x.name);
  const LEVELS=B.PLAYSTYLE_LEVELS.filter(x=>x.id>=1).map(x=>x.name);
  const ABILITIES=[...D.SPECIAL_ABILITIES];
  const DISCOVERY_TTL_MS=15*60*1000;
  const DEFAULT_BUSY_MS=15000;
  let referencePromise=null,discoveryCache=null;

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
  async function fileToInline(url,mime){
    const r=await fetch(url,{cache:'force-cache'});if(!r.ok)throw new Error(`Scanner reference asset is missing: ${url}`);
    const blob=await r.blob();
    const data=await new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>res(String(fr.result||'').split(',')[1]||'');fr.onerror=rej;fr.readAsDataURL(blob);});
    return {inline_data:{mime_type:mime,data}};
  }
  async function references(){
    if(!referencePromise)referencePromise=Promise.all([fileToInline(PLAYSTYLE_REF,'image/png'),fileToInline(ABILITY_REF,'image/jpeg')]);
    return referencePromise;
  }

  function buildPrompt(){
    const outfield=[...D.OUTFIELD_SKILLS],gk=[...D.GK_SKILLS,...D.GK_PHYSICAL];
    return `You are Scanner v3 for a private Top Eleven companion app. Read the supplied CURRENT Top Eleven player Skills screenshot with extreme care. The next two images are authoritative visual reference sheets for playstyles/levels and special abilities.\n\nHARD RULES\n1. Read values from the screenshot itself. Never invent, infer, average, reconcile, or change a number merely to make OVR or column totals agree. If you cannot read a value, omit it from skills and add a warning.\n2. Read player name, age, OVR, every visible natural role, the three group totals, and every one of the 15 displayed skill values.\n3. PLAYSTYLE: match the small playstyle badge beside the player's name against REFERENCE IMAGE 1. Identify BOTH playstyle name and its visual state. Allowed states are Locked, Standard, Intermediate, Advanced, or Master. A visible PADLOCK overlay means Locked/Potential and MUST NEVER be returned as Standard. For an unlocked badge: Standard has no progression bars, Intermediate has 1 bar, Advanced has 2 bars, and Master has 3 bars plus the Master-style outer badge. Judge the OUTER FRAME/BARS/LOCK separately from the inner playstyle symbol. Do not infer the playstyle from the player's role. Role is only a sanity check. If the badge or its state is too unclear, return playstyle=null rather than guessing.\n4. SPECIAL ABILITIES: inspect the ENTIRE row after the words "Special ability:". A player may have ZERO, ONE, TWO, THREE OR MORE abilities. Segment every visible icon and match each independently against REFERENCE IMAGE 2. Return ALL visible abilities in left-to-right order. NEVER stop after the first icon.\n5. The screenshot may recolour or scale an icon. Match the symbol/shape, not just colour.\n6. Do not report an ability or playstyle merely because it would suit the player's position. Only report what is visibly present.\n7. Return JSON only. Confidence fields are numbers from 0 to 1.\n\nREFERENCE IMAGE 1 also contains two labelled real screenshot examples added for regression: Ariel Bravo = Winger + Locked, and François Roelandt = False Nine + Intermediate. Use those examples to distinguish the lock overlay and the 1-bar Intermediate frame.

Allowed roles: ${D.ALL_POSITIONS.join(', ')}.\nAllowed playstyles: ${PLAYSTYLES.join(', ')}.\nAllowed playstyle levels: ${LEVELS.join(', ')}.\nAllowed special abilities: ${ABILITIES.join(', ')}.\nOutfield skills (exact names): ${outfield.join(', ')}.\nGoalkeeper skills (exact names): ${gk.join(', ')}.\n\nFor an outfield player, totals.def/att/phys are the large DEFENCE/ATTACK/PHYSICAL numbers above the columns. For a goalkeeper put the GOALKEEPING total in totals.att for app compatibility, totals.phys is PHYSICAL, and totals.def may be null.\n\nReturn exactly this object shape:\n{\n  "name": string|null,\n  "age": number|null,\n  "ovr": number|null,\n  "roles": string[],\n  "layout": "outfield"|"gk",\n  "totals": {"def": number|null, "att": number|null, "phys": number|null},\n  "skills": {"Skill Name": number},\n  "playstyle": {"name": string, "levelName": string, "confidence": number}|null,\n  "specialAbilities": string[],\n  "confidence": {"overall":number,"text":number,"numbers":number,"roles":number,"playstyle":number,"specialAbilities":number},\n  "warnings": string[]\n}`;
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
    else if(status===429){kind=quota.daily?'quota_daily':'rate_limit';retryable=true;failover=true;}
    else if(status===404&&/model|not found|not supported|unavailable/i.test(detail)){kind='model_unavailable';failover=true;}
    else if(status===401||status===403){kind='auth';}
    else if(status===400&&/API key|key not valid|invalid api key/i.test(detail)){kind='auth';}
    else if(status>=400&&status<500){kind='request';scanFailure=true;}
    if(demand&&status===429){kind='temporary';retryable=true;failover=true;}
    let message=`Gemini scanner error: ${detail}`;
    if(kind==='auth')message=`Gemini API key was rejected. ${detail}`;
    else if(kind==='quota_daily')message=`${modelLabel(model)} free-tier daily quota is currently exhausted. It will retry later; No paid fallback was used.`;
    else if(kind==='rate_limit')message=`${modelLabel(model)} is rate limited right now.`;
    else if(kind==='temporary')message=`${modelLabel(model)} is temporarily busy or unavailable.`;
    else if(kind==='model_unavailable')message=`${modelLabel(model)} is not available to this API key.`;
    return scannerError('GEMINI_API_ERROR',message,{status,detail,kind,retryable,failover,scanFailure,retryAfterMs,model,quota});
  }
  async function apiFetch(path,options={},model=''){
    const key=await getApiKey();
    if(!key)throw scannerError('NOT_CONFIGURED','Gemini Scanner is not configured. Open Settings and paste your free Gemini API key.');
    let response;
    try{response=await fetch(`${API_BASE}${path}`,{...options,headers:{'Content-Type':'application/json','x-goog-api-key':key,...(options.headers||{})}});}catch(_){throw scannerError('NETWORK','Could not reach the Gemini API. Check your internet connection.',{retryable:true,kind:'network'});}
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
    else if(error){h.lastErrorKind=error.kind||error.code||'error';h.lastErrorAt=Date.now();if(error.retryable||error.kind==='temporary'||error.kind==='rate_limit'){h.consecutiveTransient=(h.consecutiveTransient||0)+1;const fallback=Math.min(120000,DEFAULT_BUSY_MS*Math.max(1,h.consecutiveTransient));h.cooldownUntil=Date.now()+Math.max(error.retryAfterMs||0,fallback);}else if(error.kind==='quota_daily'){h.cooldownUntil=Date.now()+Math.max(error.retryAfterMs||0,60*60*1000);}else if(error.kind==='model_unavailable'){h.cooldownUntil=Date.now()+60*60*1000;}}
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
    const available=await discoverModels();
    const ready=available.includes(MODEL)?[MODEL]:[];
    return{ready,cooling:[],all:ready.length?ready:[MODEL]};
  }

  function normaliseResult(raw={},usedModel=MODEL){
    const roles=[...(Array.isArray(raw.roles)?raw.roles:[])].map(validRole).filter(Boolean).filter((x,i,a)=>a.indexOf(x)===i).slice(0,3);
    const layout=(raw.layout==='gk'||roles.includes('GK'))?'gk':'outfield';
    const allowedSkills=layout==='gk'?[...D.GK_SKILLS,...D.GK_PHYSICAL]:[...D.OUTFIELD_SKILLS];
    const skills={};
    for(const name of allowedSkills){const n=finiteOrNull(raw.skills?.[name]);if(n!=null&&n>=0&&n<=520)skills[name]=n;}
    const psName=String(raw.playstyle?.name||'').trim(),psDef=D.playstyleDefinition(psName),levelName=String(raw.playstyle?.levelName||'').trim();
    const level=D.PLAYSTYLE_LEVELS.find(x=>String(x.name).toLowerCase()===levelName.toLowerCase())?.id||0;
    const playstyle=psDef&&psDef.id!==1&&level>=1?{name:psDef.name,type:psDef.type,level,levelName:D.PLAYSTYLE_LEVELS.find(x=>x.id===level)?.name||levelName,confidence:clamp01(raw.playstyle?.confidence)}:null;
    const specialAbilities=[...(Array.isArray(raw.specialAbilities)?raw.specialAbilities:[])].map(String).map(x=>x.trim()).filter(x=>ABILITIES.includes(x)).filter((x,i,a)=>a.indexOf(x)===i);
    const c=raw.confidence||{},warnings=[...(Array.isArray(raw.warnings)?raw.warnings:[])].map(String).slice(0,30);
    return{version:VERSION,provider:'google-gemini-developer-api-free',model:usedModel,name:String(raw.name||'').trim(),age:finiteOrNull(raw.age),ovr:finiteOrNull(raw.ovr),roles,position:roles[0]||null,layout,skills,playstyle,specialAbilities,confidence:{overall:clamp01(c.overall),text:clamp01(c.text),numbers:clamp01(c.numbers),roles:clamp01(c.roles),playstyle:clamp01(c.playstyle),specialAbilities:clamp01(c.specialAbilities)},raw:{totals:{def:finiteOrNull(raw.totals?.def),att:finiteOrNull(raw.totals?.att),phys:finiteOrNull(raw.totals?.phys)},model:usedModel,warnings,providerResponseVersion:3},repairNotes:warnings,validation:{resolved:true,unresolvedChecks:[]}};
  }

  async function scan(dataUrl,onProgress=()=>{}){
    const screenshot=dataUrlPart(dataUrl);
    onProgress({progress:.04,label:'Loading official icon references',event:'prepare'});
    const [playstyleRef,abilityRef]=await references();
    const payload={contents:[{role:'user',parts:[{text:buildPrompt()},{text:'PLAYER SKILLS SCREENSHOT — this is the image to scan:'},screenshot,{text:'REFERENCE IMAGE 1 — all playstyle names, unlocked levels, and real Locked/Intermediate examples:'},playstyleRef,{text:'REFERENCE IMAGE 2 — all current special ability names and icons:'},abilityRef]}],generationConfig:{responseMimeType:'application/json',maxOutputTokens:7000,thinkingConfig:{thinkingLevel:'low'}}};
    const model=MODEL,label=modelLabel(model);
    onProgress({progress:.12,label:`Scanning with ${label}`,event:'model-start',model,attempt:1,totalModels:1});
    let body;
    try{
      body=await apiFetch(`/models/${model}:generateContent`,{method:'POST',body:JSON.stringify(payload)},model);
      noteModelResult(model,{success:true});
    }catch(err){
      noteModelResult(model,{error:err});
      const delay=Math.max(DEFAULT_BUSY_MS,Number(err?.retryAfterMs||0));
      if(err?.kind==='quota_daily')throw scannerError('SCANNER_POOL_QUOTA','Gemini 3.8 Flash free-tier daily quota is currently exhausted. The queue will keep it and retry later; No paid fallback was used.',{kind:'quota_daily',retryable:true,retryAfterMs:delay,model});
      if(err?.retryable||['temporary','rate_limit','network','model_unavailable'].includes(err?.kind))throw scannerError('SCANNER_POOL_TEMPORARY',err?.message||'Gemini 3.8 Flash is temporarily unavailable.',{kind:err?.kind||'temporary',retryable:true,retryAfterMs:delay,model,status:err?.status||0,detail:err?.detail||''});
      throw err;
    }
    onProgress({progress:.90,label:`Validating ${label} result`,event:'validating',model});
    const result=normaliseResult(parseJson(extractText(body)),model);
    result.raw.modelAttempts=[];
    if(!result.name&&!result.roles.length&&!Object.keys(result.skills).length)throw scannerError('NOT_TOP_ELEVEN','Gemini could not read this as a Top Eleven Skills screenshot.',{scanFailure:true,kind:'scan'});
    const required=result.layout==='gk'?[...D.GK_SKILLS,...D.GK_PHYSICAL]:[...D.OUTFIELD_SKILLS],missing=required.filter(s=>!Number.isFinite(Number(result.skills[s])));
    if(missing.length)result.repairNotes.push(`Needs review: Gemini could not confidently read ${missing.join(', ')}`);
    onProgress({progress:1,label:`Scan complete · ${label}`,event:'complete',model});
    return result;
  }

  async function health(){
    const available=await discoverModels(true),order=await modelOrder();
    if(!available.length)throw new Error('No compatible stable Gemini Flash scanner models were returned for this API key.');
    return{ok:true,provider:'Gemini Developer API',model:order.ready[0]||available[0],models:available,orderedModels:order.all,freeTierOnly:true};
  }

  function checkAggregate(values,total){
    const nums=(values||[]).map(Number).filter(Number.isFinite),t=Number(total);
    if(!nums.length||!Number.isFinite(t))return{average:null,error:null,ok:false};
    const average=nums.reduce((a,b)=>a+b,0)/nums.length,error=Math.abs(average-t);
    return{average,error,ok:error<=1.5};
  }

  TE.Scanner={VERSION,MODEL,MODELS,DOCUMENTED_MODELS,scan,health,discoverModels,modelOrder,getApiKey,setApiKey,clearApiKey,checkAggregate,_normaliseResult:normaliseResult,_buildPrompt:buildPrompt,_classifyApiError:classifyApiError,_parseDurationMs:parseDurationMs};
})();
