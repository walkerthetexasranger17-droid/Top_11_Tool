(() => {
  const TE=window.TE5=window.TE5||{};
  const D=TE.Data,B=TE.BibleData;
  if(!D||!B) throw new Error('data.js and bible-data.js must load before scanner-engine.js');

  const VERSION=3;
  const DOCUMENTED_MODELS=['gemini-3.6-flash'];
  const MODEL='gemini-3.6-flash';
  const MODELS=[MODEL];
  const API_KEY_STORAGE='te:scanner:geminiApiKey';
  const API_BASE='https://generativelanguage.googleapis.com/v1beta';
  const DISCOVERY_TTL_MS=15*60*1000;
  const REQUEST_TIMEOUT_MS=20000;
  // Fixed short retry delay: server-busy/transient failures do not get progressively slower.
  const RETRY_DELAY_MS=2000;
  let discoveryCache=null;

  function cleanKey(value){return String(value||'').trim();}
  async function getApiKey(){return cleanKey(localStorage.getItem(API_KEY_STORAGE));}
  async function setApiKey(value){const key=cleanKey(value);if(key)localStorage.setItem(API_KEY_STORAGE,key);else localStorage.removeItem(API_KEY_STORAGE);discoveryCache=null;return key;}
  async function clearApiKey(){localStorage.removeItem(API_KEY_STORAGE);discoveryCache=null;}
  function finiteOrNull(v){const n=Number(v);return Number.isFinite(n)?n:null;}
  function validRole(v){const r=D.normaliseRole(v);return r||null;}
  function clamp01(v){return Math.max(0,Math.min(1,Number(v)||0));}
  function scannerError(code,message,extra={}){const e=new Error(message);e.code=code;Object.assign(e,extra);return e;}
  function modelLabel(model){return String(model||'Gemini').replace(/^gemini-/,'Gemini ').replace(/-flash$/,' Flash').replace(/-/g,' ');}

  function dataUrlPart(dataUrl){
    const m=String(dataUrl||'').match(/^data:(image\/(?:png|jpe?g|webp));base64,([A-Za-z0-9+/=\r\n]+)$/i);
    if(!m)throw scannerError('INVALID_IMAGE','Choose a valid PNG, JPEG or WebP screenshot.',{scanFailure:true});
    return {inline_data:{mime_type:m[1].toLowerCase().replace('jpg','jpeg'),data:m[2].replace(/\s+/g,'')}};
  }

  // core player data only: playstyle and special abilities are manual review fields.
  function buildPrompt(){
    const outfield=[...D.OUTFIELD_SKILLS],gk=[...D.GK_SKILLS,...D.GK_PHYSICAL];
    return `You are the player-data scanner for a private Top Eleven companion app. Analyse ONLY the supplied current Top Eleven player screenshot.

Your ONLY job is to transcribe the player's visible core data accurately:
- player name
- age
- overall rating (OVR)
- every visible natural position/role
- the large group totals
- every one of the 15 visible skill values

DO NOT analyse, identify, locate or return playstyles.
DO NOT analyse, identify, locate or return special abilities.
The user enters playstyles and special abilities manually after the scan.

HARD RULES
1. Read the screenshot directly. Do not infer a value from OVR, averages, colours, position, or another field.
2. Never alter a number to make totals or OVR agree. Return exactly what is visibly printed.
3. All 15 skill values are required for a successful scan. Look carefully at every row before answering.
4. If a digit is genuinely unreadable, omit that skill and explain it in warnings. The app will automatically retry instead of saving an incomplete scan.
5. Return every visible natural role, in display order. Do not invent related roles.
6. Return JSON only. No markdown and no commentary outside the JSON.

Allowed roles: ${D.ALL_POSITIONS.join(', ')}.
Outfield skills (exact names): ${outfield.join(', ')}.
Goalkeeper skills (exact names): ${gk.join(', ')}.

For an outfield player, totals.def/att/phys are the large DEFENCE/ATTACK/PHYSICAL numbers above the columns.
For a goalkeeper, put the GOALKEEPING total in totals.att, PHYSICAL in totals.phys, and totals.def may be null.

Return exactly this shape:
{
  "name": string|null,
  "age": number|null,
  "ovr": number|null,
  "roles": string[],
  "layout": "outfield"|"gk",
  "totals": {"def": number|null, "att": number|null, "phys": number|null},
  "skills": {"Skill Name": number},
  "confidence": {"overall":number,"text":number,"numbers":number,"roles":number},
  "warnings": string[]
}`;
  }

  function extractText(body){const parts=body?.candidates?.[0]?.content?.parts||[];const text=parts.map(p=>p?.text||'').join('').trim();if(!text)throw scannerError('EMPTY_RESPONSE','Gemini returned no scanner result.',{scanFailure:true,retryable:true,kind:'invalid_result'});return text;}
  function parseJson(text){const s=String(text||'').trim();try{return JSON.parse(s);}catch(_){const a=s.indexOf('{'),b=s.lastIndexOf('}');if(a>=0&&b>a){try{return JSON.parse(s.slice(a,b+1));}catch(__){}}throw scannerError('INVALID_RESPONSE','Gemini returned an unreadable scanner result.',{scanFailure:true,retryable:true,kind:'invalid_result'});}}
  function parseDurationMs(value){if(value==null)return 0;const s=String(value).trim();let m=s.match(/^([0-9]+(?:\.[0-9]+)?)s$/i);if(m)return Math.ceil(Number(m[1])*1000);m=s.match(/^([0-9]+(?:\.[0-9]+)?)ms$/i);return m?Math.ceil(Number(m[1])):0;}
  function retryAfterFrom(response,body,detail=''){let ms=0;const header=response?.headers?.get?.('Retry-After');if(header){const n=Number(header);if(Number.isFinite(n))ms=Math.max(ms,n*1000);else{const t=Date.parse(header);if(Number.isFinite(t))ms=Math.max(ms,t-Date.now());}}for(const d of body?.error?.details||[])if(String(d?.['@type']||'').includes('RetryInfo'))ms=Math.max(ms,parseDurationMs(d.retryDelay));const m=String(detail).match(/retry in\s+([0-9]+(?:\.[0-9]+)?)s/i);if(m)ms=Math.max(ms,Math.ceil(Number(m[1])*1000));return Math.max(0,ms);}
  function quotaInfo(body,detail=''){const violations=[];for(const d of body?.error?.details||[])if(String(d?.['@type']||'').includes('QuotaFailure'))for(const v of d.violations||[])violations.push(v);const ids=violations.map(v=>String(v.quotaId||''));return{violations,daily:ids.some(x=>/PerDay/i.test(x))||/per day|daily quota|day-free/i.test(detail),perMinute:ids.some(x=>/PerMinute/i.test(x))||/per minute|rate limit/i.test(detail)};}
  function classifyApiError(response,body,model){
    const status=Number(response?.status)||0,detail=body?.error?.message||body?.message||`HTTP ${status}`,retryAfterMs=retryAfterFrom(response,body,detail),quota=quotaInfo(body,detail),demand=/high demand|overload|overloaded|temporar|capacity|unavailable|service unavailable|try again/i.test(detail);
    let kind='request',retryable=false,scanFailure=false;
    if(status===408||[500,502,503,504].includes(status)){kind='temporary';retryable=true;}
    else if(status===429){kind=quota.daily?'quota_daily':'rate_limit';retryable=!quota.daily;}
    else if(status===404&&/model|not found|not supported|unavailable/i.test(detail)){kind='model_unavailable';}
    else if(status===401||status===403||(status===400&&/API key|key not valid|invalid api key/i.test(detail))){kind='auth';}
    else if(status>=400&&status<500){kind='request';scanFailure=true;}
    if(demand&&status===429&&!quota.daily){kind='temporary';retryable=true;}
    let message=`Gemini scanner error: ${detail}`;
    if(kind==='auth')message=`Gemini API key was rejected. ${detail}`;
    else if(kind==='quota_daily')message=`${modelLabel(model)} free-tier daily quota is exhausted. Try again after Google resets the free quota.`;
    else if(kind==='rate_limit')message=`${modelLabel(model)} is rate limited right now.`;
    else if(kind==='temporary')message=`${modelLabel(model)} is temporarily busy or unavailable.`;
    else if(kind==='model_unavailable')message=`${modelLabel(model)} is not available to this API key.`;
    return scannerError('GEMINI_API_ERROR',message,{status,detail,kind,retryable,scanFailure,retryAfterMs,model,quota});
  }

  async function apiFetch(path,options={},model=''){
    const key=await getApiKey();if(!key)throw scannerError('NOT_CONFIGURED','Gemini Scanner is not configured. Open Settings and paste your free Gemini API key.');
    let response;try{response=await fetch(`${API_BASE}${path}`,{...options,headers:{'Content-Type':'application/json','x-goog-api-key':key,...(options.headers||{})}});}catch(err){if(options.signal?.aborted)throw err;throw scannerError('NETWORK','Could not reach the Gemini API. Check your internet connection.',{retryable:true,kind:'network'});}
    let body=null;try{body=await response.json();}catch(_){}
    if(!response.ok)throw classifyApiError(response,body,model);return body;
  }
  async function discoverModels(force=false){const now=Date.now();if(!force&&discoveryCache&&now-discoveryCache.at<DISCOVERY_TTL_MS)return discoveryCache.models;let body;try{body=await apiFetch('/models?pageSize=1000',{method:'GET',headers:{Accept:'application/json'}});}catch(err){if(discoveryCache)return discoveryCache.models;return [...DOCUMENTED_MODELS];}const listed=(body?.models||[]).filter(m=>(m.supportedGenerationMethods||m.supportedActions||[]).some(x=>String(x).toLowerCase()==='generatecontent')).map(m=>String(m.name||'').replace(/^models\//,''));const supported=DOCUMENTED_MODELS.filter(id=>listed.includes(id));discoveryCache={at:now,models:supported.length?supported:[...DOCUMENTED_MODELS],listed};return discoveryCache.models;}
  async function modelOrder(){const available=await discoverModels();const ready=available.includes(MODEL)?[MODEL]:[];return{ready,cooling:[],all:ready.length?ready:[MODEL]};}

  function sleep(ms,signal){return new Promise((resolve,reject)=>{if(signal?.aborted)return reject(scannerError('SCAN_CANCELLED','Scan cancelled.',{kind:'cancelled'}));const t=setTimeout(done,ms);function done(){cleanup();resolve();}function abort(){clearTimeout(t);cleanup();reject(scannerError('SCAN_CANCELLED','Scan cancelled.',{kind:'cancelled'}));}function cleanup(){signal?.removeEventListener?.('abort',abort);}signal?.addEventListener?.('abort',abort,{once:true});});}
  async function apiFetchWithTimeout(path,options={},model='',timeoutMs=REQUEST_TIMEOUT_MS,externalSignal=null){const controller=new AbortController();let timedOut=false;const timer=setTimeout(()=>{timedOut=true;controller.abort();},timeoutMs),abortExternal=()=>controller.abort();if(externalSignal?.aborted)controller.abort();else externalSignal?.addEventListener?.('abort',abortExternal,{once:true});try{return await apiFetch(path,{...options,signal:controller.signal},model);}catch(err){if(controller.signal.aborted){if(externalSignal?.aborted)throw scannerError('SCAN_CANCELLED','Scan cancelled.',{kind:'cancelled'});if(timedOut)throw scannerError('SCAN_TIMEOUT',`${modelLabel(model)} did not answer within ${Math.round(timeoutMs/1000)} seconds.`,{retryable:true,kind:'timeout',model});}throw err;}finally{clearTimeout(timer);externalSignal?.removeEventListener?.('abort',abortExternal);}}

  function normaliseCoreResult(raw={},usedModel=MODEL){
    const roles=[...(Array.isArray(raw.roles)?raw.roles:[])].map(validRole).filter(Boolean).filter((x,i,a)=>a.indexOf(x)===i).slice(0,3);
    const layout=(raw.layout==='gk'||roles.includes('GK'))?'gk':'outfield';
    const allowedSkills=layout==='gk'?[...D.GK_SKILLS,...D.GK_PHYSICAL]:[...D.OUTFIELD_SKILLS];
    const skills={};for(const name of allowedSkills){const n=finiteOrNull(raw.skills?.[name]);if(n!=null&&n>=0&&n<=520)skills[name]=n;}
    const c=raw.confidence||{},warnings=[...(Array.isArray(raw.warnings)?raw.warnings:[])].map(String).slice(0,30);
    return{version:VERSION,provider:'google-gemini-developer-api-free',model:usedModel,name:String(raw.name||'').trim(),age:finiteOrNull(raw.age),ovr:finiteOrNull(raw.ovr),roles,position:roles[0]||null,layout,skills,playstyle:null,specialAbilities:[],confidence:{overall:clamp01(c.overall),text:clamp01(c.text),numbers:clamp01(c.numbers),roles:clamp01(c.roles),playstyle:0,specialAbilities:0},raw:{totals:{def:finiteOrNull(raw.totals?.def),att:finiteOrNull(raw.totals?.att),phys:finiteOrNull(raw.totals?.phys)},model:usedModel,warnings,providerResponseVersion:5,scannerScope:'core-player-data-only'},repairNotes:warnings,validation:{resolved:false,unresolvedChecks:[]}};
  }
  function normaliseResult(raw={},usedModel=MODEL){return normaliseCoreResult(raw,usedModel);}
  function checkAggregate(values,total){const nums=(values||[]).map(Number).filter(Number.isFinite),t=Number(total);if(!nums.length||!Number.isFinite(t))return{average:null,error:null,ok:false};const average=nums.reduce((a,b)=>a+b,0)/nums.length,error=Math.abs(average-t);return{average,error,ok:error<=1.5};}

  function validateResult(result){
    const problems=[];
    if(!result.name)problems.push('name missing');
    if(!Number.isFinite(result.age)||result.age<15||result.age>60)problems.push('age missing/invalid');
    if(!Number.isFinite(result.ovr)||result.ovr<1||result.ovr>520)problems.push('OVR missing/invalid');
    if(!result.roles.length)problems.push('role missing');
    const required=result.layout==='gk'?[...D.GK_SKILLS,...D.GK_PHYSICAL]:[...D.OUTFIELD_SKILLS];
    const missing=required.filter(s=>!Number.isFinite(Number(result.skills?.[s])));if(missing.length)problems.push(`${missing.length} skill value${missing.length===1?'':'s'} missing`);
    const totals=result.raw?.totals||{},checks={};
    if(!missing.length){
      if(result.layout==='gk'){
        checks.goalkeeping=checkAggregate(D.GK_SKILLS.map(s=>result.skills[s]),totals.att);checks.physical=checkAggregate(D.GK_PHYSICAL.map(s=>result.skills[s]),totals.phys);
      }else{
        checks.defence=checkAggregate(D.GROUPS_OUTFIELD.Defence.map(s=>result.skills[s]),totals.def);checks.attack=checkAggregate(D.GROUPS_OUTFIELD.Attack.map(s=>result.skills[s]),totals.att);checks.physical=checkAggregate(D.GROUPS_OUTFIELD.Physical.map(s=>result.skills[s]),totals.phys);
      }
      const vals=required.map(s=>Number(result.skills[s]));checks.ovr=checkAggregate(vals,result.ovr);
      for(const [name,c] of Object.entries(checks))if(!c.ok)problems.push(`${name} arithmetic mismatch`);
    }
    result.checks=checks;result.validation={resolved:problems.length===0,unresolvedChecks:problems.map(name=>({name}))};
    return{ok:problems.length===0,problems,checks};
  }

  function retryDelay(){return RETRY_DELAY_MS;}

  async function scan(dataUrl,onProgress=()=>{},options={}){
    const externalSignal=options?.signal||null,screenshot=dataUrlPart(dataUrl),model=MODEL,label=modelLabel(model);
    const payload={contents:[{role:'user',parts:[{text:buildPrompt()},screenshot]}],generationConfig:{responseMimeType:'application/json',temperature:0,maxOutputTokens:3500}};
    let attempt=0;
    while(true){
      attempt++;
      if(externalSignal?.aborted)throw scannerError('SCAN_CANCELLED','Scan cancelled.',{kind:'cancelled'});
      onProgress({progress:.12,label:`Reading player data with ${label} · attempt ${attempt}`,event:'model-start',model,attempt});
      try{
        const body=await apiFetchWithTimeout(`/models/${model}:generateContent`,{method:'POST',body:JSON.stringify(payload)},model,REQUEST_TIMEOUT_MS,externalSignal);
        onProgress({progress:.76,label:`Checking returned player data · attempt ${attempt}`,event:'validating',model,attempt});
        const result=normaliseCoreResult(parseJson(extractText(body)),model),validation=validateResult(result);
        result.raw.modelAttempts=attempt;
        if(!validation.ok){
          const err=scannerError('INCOMPLETE_SCAN',`Gemini result rejected: ${validation.problems.join(', ')}`,{retryable:true,kind:'invalid_result',model});
          const delay=retryDelay(attempt+1,err);onProgress({progress:.82,label:`Result incomplete/inconsistent · automatic retry in ${Math.round(delay/1000)}s`,event:'result-rejected',model,attempt,problems:validation.problems});
          await sleep(delay,externalSignal);continue;
        }
        onProgress({progress:1,label:`Player data ready · ${label} · ${attempt} attempt${attempt===1?'':'s'}`,event:'complete',model,attempt});return result;
      }catch(err){
        if(err?.code==='SCAN_CANCELLED')throw err;
        if(['NOT_CONFIGURED','INVALID_IMAGE'].includes(err?.code)||['auth','quota_daily','model_unavailable','request'].includes(err?.kind))throw err;
        const retryable=err?.retryable||['temporary','rate_limit','network','timeout','invalid_result'].includes(err?.kind);
        if(!retryable)throw err;
        const delay=retryDelay(attempt+1,err);onProgress({progress:.08,label:`${err?.kind==='rate_limit'?'Gemini rate limited':'Scan did not complete'} · retrying automatically in ${Math.round(delay/1000)}s · attempt ${attempt+1}`,event:'retry-wait',model,attempt:attempt+1});
        await sleep(delay,externalSignal);
      }
    }
  }

  async function health(){const available=await discoverModels(true);if(!available.includes(MODEL))throw new Error(`${modelLabel(MODEL)} was not returned for this API key.`);return{ok:true,provider:'Gemini Developer API',model:MODEL,models:available,orderedModels:[MODEL],freeTierOnly:true,requestTimeoutMs:REQUEST_TIMEOUT_MS,automaticRetry:true,retryDelayMs:RETRY_DELAY_MS};}

  TE.Scanner={VERSION,MODEL,MODELS,DOCUMENTED_MODELS,REQUEST_TIMEOUT_MS,RETRY_DELAY_MS,scan,health,discoverModels,modelOrder,getApiKey,setApiKey,clearApiKey,checkAggregate,_normaliseResult:normaliseResult,_normaliseCoreResult:normaliseCoreResult,_buildPrompt:buildPrompt,_classifyApiError:classifyApiError,_parseDurationMs:parseDurationMs,_validateResult:validateResult};
})();
