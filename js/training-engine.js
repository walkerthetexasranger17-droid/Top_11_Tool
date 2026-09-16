(() => {
  const TE=window.TE5=window.TE5||{};const D=TE.Data,STRAT=TE.Strategy;
  if(!D||!STRAT)throw new Error('data.js and strategy-logic.js must load before training-engine.js');
  const MODEL_VERSION='30527-white-beam-v6-balanced-development',BEAM_WIDTH=250,CONDITION_BEAM_WIDTH=1000,BALANCED_BEAM_WIDTH=1000;

  function rolesFor(player,roles,position){
    const raw=Array.isArray(roles)?roles:(Array.isArray(player?.roles)?player.roles:[position||player?.position]);
    const out=[];for(const r of raw){const n=D.normaliseRole(r);if(n&&!out.includes(n))out.push(n);}
    const p=D.normaliseRole(position||player?.position);if(p&&!out.includes(p))out.unshift(p);return out;
  }
  function whiteSkillsFor(player,roles,position){return D.whiteSkillsForRoles(rolesFor(player,roles,position));}
  function applicableSkillsFor(player,roles,position){return D.applicableSkillsForRoles(rolesFor(player,roles,position));}
  function buildNeeds(white,skills,priorityProfile={},developmentWhite=null){
    const missing=white.filter(a=>D.skillValue(skills,a)===null);
    const values=Object.fromEntries(white.map(a=>[a,D.skillValue(skills,a)??0]));
    const rows=Array.isArray(priorityProfile)?priorityProfile:[],rowMap=Object.fromEntries(rows.map(r=>[r.attribute,r]));
    const legacyWeights=!rows.length&&priorityProfile&&typeof priorityProfile==='object'?priorityProfile:{};
    const primary=(Array.isArray(developmentWhite)&&developmentWhite.length?developmentWhite:white).filter(a=>white.includes(a));
    const ratios={},normalisedLevels={};
    for(const a of white){const row=rowMap[a],ratio=Math.max(.01,Number(row?.targetRatio??1));ratios[a]=ratio;normalisedLevels[a]=values[a]/ratio;}
    // Anchor the target shape to the median normalized non-signature (non-S) development skill.
    // Median anchoring keeps the player's underlying development level stable while resisting a single
    // freakishly high lower-tier white. Excluding S prevents a newly developed signature skill from
    // moving its own goalpost upward. If a profile has only S skills, fall back to all development whites.
    const primaryRows=primary.map(a=>({attribute:a,row:rowMap[a],level:normalisedLevels[a]})).filter(x=>Number.isFinite(x.level));
    const anchorRows=primaryRows.filter(x=>(x.row?.tier||'C')!=='S'),refRows=anchorRows.length?anchorRows:primaryRows;
    const sortedReferenceLevels=refRows.map(x=>x.level).sort((a,b)=>a-b);
    const mid=Math.floor(sortedReferenceLevels.length/2),normalizedReference=sortedReferenceLevels.length?(sortedReferenceLevels.length%2?sortedReferenceLevels[mid]:(sortedReferenceLevels[mid-1]+sortedReferenceLevels[mid])/2):0,targets={},gaps={},need={};
    const maintenanceFloor=Math.max(.01,Number(STRAT.TARGET_SHAPE?.maintenance_floor??.25));
    for(const a of white){
      const row=rowMap[a],ratio=ratios[a],target=normalizedReference*ratio,gap=Math.max(0,target-values[a]);
      const weight=Math.max(.01,Number(row?.weight??legacyWeights[a]??1));
      targets[a]=target;gaps[a]=gap;need[a]=(gap>1e-9?gap+1:maintenanceFloor)*weight;
    }
    return{missing,values,target:normalizedReference,normalizedReference,targets,gaps,ratios,normalisedLevels,need,maintenanceFloor,weakAttributes:white.filter(a=>gaps[a]>0)};
  }
  function normalLevelSetting(profile,drill){return profile?.drills?.[drill.drillId]||{unlocked:!!drill.capturedUnlocked,level:Number(drill.capturedLevelId||0)};}
  function levelEffectPct(level){const row=(D.DRILL_LEVELS.levels||[]).find(x=>Number(x.level_id)===Number(level));return row?Number(row.training_effect_percent):0;}
  function levelName(level){return (D.DRILL_LEVELS.levels||[]).find(x=>Number(x.level_id)===Number(level))?.name||'Locked';}
  function trainingStrength(xpPerPlayer,effectPct=0){return Number(xpPerPlayer)*(1+Number(effectPct||0)/100);}
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
    const effectPct=levelEffectPct(level),strength=trainingStrength(drill.xpPerPlayer,effectPct);
    return makeCandidate({...drill,isMaster:false,level,effectPct,levelName:levelName(level),strength,catalogueOrder:drill.index},whiteSet,applicableSet);
  }
  function candidateFromMaster(drill,stock,whiteSet,applicableSet){
    const quantity=Math.max(0,Math.trunc(Number(stock?.stock?.[drill.drillId]??stock?.[drill.drillId]??0)));if(quantity<=0)return null;
    const effectPct=Number(drill.additionalTrainingEffectPercent),strength=trainingStrength(drill.xpPerPlayer,effectPct);
    return makeCandidate({...drill,isMaster:true,quantity,level:null,effectPct,levelName:'Master',strength,catalogueOrder:D.NORMAL_DRILLS.length+drill.index},whiteSet,applicableSet);
  }
  function scoreCandidate(candidate,need,credit={}){
    const effectiveNeed={};let sum=0;
    for(const a of candidate.whiteAttributes){const n=Math.max(.05,Number(need[a]||0)-Number(credit[a]||0));effectiveNeed[a]=n;sum+=n;}
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
    if(mode==='balancedDevelopment'){
      if(a.weakCovered.size!==b.weakCovered.size)return b.weakCovered.size-a.weakCovered.size;
      if(a.covered.size!==b.covered.size)return b.covered.size-a.covered.size;
      if(a.uniqueDrills.size!==b.uniqueDrills.size)return b.uniqueDrills.size-a.uniqueDrills.size;
      if(Math.abs(a.utility-b.utility)>eps)return b.utility-a.utility;
      if(Math.abs(a.totalCondition-b.totalCondition)>eps)return a.totalCondition-b.totalCondition;
      return stableOrderCompare(a,b);
    }
    if(Math.abs(a.utility-b.utility)>eps)return b.utility-a.utility;
    if(a.weakCovered.size!==b.weakCovered.size)return b.weakCovered.size-a.weakCovered.size;
    if(Math.abs(a.totalCondition-b.totalCondition)>eps)return a.totalCondition-b.totalCondition;
    return stableOrderCompare(a,b);
  }
  function initialMasterRemaining(candidates){const out={};for(const c of candidates)if(c.isMaster)out[c.drillId]=Math.max(0,Math.trunc(Number(c.quantity)||0));return out;}
  function beamSearch(candidates,need,masterStock,slots=6,mode='maxGrowth'){
    const beamWidth=mode==='conditionEfficient'?CONDITION_BEAM_WIDTH:mode==='balancedDevelopment'?BALANCED_BEAM_WIDTH:BEAM_WIDTH;
    const weakSet=new Set(Object.keys(need||{}).filter(a=>Number(need[a])>1));
    let beam=[{selected:[],credit:{},masterUsage:{},remainingMasterStock:initialMasterRemaining(candidates),utility:0,covered:new Set(),weakCovered:new Set(),uniqueDrills:new Set(),totalCondition:0,totalXp:0}];
    for(let slot=0;slot<slots;slot++){
      const next=[];
      for(const state of beam){for(const c of candidates){
        if(c.isMaster&&Number(state.remainingMasterStock[c.drillId]||0)<=0)continue;
        const metric=scoreCandidate(c,need,state.credit),credit={...state.credit},covered=new Set(state.covered),weakCovered=new Set(state.weakCovered),uniqueDrills=new Set(state.uniqueDrills);
        for(const a of c.whiteAttributes){credit[a]=Number(credit[a]||0)+c.strength;covered.add(a);if(weakSet.has(a))weakCovered.add(a);}uniqueDrills.add(c.drillId);
        const masterUsage={...state.masterUsage},remainingMasterStock={...state.remainingMasterStock};
        if(c.isMaster){masterUsage[c.drillId]=(masterUsage[c.drillId]||0)+1;remainingMasterStock[c.drillId]=Math.max(0,Number(remainingMasterStock[c.drillId]||0)-1);}
        next.push({
          selected:[...state.selected,{...c,slot:slot+1,usefulTrainingScore:metric.score,usefulNeed:metric.usefulNeed,adjustedNeed:metric.effectiveNeed,creditPerHit:c.strength,whiteCoverageCount:c.whiteAttributes.length,targetedWhiteAttributes:[...c.whiteAttributes],greyApplicableAttributes:[...c.greyAttributes]}],
          credit,masterUsage,remainingMasterStock,utility:state.utility+metric.score,covered,weakCovered,uniqueDrills,
          totalCondition:state.totalCondition+(Number(c.conditionDrop)||0),totalXp:state.totalXp+(Number(c.xpPerPlayer)||0)
        });
      }}
      if(!next.length)break;next.sort((a,b)=>compareStates(a,b,mode));beam=next.slice(0,beamWidth);
    }
    return beam.sort((a,b)=>compareStates(a,b,mode))[0]||null;
  }
  function buildIndividualSession({player,roles,position,skills,normalProfile,masterStock,slots=6,mode='maxGrowth',tactics=null,developmentRole=null}={}){
    const resolvedRoles=rolesFor(player,roles,position);if(!resolvedRoles.length)return{drills:[],error:'invalid-position'};
    const actualSkills=skills||player?.skills||{},white=whiteSkillsFor(player,resolvedRoles),applicable=applicableSkillsFor(player,resolvedRoles),hierarchy=STRAT.trainingPriorityProfile(player,{roles:resolvedRoles,tactics,developmentRole}),developmentWhite=D.POSITION_WHITE[hierarchy.developmentRole]||white,needs=buildNeeds(white,actualSkills,hierarchy.priorities,developmentWhite);
    if(needs.missing.length)return{drills:[],error:'missing-white-attributes',missingAttributes:needs.missing,meta:{model:MODEL_VERSION,roles:resolvedRoles,whiteAttributes:white}};
    const whiteSet=new Set(white),applicableSet=new Set(applicable);
    const normalCandidates=D.NORMAL_DRILLS.map(d=>candidateFromNormal(d,normalProfile,whiteSet,applicableSet)).filter(Boolean);
    const masterCandidates=D.MASTER_CAMPUS_DRILLS.map(d=>candidateFromMaster(d,masterStock,whiteSet,applicableSet)).filter(Boolean);
    const candidates=[...normalCandidates,...masterCandidates];if(!candidates.length)return{drills:[],error:'no-available-drills',meta:{model:MODEL_VERSION,roles:resolvedRoles,whiteAttributes:white}};
    const best=beamSearch(candidates,needs.need,masterStock,slots,mode);if(!best)return{drills:[],error:'no-available-drills'};
    const hRows=Object.fromEntries(hierarchy.priorities.map(x=>[x.attribute,x]));const priorityAttributes=white.map(a=>({attribute:a,value:needs.values[a],tier:hRows[a]?.tier||'C',targetRatio:needs.ratios[a],target:needs.targets[a],gap:needs.gaps[a],need:needs.need[a],contextMultiplier:hRows[a]?.contextMultiplier||1,credit:Number(best.credit[a]||0)})).sort((a,b)=>b.need-a.need||b.gap-a.gap||a.value-b.value||a.attribute.localeCompare(b.attribute));
    const remainingMasterStock={};for(const d of D.MASTER_CAMPUS_DRILLS){const owned=Math.max(0,Math.trunc(Number(masterStock?.stock?.[d.drillId]??masterStock?.[d.drillId]??0)));remainingMasterStock[d.drillId]=Math.max(0,owned-(best.masterUsage[d.drillId]||0));}
    return{
      drills:best.selected,error:best.selected.length===slots?null:'insufficient-legal-drills',
      meta:{
        model:MODEL_VERSION,gameDataVersion:D.GAME_DATA_VERSION,beamWidth:mode==='conditionEfficient'?CONDITION_BEAM_WIDTH:mode==='balancedDevelopment'?BALANCED_BEAM_WIDTH:BEAM_WIDTH,mode,roles:resolvedRoles,whiteAttributes:white,applicableAttributes:applicable,
        target:needs.target,normalizedReference:needs.normalizedReference,targetByAttribute:needs.targets,targetGapByAttribute:needs.gaps,targetRatioByAttribute:needs.ratios,baseNeed:needs.need,sessionCredit:best.credit,priorityAttributes,weakWhiteAttributes:[...needs.weakAttributes],
        coveredWhiteAttributes:[...best.covered],coveredWeakWhiteAttributes:[...best.weakCovered],uniqueDrillCount:best.uniqueDrills.size,totalUsefulScore:best.utility,totalCondition:best.totalCondition,totalXp:best.totalXp,
        masterUsage:best.masterUsage,remainingMasterStock,normalCandidateCount:normalCandidates.length,masterCandidateCount:masterCandidates.length,
        exactGainPrediction:false,greyAttributesAffectScore:false,gainPolicy:{verifiedIntensityXp:{'Very Easy':1,'Easy':2,'Medium':3,'Hard':4,'Very Hard':5},strengthFormula:'xp_per_player * (1 + training_effect_percent/100)',exactFinalAttributeGainPredicted:false},rankingMode:mode==='balancedDevelopment'?'balanced-weak-coverage-then-variety-then-utility':mode==='conditionEfficient'?'condition-efficient-utility-per-condition':'role-playstyle-target-shape-tactic-gap-beam',hierarchy
      }
    };
  }
  function evaluateCatalogue({player,roles,position,skills,normalProfile,masterStock,tactics=null,developmentRole=null}={}){
    const resolvedRoles=rolesFor(player,roles,position),white=whiteSkillsFor(player,resolvedRoles),applicable=applicableSkillsFor(player,resolvedRoles),hierarchy=STRAT.trainingPriorityProfile(player,{roles:resolvedRoles,tactics,developmentRole}),developmentWhite=D.POSITION_WHITE[hierarchy.developmentRole]||white,needs=buildNeeds(white,skills||player?.skills||{},hierarchy.priorities,developmentWhite);
    if(needs.missing.length)return{roles:resolvedRoles,white,applicable,needs,hierarchy,rows:[],error:'missing-white-attributes',missingAttributes:needs.missing};
    const whiteSet=new Set(white),applicableSet=new Set(applicable),rows=[...D.NORMAL_DRILLS.map(d=>candidateFromNormal(d,normalProfile,whiteSet,applicableSet)),...D.MASTER_CAMPUS_DRILLS.map(d=>candidateFromMaster(d,masterStock,whiteSet,applicableSet))]
      .filter(Boolean).map(candidate=>({candidate,metric:scoreCandidate(candidate,needs.need,{})}))
      .sort((a,b)=>b.metric.score-a.metric.score||b.metric.whiteCoverageCount-a.metric.whiteCoverageCount||a.candidate.catalogueOrder-b.candidate.catalogueOrder);
    return{roles:resolvedRoles,white,applicable,needs,hierarchy,rows,error:null};
  }
  TE.Training={MODEL_VERSION,BEAM_WIDTH,CONDITION_BEAM_WIDTH,BALANCED_BEAM_WIDTH,rolesFor,whiteSkillsFor,applicableSkillsFor,buildNeeds,levelEffectPct,levelName,trainingStrength,buildIndividualSession,evaluateCatalogue,scoreCandidate,beamSearch,compareStates};
})();
