(() => {
  const TE=window.TE5=window.TE5||{};
  const D=TE.Data,B=TE.BibleData;
  if(!D||!B) throw new Error('data.js and bible-data.js must load before scanner-engine.js');

  const VERSION=3;
  const MODELS=['gemini-3.8-flash','gemini-3.7-flash'];
  const MODEL=MODELS[0];
  const API_KEY_STORAGE='te:scanner:geminiApiKey';
  const API_BASE='https://generativelanguage.googleapis.com/v1beta';
  const PLAYSTYLE_REF='./assets/scanner/playstyles-reference.png';
  const ABILITY_REF='./assets/scanner/special-abilities-reference.jpg';
  const PLAYSTYLES=B.PLAYSTYLES.filter(x=>x.id!==1).map(x=>x.name);
  const LEVELS=B.PLAYSTYLE_LEVELS.filter(x=>x.id>=2).map(x=>x.name);
  const ABILITIES=[...D.SPECIAL_ABILITIES];
  let referencePromise=null;

  function cleanKey(value){return String(value||'').trim();}
  async function getApiKey(){return cleanKey(localStorage.getItem(API_KEY_STORAGE));}
  async function setApiKey(value){
    const key=cleanKey(value);
    if(key)localStorage.setItem(API_KEY_STORAGE,key); else localStorage.removeItem(API_KEY_STORAGE);
    return key;
  }
  async function clearApiKey(){localStorage.removeItem(API_KEY_STORAGE);}

  function finiteOrNull(v){const n=Number(v);return Number.isFinite(n)?n:null;}
  function validRole(v){const r=D.normaliseRole(v);return r||null;}
  function clamp01(v){return Math.max(0,Math.min(1,Number(v)||0));}
  function dataUrlPart(dataUrl){
    const m=String(dataUrl||'').match(/^data:(image\/(?:png|jpe?g|webp));base64,([A-Za-z0-9+/=\r\n]+)$/i);
    if(!m)throw new Error('Choose a valid PNG, JPEG or WebP screenshot.');
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
    return `You are Scanner v3 for a private Top Eleven companion app. Read the supplied CURRENT Top Eleven player Skills screenshot with extreme care. The next two images are authoritative visual reference sheets for playstyles/levels and special abilities.\n\nHARD RULES\n1. Read values from the screenshot itself. Never invent, infer, average, reconcile, or change a number merely to make OVR or column totals agree. If you cannot read a value, omit it from skills and add a warning.\n2. Read player name, age, OVR, every visible natural role, the three group totals, and every one of the 15 displayed skill values.\n3. PLAYSTYLE: match the small playstyle badge beside the player's name against REFERENCE IMAGE 1. Identify BOTH playstyle name and its visual level: Standard, Intermediate, Advanced, or Master. Do not infer the playstyle from the player's role. Role is only a sanity check. If the badge is too unclear, return playstyle=null.\n4. SPECIAL ABILITIES: inspect the ENTIRE row after the words \"Special ability:\". A player may have ZERO, ONE, TWO, THREE OR MORE abilities. Segment every visible icon and match each independently against REFERENCE IMAGE 2. Return ALL visible abilities in left-to-right order. NEVER stop after the first icon.\n5. The screenshot may recolour or scale an icon. Match the symbol/shape, not just colour.\n6. Do not report an ability or playstyle merely because it would suit the player's position. Only report what is visibly present.\n7. Return JSON only. Confidence fields are numbers from 0 to 1.\n\nAllowed roles: ${D.ALL_POSITIONS.join(', ')}.\nAllowed playstyles: ${PLAYSTYLES.join(', ')}.\nAllowed playstyle levels: ${LEVELS.join(', ')}.\nAllowed special abilities: ${ABILITIES.join(', ')}.\nOutfield skills (exact names): ${outfield.join(', ')}.\nGoalkeeper skills (exact names): ${gk.join(', ')}.\n\nFor an outfield player, totals.def/att/phys are the large DEFENCE/ATTACK/PHYSICAL numbers above the columns. For a goalkeeper put the GOALKEEPING total in totals.att for app compatibility, totals.phys is PHYSICAL, and totals.def may be null.\n\nReturn exactly this object shape:\n{\n  \"name\": string|null,\n  \"age\": number|null,\n  \"ovr\": number|null,\n  \"roles\": string[],\n  \"layout\": \"outfield\"|\"gk\",\n  \"totals\": {\"def\": number|null, \"att\": number|null, \"phys\": number|null},\n  \"skills\": {\"Skill Name\": number},\n  \"playstyle\": {\"name\": string, \"levelName\": string, \"confidence\": number}|null,\n  \"specialAbilities\": string[],\n  \"confidence\": {\"overall\":number,\"text\":number,\"numbers\":number,\"roles\":number,\"playstyle\":number,\"specialAbilities\":number},\n  \"warnings\": string[]\n}`;
  }

  function extractText(body){
    const parts=body?.candidates?.[0]?.content?.parts||[];
    const text=parts.map(p=>p?.text||'').join('').trim();
    if(!text)throw new Error('Gemini returned no scanner result.');
    return text;
  }
  function parseJson(text){
    const s=String(text||'').trim();
    try{return JSON.parse(s);}catch(_){const a=s.indexOf('{'),b=s.lastIndexOf('}');if(a>=0&&b>a)return JSON.parse(s.slice(a,b+1));throw new Error('Gemini returned an unreadable scanner result.');}
  }
  async function apiFetch(path,options={}){
    const key=await getApiKey();
    if(!key)throw new Error('Gemini Scanner is not configured. Open Settings and paste your free Gemini API key.');
    let response;
    try{response=await fetch(`${API_BASE}${path}`,{...options,headers:{'Content-Type':'application/json','x-goog-api-key':key,...(options.headers||{})}});}catch(_){throw new Error('Could not reach the Gemini API. Check your internet connection.');}
    let body=null;try{body=await response.json();}catch(_){/* ignored */}
    if(!response.ok){
      const detail=body?.error?.message||body?.message||`HTTP ${response.status}`;
      const highDemand=/high demand|overload|overloaded|temporar|capacity|unavailable|try again/i.test(detail);
      const transient=[500,502,503,504].includes(response.status)||(response.status===429&&highDemand);
      const err=new Error(`Gemini scanner error: ${detail}`);
      err.status=response.status;err.detail=detail;err.transient=transient;
      if(response.status===429&&!highDemand)err.message='Gemini free-tier quota/rate limit reached. No paid fallback was used. Try again after the free quota resets.';
      if(response.status===401||response.status===403)err.message=`Gemini API key was rejected. ${detail}`;
      if(response.status===400&&/API key|key not valid|invalid/i.test(detail))err.message=`Gemini API key is invalid. ${detail}`;
      throw err;
    }
    return body;
  }

  function normaliseResult(raw={},usedModel=MODEL){
    const roles=[...(Array.isArray(raw.roles)?raw.roles:[])].map(validRole).filter(Boolean).filter((x,i,a)=>a.indexOf(x)===i).slice(0,3);
    const layout=(raw.layout==='gk'||roles.includes('GK'))?'gk':'outfield';
    const allowedSkills=layout==='gk'?[...D.GK_SKILLS,...D.GK_PHYSICAL]:[...D.OUTFIELD_SKILLS];
    const skills={};
    for(const name of allowedSkills){const n=finiteOrNull(raw.skills?.[name]);if(n!=null&&n>=0&&n<=520)skills[name]=n;}
    const psName=String(raw.playstyle?.name||'').trim();
    const psDef=D.playstyleDefinition(psName);
    const levelName=String(raw.playstyle?.levelName||'').trim();
    const level=D.PLAYSTYLE_LEVELS.find(x=>String(x.name).toLowerCase()===levelName.toLowerCase())?.id||0;
    const playstyle=psDef&&psDef.id!==1&&level>=2?{name:psDef.name,type:psDef.type,level,levelName:D.PLAYSTYLE_LEVELS.find(x=>x.id===level)?.name||levelName,confidence:clamp01(raw.playstyle?.confidence)}:null;
    const specialAbilities=[...(Array.isArray(raw.specialAbilities)?raw.specialAbilities:[])].map(String).map(x=>x.trim()).filter(x=>ABILITIES.includes(x)).filter((x,i,a)=>a.indexOf(x)===i);
    const c=raw.confidence||{},warnings=[...(Array.isArray(raw.warnings)?raw.warnings:[])].map(String).slice(0,30);
    return {
      version:VERSION,provider:'google-gemini-developer-api-free',model:usedModel,
      name:String(raw.name||'').trim(),age:finiteOrNull(raw.age),ovr:finiteOrNull(raw.ovr),roles,position:roles[0]||null,layout,skills,playstyle,specialAbilities,
      confidence:{overall:clamp01(c.overall),text:clamp01(c.text),numbers:clamp01(c.numbers),roles:clamp01(c.roles),playstyle:clamp01(c.playstyle),specialAbilities:clamp01(c.specialAbilities)},
      raw:{totals:{def:finiteOrNull(raw.totals?.def),att:finiteOrNull(raw.totals?.att),phys:finiteOrNull(raw.totals?.phys)},model:usedModel,warnings,providerResponseVersion:3},
      repairNotes:warnings,validation:{resolved:true,unresolvedChecks:[]}
    };
  }

  async function scan(dataUrl,onProgress=()=>{}){
    const screenshot=dataUrlPart(dataUrl);
    onProgress({progress:.05,label:'Loading official icon references'});
    const [playstyleRef,abilityRef]=await references();
    const payload={
      contents:[{role:'user',parts:[
        {text:buildPrompt()},
        {text:'PLAYER SKILLS SCREENSHOT — this is the image to scan:'},screenshot,
        {text:'REFERENCE IMAGE 1 — all playstyle names and visual levels:'},playstyleRef,
        {text:'REFERENCE IMAGE 2 — all current special ability names and icons:'},abilityRef
      ]}],
      generationConfig:{responseMimeType:'application/json',maxOutputTokens:7000,thinkingConfig:{thinkingLevel:'low'}}
    };
    let body=null,usedModel=null,lastError=null;
    for(let i=0;i<MODELS.length;i++){
      const model=MODELS[i];
      onProgress({progress:i===0?.12:.18,label:i===0?'Sending screenshot to Gemini 3.8 Flash':'3.8 busy — automatically trying Gemini 3.7 Flash'});
      try{
        body=await apiFetch(`/models/${model}:generateContent`,{method:'POST',body:JSON.stringify(payload)});
        usedModel=model;break;
      }catch(err){
        lastError=err;
        if(i<MODELS.length-1&&err?.transient)continue;
        if(err?.transient)throw new Error('Gemini 3.8 Flash and Gemini 3.7 Flash are both temporarily busy. No paid fallback was used. Try the scan again in a few minutes.');
        throw err;
      }
    }
    if(!body||!usedModel)throw lastError||new Error('Gemini scanner could not obtain a response.');
    onProgress({progress:.90,label:`Validating ${usedModel.replace('gemini-','Gemini ')} result`});
    const result=normaliseResult(parseJson(extractText(body)),usedModel);
    if(usedModel!==MODEL)result.repairNotes.push('Gemini 3.8 Flash was temporarily unavailable; this scan used Gemini 3.7 Flash automatically.');
    if(!result.name&&!result.roles.length&&!Object.keys(result.skills).length)throw new Error('Gemini could not read this as a Top Eleven Skills screenshot.');
    const required=result.layout==='gk'?[...D.GK_SKILLS,...D.GK_PHYSICAL]:[...D.OUTFIELD_SKILLS];
    const missing=required.filter(s=>!Number.isFinite(Number(result.skills[s])));
    if(missing.length)result.repairNotes.push(`Needs review: Gemini could not confidently read ${missing.join(', ')}`);
    onProgress({progress:1,label:'Gemini scan complete'});
    return result;
  }

  async function health(){
    const body=await apiFetch(`/models/${MODEL}`,{method:'GET',headers:{Accept:'application/json'}});
    return {ok:true,provider:'Gemini Developer API',model:body?.name?.split('/').pop()||MODEL,freeTierOnly:true};
  }

  function checkAggregate(values,total){
    const nums=(values||[]).map(Number).filter(Number.isFinite),t=Number(total);
    if(!nums.length||!Number.isFinite(t))return{average:null,error:null,ok:false};
    const average=nums.reduce((a,b)=>a+b,0)/nums.length,error=Math.abs(average-t);
    return{average,error,ok:error<=1.5};
  }

  TE.Scanner={VERSION,MODEL,MODELS,scan,health,getApiKey,setApiKey,clearApiKey,checkAggregate,_normaliseResult:normaliseResult,_buildPrompt:buildPrompt};
})();
