(() => {
  const TE=window.TE5=window.TE5||{};const D=TE.Data;
  if(!D)throw new Error('data.js must load before training-engine.js');
  const MODEL_VERSION='build_30527-white-coverage-v2';

  function rolesFor(player,roles,position){
    const raw=Array.isArray(roles)?roles:(Array.isArray(player?.roles)?player.roles:[position||player?.position]);const out=[];
    for(const r of raw){const n=D.normaliseRole(r);if(n&&!out.includes(n))out.push(n);}const p=D.normaliseRole(position||player?.position);if(p&&!out.includes(p))out.unshift(p);return out.slice(0,3);
  }
  function whiteSkillsFor(player,roles,position){return D.whiteSkillsForRoles(rolesFor(player,roles,position));}
  function applicableSkillsFor(player,roles,position){return D.applicableSkillsForRoles(rolesFor(player,roles,position));}
  function buildNeeds(white,skills){
    const missing=white.filter(a=>skills?.[a]===undefined||skills?.[a]===null||skills?.[a]==='');
    const values=Object.fromEntries(white.map(a=>[a,Number(skills?.[a]??0)]));
    const target=white.length?Math.max(...white.map(a=>values[a])):0;const need={};
    for(const a of white)need[a]=Math.max(1,target-values[a]+1);
    return {missing,values,target,need};
  }
  function normalLevelSetting(profile,drill){const row=profile?.drills?.[drill.drillId];return row||{unlocked:!!drill.capturedUnlocked,level:Number(drill.capturedLevelId||0)};}
  function levelEffectPct(level){const row=(D.DRILL_LEVELS.levels||[]).find(x=>Number(x.level_id)===Number(level));return row?Number(row.training_effect_percent):0;}
  function levelName(level){return (D.DRILL_LEVELS.levels||[]).find(x=>Number(x.level_id)===Number(level))?.name||'Locked';}
  function candidateFromNormal(drill,normalProfile,whiteSet,applicableSet){
    const setting=normalLevelSetting(normalProfile,drill);if(!setting.unlocked)return null;const level=Math.trunc(Number(setting.level)||0);if(level<1||level>3)return null;
    const effectPct=levelEffectPct(level);const strength=Number(drill.xpPerPlayer)*(1+effectPct/100);
    return makeCandidate({...drill,isMaster:false,level,effectPct,levelName:levelName(level),strength,catalogueOrder:drill.index},whiteSet,applicableSet);
  }
  function candidateFromMaster(drill,stock,whiteSet,applicableSet){
    const quantity=Math.max(0,Math.trunc(Number(stock?.stock?.[drill.drillId]??stock?.[drill.drillId]??0)));if(quantity<=0)return null;
    const effectPct=Number(drill.additionalTrainingEffectPercent);const strength=Number(drill.xpPerPlayer)*(1+effectPct/100);
    return makeCandidate({...drill,isMaster:true,quantity,level:null,effectPct,levelName:'Master',strength,catalogueOrder:D.NORMAL_DRILLS.length+drill.index},whiteSet,applicableSet);
  }
  function makeCandidate(base,whiteSet,applicableSet){
    const applicableAttributes=base.skills.filter(a=>applicableSet.has(a));if(!applicableAttributes.length)return null;
    const whiteAttributes=applicableAttributes.filter(a=>whiteSet.has(a));const greyAttributes=applicableAttributes.filter(a=>!whiteSet.has(a));
    return {...base,applicableAttributes,whiteAttributes,greyAttributes,denominator:applicableAttributes.length};
  }
  function scoreCandidate(candidate,need,sessionCredit,covered){
    // v5.2.4 companion ranking revision:
    // grey attributes do not contribute to, dilute or penalise individual-player training value.
    // A drill earns value from EVERY white/key attribute it can hit, so strong multi-white drills
    // are favoured when those white attributes are currently weak.
    const adjustedNeed={};let usefulNeed=0;
    for(const a of candidate.whiteAttributes){
      const n=Math.max(1,Number(need[a]||1)-Number(sessionCredit[a]||0));
      adjustedNeed[a]=n;usefulNeed+=n;
    }
    const whiteCoverageCount=candidate.whiteAttributes.length;
    const score=whiteCoverageCount?candidate.strength*usefulNeed:0;
    const newWhiteCount=candidate.whiteAttributes.filter(a=>!covered.has(a)).length;
    return {score,usefulNeed,adjustedNeed,newWhiteCount,whiteCoverageCount};
  }
  function compareScored(a,b){
    const eps=1e-9;if(Math.abs(a.metric.score-b.metric.score)>eps)return b.metric.score-a.metric.score;
    if(a.metric.whiteCoverageCount!==b.metric.whiteCoverageCount)return b.metric.whiteCoverageCount-a.metric.whiteCoverageCount;
    if(a.metric.newWhiteCount!==b.metric.newWhiteCount)return b.metric.newWhiteCount-a.metric.newWhiteCount;
    if(Number(a.candidate.conditionDrop)!==Number(b.candidate.conditionDrop))return Number(a.candidate.conditionDrop)-Number(b.candidate.conditionDrop);
    return a.candidate.catalogueOrder-b.candidate.catalogueOrder;
  }
  function buildIndividualSession({player,roles,position,skills,normalProfile,masterStock,slots=6}={}){
    const resolvedRoles=rolesFor(player,roles,position);if(!resolvedRoles.length)return {drills:[],error:'invalid-position'};
    const actualSkills=skills||player?.skills||{};const white=whiteSkillsFor(player,resolvedRoles);const applicable=applicableSkillsFor(player,resolvedRoles);
    const needs=buildNeeds(white,actualSkills);if(needs.missing.length)return {drills:[],error:'missing-white-attributes',missingAttributes:needs.missing,meta:{model:MODEL_VERSION,roles:resolvedRoles,whiteAttributes:white}};
    const whiteSet=new Set(white),applicableSet=new Set(applicable);
    const normalCandidates=D.NORMAL_DRILLS.map(d=>candidateFromNormal(d,normalProfile,whiteSet,applicableSet)).filter(Boolean);
    const masterCandidates=D.MASTER_CAMPUS_DRILLS.map(d=>candidateFromMaster(d,masterStock,whiteSet,applicableSet)).filter(Boolean);
    const candidates=[...normalCandidates,...masterCandidates];if(!candidates.length)return {drills:[],error:'no-available-drills',meta:{model:MODEL_VERSION,roles:resolvedRoles,whiteAttributes:white}};

    const selected=[],sessionCredit={},covered=new Set(),masterUsage={};let totalUsefulScore=0,totalCondition=0,totalXp=0;
    for(let slot=0;slot<slots;slot++){
      const legal=candidates.filter(c=>!c.isMaster||(masterUsage[c.drillId]||0)<c.quantity);if(!legal.length)break;
      const scored=legal.map(candidate=>({candidate,metric:scoreCandidate(candidate,needs.need,sessionCredit,covered)})).filter(x=>x.metric.usefulNeed>0).sort(compareScored);
      if(!scored.length)break;const best=scored[0],c=best.candidate,m=best.metric;
      // Balancing credit is applied to each white attribute actually hit. It is not a predicted gain;
      // it simply prevents the next slot from ignoring other weak white skills after a strong hit.
      const creditPerHit=c.strength;
      const slotResult={...c,slot:slot+1,usefulTrainingScore:m.score,usefulNeed:m.usefulNeed,adjustedNeed:m.adjustedNeed,creditPerHit,whiteCoverageCount:m.whiteCoverageCount,targetedWhiteAttributes:[...c.whiteAttributes],greyApplicableAttributes:[...c.greyAttributes],inapplicableAttributes:c.skills.filter(a=>!applicableSet.has(a))};
      selected.push(slotResult);totalUsefulScore+=m.score;totalCondition+=Number(c.conditionDrop)||0;totalXp+=Number(c.xpPerPlayer)||0;
      for(const a of c.whiteAttributes){sessionCredit[a]=Number(sessionCredit[a]||0)+creditPerHit;covered.add(a);}if(c.isMaster)masterUsage[c.drillId]=(masterUsage[c.drillId]||0)+1;
    }
    const priorityAttributes=white.map(a=>({attribute:a,value:needs.values[a],need:needs.need[a],credit:Number(sessionCredit[a]||0)})).sort((a,b)=>b.need-a.need||a.value-b.value||a.attribute.localeCompare(b.attribute));
    const remainingMasterStock={};for(const d of D.MASTER_CAMPUS_DRILLS){const owned=Math.max(0,Math.trunc(Number(masterStock?.stock?.[d.drillId]??masterStock?.[d.drillId]??0)));remainingMasterStock[d.drillId]=Math.max(0,owned-(masterUsage[d.drillId]||0));}
    return {drills:selected,error:selected.length===slots?null:'insufficient-legal-drills',meta:{model:MODEL_VERSION,gameDataVersion:D.GAME_DATA_VERSION,roles:resolvedRoles,whiteAttributes:white,applicableAttributes:applicable,target:needs.target,baseNeed:needs.need,sessionCredit,priorityAttributes,coveredWhiteAttributes:[...covered],totalUsefulScore,totalCondition,totalXp,masterUsage,remainingMasterStock,normalCandidateCount:normalCandidates.length,masterCandidateCount:masterCandidates.length,exactGainPrediction:false,greyAttributesAffectScore:false,rankingMode:'weak-white-coverage'}};
  }
  function evaluateCatalogue({player,roles,position,skills,normalProfile,masterStock}={}){
    const resolvedRoles=rolesFor(player,roles,position);const white=whiteSkillsFor(player,resolvedRoles),applicable=applicableSkillsFor(player,resolvedRoles),needs=buildNeeds(white,skills||player?.skills||{});const whiteSet=new Set(white),applicableSet=new Set(applicable),credit={},covered=new Set();
    const rows=[...D.NORMAL_DRILLS.map(d=>candidateFromNormal(d,normalProfile,whiteSet,applicableSet)),...D.MASTER_CAMPUS_DRILLS.map(d=>candidateFromMaster(d,masterStock,whiteSet,applicableSet))].filter(Boolean).map(candidate=>({candidate,metric:scoreCandidate(candidate,needs.need,credit,covered)})).sort(compareScored);return {roles:resolvedRoles,white,applicable,needs,rows};
  }
  TE.Training={MODEL_VERSION,rolesFor,whiteSkillsFor,applicableSkillsFor,buildNeeds,levelEffectPct,levelName,buildIndividualSession,evaluateCatalogue,scoreCandidate};
})();
