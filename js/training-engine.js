(() => {
  const TE=window.TE5=window.TE5||{};const D=TE.Data;
  if(!D)throw new Error('data.js must load before training-engine.js');
  const MODEL_VERSION='30527-white-beam-v1',BEAM_WIDTH=250;

  function rolesFor(player,roles,position){
    const raw=Array.isArray(roles)?roles:(Array.isArray(player?.roles)?player.roles:[position||player?.position]);
    const out=[];for(const r of raw){const n=D.normaliseRole(r);if(n&&!out.includes(n))out.push(n);}
    const p=D.normaliseRole(position||player?.position);if(p&&!out.includes(p))out.unshift(p);return out;
  }
  function whiteSkillsFor(player,roles,position){return D.whiteSkillsForRoles(rolesFor(player,roles,position));}
  function applicableSkillsFor(player,roles,position){return D.applicableSkillsForRoles(rolesFor(player,roles,position));}
  function buildNeeds(white,skills){
    const missing=white.filter(a=>skills?.[a]===undefined||skills?.[a]===null||skills?.[a]==='');
    const values=Object.fromEntries(white.map(a=>[a,Number(skills?.[a]??0)]));
    const sorted=white.map(a=>values[a]).filter(Number.isFinite).sort((a,b)=>b-a),top=sorted.slice(0,Math.min(3,sorted.length));
    const target=top.length?top.reduce((a,b)=>a+b,0)/top.length:0,need={};
    for(const a of white)need[a]=Math.max(1,target-values[a]+1);
    return{missing,values,target,need,weakAttributes:white.filter(a=>need[a]>1)};
  }
  function normalLevelSetting(profile,drill){return profile?.drills?.[drill.drillId]||{unlocked:!!drill.capturedUnlocked,level:Number(drill.capturedLevelId||0)};}
  function levelEffectPct(level){const row=(D.DRILL_LEVELS.levels||[]).find(x=>Number(x.level_id)===Number(level));return row?Number(row.training_effect_percent):0;}
  function levelName(level){return (D.DRILL_LEVELS.levels||[]).find(x=>Number(x.level_id)===Number(level))?.name||'Locked';}
  function makeCandidate(base,whiteSet,applicableSet){
    const applicableAttributes=base.skills.filter(a=>applicableSet.has(a));
    const whiteAttributes=base.skills.filter(a=>whiteSet.has(a));
    const greyAttributes=applicableAttributes.filter(a=>!whiteSet.has(a));
    if(!whiteAttributes.length)return null;
    return{...base,applicableAttributes,whiteAttributes,greyAttributes};
  }
  function candidateFromNormal(drill,profile,whiteSet,applicableSet){
    const setting=normalLevelSetting(profile,drill);if(!setting.unlocked)return null;
    const level=Math.trunc(Number(setting.level)||0);if(level<1||level>3)return null;
    const effectPct=levelEffectPct(level),strength=Number(drill.xpPerPlayer)*(1+effectPct/100);
    return makeCandidate({...drill,isMaster:false,level,effectPct,levelName:levelName(level),strength,catalogueOrder:drill.index},whiteSet,applicableSet);
  }
  function candidateFromMaster(drill,stock,whiteSet,applicableSet){
    const quantity=Math.max(0,Math.trunc(Number(stock?.stock?.[drill.drillId]??stock?.[drill.drillId]??0)));if(quantity<=0)return null;
    const effectPct=Number(drill.additionalTrainingEffectPercent),strength=Number(drill.xpPerPlayer)*(1+effectPct/100);
    return makeCandidate({...drill,isMaster:true,quantity,level:null,effectPct,levelName:'Master',strength,catalogueOrder:D.NORMAL_DRILLS.length+drill.index},whiteSet,applicableSet);
  }
  function scoreCandidate(candidate,need,credit={}){
    const effectiveNeed={};let sum=0;
    for(const a of candidate.whiteAttributes){const n=Math.max(1,Number(need[a]||1)-Number(credit[a]||0));effectiveNeed[a]=n;sum+=n;}
    return{score:candidate.strength*sum,usefulNeed:sum,effectiveNeed,whiteCoverageCount:candidate.whiteAttributes.length};
  }
  function stableOrderCompare(a,b){
    const aa=a.selected.map(x=>Number(x.catalogueOrder)),bb=b.selected.map(x=>Number(x.catalogueOrder));
    const n=Math.max(aa.length,bb.length);for(let i=0;i<n;i++){const av=aa[i]??-1,bv=bb[i]??-1;if(av!==bv)return av-bv;}return 0;
  }
  function compareStates(a,b,mode='maxGrowth'){
    const eps=1e-9;
    if(mode==='conditionEfficient'){
      const ar=a.utility/Math.max(a.totalCondition,eps),br=b.utility/Math.max(b.totalCondition,eps);
      if(Math.abs(ar-br)>eps)return br-ar;
      if(Math.abs(a.utility-b.utility)>eps)return b.utility-a.utility;
      if(a.covered.size!==b.covered.size)return b.covered.size-a.covered.size;
      return stableOrderCompare(a,b);
    }
    if(Math.abs(a.utility-b.utility)>eps)return b.utility-a.utility;
    if(a.weakCovered.size!==b.weakCovered.size)return b.weakCovered.size-a.weakCovered.size;
    if(Math.abs(a.totalCondition-b.totalCondition)>eps)return a.totalCondition-b.totalCondition;
    return stableOrderCompare(a,b);
  }
  function initialMasterRemaining(candidates){const out={};for(const c of candidates)if(c.isMaster)out[c.drillId]=Math.max(0,Math.trunc(Number(c.quantity)||0));return out;}
  function beamSearch(candidates,need,masterStock,slots=6,mode='maxGrowth'){
    const weakSet=new Set(Object.keys(need||{}).filter(a=>Number(need[a])>1));
    let beam=[{selected:[],credit:{},masterUsage:{},remainingMasterStock:initialMasterRemaining(candidates),utility:0,covered:new Set(),weakCovered:new Set(),totalCondition:0,totalXp:0}];
    for(let slot=0;slot<slots;slot++){
      const next=[];
      for(const state of beam){for(const c of candidates){
        if(c.isMaster&&Number(state.remainingMasterStock[c.drillId]||0)<=0)continue;
        const metric=scoreCandidate(c,need,state.credit),credit={...state.credit},covered=new Set(state.covered),weakCovered=new Set(state.weakCovered);
        for(const a of c.whiteAttributes){credit[a]=Number(credit[a]||0)+c.strength;covered.add(a);if(weakSet.has(a))weakCovered.add(a);}
        const masterUsage={...state.masterUsage},remainingMasterStock={...state.remainingMasterStock};
        if(c.isMaster){masterUsage[c.drillId]=(masterUsage[c.drillId]||0)+1;remainingMasterStock[c.drillId]=Math.max(0,Number(remainingMasterStock[c.drillId]||0)-1);}
        next.push({
          selected:[...state.selected,{...c,slot:slot+1,usefulTrainingScore:metric.score,usefulNeed:metric.usefulNeed,adjustedNeed:metric.effectiveNeed,creditPerHit:c.strength,whiteCoverageCount:c.whiteAttributes.length,targetedWhiteAttributes:[...c.whiteAttributes],greyApplicableAttributes:[...c.greyAttributes]}],
          credit,masterUsage,remainingMasterStock,utility:state.utility+metric.score,covered,weakCovered,
          totalCondition:state.totalCondition+(Number(c.conditionDrop)||0),totalXp:state.totalXp+(Number(c.xpPerPlayer)||0)
        });
      }}
      if(!next.length)break;next.sort((a,b)=>compareStates(a,b,mode));beam=next.slice(0,BEAM_WIDTH);
    }
    return beam.sort((a,b)=>compareStates(a,b,mode))[0]||null;
  }
  function buildIndividualSession({player,roles,position,skills,normalProfile,masterStock,slots=6,mode='maxGrowth'}={}){
    const resolvedRoles=rolesFor(player,roles,position);if(!resolvedRoles.length)return{drills:[],error:'invalid-position'};
    const actualSkills=skills||player?.skills||{},white=whiteSkillsFor(player,resolvedRoles),applicable=applicableSkillsFor(player,resolvedRoles),needs=buildNeeds(white,actualSkills);
    if(needs.missing.length)return{drills:[],error:'missing-white-attributes',missingAttributes:needs.missing,meta:{model:MODEL_VERSION,roles:resolvedRoles,whiteAttributes:white}};
    const whiteSet=new Set(white),applicableSet=new Set(applicable);
    const normalCandidates=D.NORMAL_DRILLS.map(d=>candidateFromNormal(d,normalProfile,whiteSet,applicableSet)).filter(Boolean);
    const masterCandidates=D.MASTER_CAMPUS_DRILLS.map(d=>candidateFromMaster(d,masterStock,whiteSet,applicableSet)).filter(Boolean);
    const candidates=[...normalCandidates,...masterCandidates];if(!candidates.length)return{drills:[],error:'no-available-drills',meta:{model:MODEL_VERSION,roles:resolvedRoles,whiteAttributes:white}};
    const best=beamSearch(candidates,needs.need,masterStock,slots,mode);if(!best)return{drills:[],error:'no-available-drills'};
    const priorityAttributes=white.map(a=>({attribute:a,value:needs.values[a],need:needs.need[a],credit:Number(best.credit[a]||0)})).sort((a,b)=>b.need-a.need||a.value-b.value||a.attribute.localeCompare(b.attribute));
    const remainingMasterStock={};for(const d of D.MASTER_CAMPUS_DRILLS){const owned=Math.max(0,Math.trunc(Number(masterStock?.stock?.[d.drillId]??masterStock?.[d.drillId]??0)));remainingMasterStock[d.drillId]=Math.max(0,owned-(best.masterUsage[d.drillId]||0));}
    return{
      drills:best.selected,error:best.selected.length===slots?null:'insufficient-legal-drills',
      meta:{
        model:MODEL_VERSION,gameDataVersion:D.GAME_DATA_VERSION,beamWidth:BEAM_WIDTH,mode,roles:resolvedRoles,whiteAttributes:white,applicableAttributes:applicable,
        target:needs.target,baseNeed:needs.need,sessionCredit:best.credit,priorityAttributes,weakWhiteAttributes:[...needs.weakAttributes],
        coveredWhiteAttributes:[...best.covered],coveredWeakWhiteAttributes:[...best.weakCovered],totalUsefulScore:best.utility,totalCondition:best.totalCondition,totalXp:best.totalXp,
        masterUsage:best.masterUsage,remainingMasterStock,normalCandidateCount:normalCandidates.length,masterCandidateCount:masterCandidates.length,
        exactGainPrediction:false,greyAttributesAffectScore:false,rankingMode:'top3-white-beam'
      }
    };
  }
  function evaluateCatalogue({player,roles,position,skills,normalProfile,masterStock}={}){
    const resolvedRoles=rolesFor(player,roles,position),white=whiteSkillsFor(player,resolvedRoles),applicable=applicableSkillsFor(player,resolvedRoles),needs=buildNeeds(white,skills||player?.skills||{}),whiteSet=new Set(white),applicableSet=new Set(applicable);
    const rows=[...D.NORMAL_DRILLS.map(d=>candidateFromNormal(d,normalProfile,whiteSet,applicableSet)),...D.MASTER_CAMPUS_DRILLS.map(d=>candidateFromMaster(d,masterStock,whiteSet,applicableSet))]
      .filter(Boolean).map(candidate=>({candidate,metric:scoreCandidate(candidate,needs.need,{})}))
      .sort((a,b)=>b.metric.score-a.metric.score||b.metric.whiteCoverageCount-a.metric.whiteCoverageCount||a.candidate.catalogueOrder-b.candidate.catalogueOrder);
    return{roles:resolvedRoles,white,applicable,needs,rows};
  }
  TE.Training={MODEL_VERSION,BEAM_WIDTH,rolesFor,whiteSkillsFor,applicableSkillsFor,buildNeeds,levelEffectPct,levelName,buildIndividualSession,evaluateCatalogue,scoreCandidate,beamSearch,compareStates};
})();
