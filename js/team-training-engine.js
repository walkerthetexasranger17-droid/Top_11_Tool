(() => {
  const TE=window.TE5=window.TE5||{};const D=TE.Data,T=TE.Training,STRAT=TE.Strategy;
  if(!D||!T||!STRAT)throw new Error('data.js, strategy-logic.js and training-engine.js must load before team-training-engine.js');
  const MODEL_VERSION='30527-team-white-beam-v3-target-shape',BEAM_WIDTH=250;

  function settingFor(profile,d){return profile?.drills?.[d.drillId]||{unlocked:!!d.capturedUnlocked,level:Number(d.capturedLevelId||0)};}
  function playerInGroup(p,group){return (Array.isArray(p?.roles)?p.roles:[p?.position]).some(r=>group.positions.includes(D.normaliseRole(r)));}
  function preparePlayers(players,group,{tactics=null,development=null}={}){
    const valid=[],excluded=[],devMap=new Map((Array.isArray(development)?development:[]).map(x=>[String(x?.playerKey||''),x]));
    for(const [idx,p] of (players||[]).entries()){
      if(!playerInGroup(p,group))continue;
      const roles=(p.roles||[p.position]).map(D.normaliseRole).filter(Boolean),white=D.whiteSkillsForRoles(roles),id=String(p.key||`#${idx}`),planned=devMap.get(id)||null,
        hierarchy=STRAT.trainingPriorityProfile(p,{roles,tactics,developmentRole:planned?.developmentRole||null}),developmentWhite=D.POSITION_WHITE[hierarchy.developmentRole]||white,
        needs=T.buildNeeds(white,p.skills||{},hierarchy.priorities,developmentWhite);
      if(needs.missing.length){excluded.push({player:p,missing:needs.missing});continue;}
      valid.push({id,player:p,white,whiteSet:new Set(white),weakSet:new Set(needs.weakAttributes),needs,hierarchy,plannedDevelopment:planned});
    }
    return{valid,excluded};
  }
  function candidates(profile){
    return D.NORMAL_DRILLS.map(d=>{
      const s=settingFor(profile,d),level=Number(s.level)||0;if(!s.unlocked||level<1||level>3)return null;
      const effectPct=T.levelEffectPct(level),strength=T.trainingStrength(d.xpPerPlayer,effectPct);
      return{...d,isMaster:false,level,effectPct,levelName:T.levelName(level),strength,catalogueOrder:d.index};
    }).filter(Boolean);
  }
  function stableOrderCompare(a,b){
    const aa=a.selected.map(x=>Number(x.catalogueOrder)),bb=b.selected.map(x=>Number(x.catalogueOrder));
    const n=Math.max(aa.length,bb.length);for(let i=0;i<n;i++){const av=aa[i]??-1,bv=bb[i]??-1;if(av!==bv)return av-bv;}return 0;
  }
  function compare(a,b){
    const eps=1e-9;if(Math.abs(a.utility-b.utility)>eps)return b.utility-a.utility;
    if(a.weakCovered.size!==b.weakCovered.size)return b.weakCovered.size-a.weakCovered.size;
    if(Math.abs(a.totalCondition-b.totalCondition)>eps)return a.totalCondition-b.totalCondition;
    return stableOrderCompare(a,b);
  }
  function buildTeamSession(groupKey,{normalProfile,players=[],slots=6,teamPlan=null,tactics=null,development=null}={}){
    const group=D.TEAM_GROUPS[groupKey];if(!group)return{drills:[],error:'invalid-group'};
    const tacticValues=tactics?.values||tactics||teamPlan?.tactics?.values||null,developmentRows=development||teamPlan?.development||null,prepared=preparePlayers(players,group,{tactics:tacticValues,development:developmentRows});
    if(!prepared.valid.length)return{drills:[],error:'no-complete-players',meta:{groupKey,title:group.title,excludedPlayers:prepared.excluded,model:MODEL_VERSION,apkTeamPlayModeled:false}};
    const cats=candidates(normalProfile);if(!cats.length)return{drills:[],error:'no-available-drills'};
    let beam=[{selected:[],credit:{},utility:0,covered:new Set(),weakCovered:new Set(),totalCondition:0,totalXp:0}];
    for(let slot=0;slot<slots;slot++){
      const next=[];
      for(const state of beam){for(const d of cats){
        let value=0,usefulHits=0;const credit={...state.credit},covered=new Set(state.covered),weakCovered=new Set(state.weakCovered),targets=[];
        for(const pp of prepared.valid){for(const a of d.skills){
          if(!pp.whiteSet.has(a))continue;
          const k=`${pp.id}|${a}`,eff=Math.max(.05,Number(pp.needs.need[a]||0)-Number(state.credit[k]||0));
          value+=d.strength*eff;usefulHits++;credit[k]=Number(credit[k]||0)+d.strength;covered.add(k);if(pp.weakSet.has(a))weakCovered.add(k);
          targets.push({playerKey:pp.id,playerName:pp.player.name,attribute:a});
        }}
        if(!usefulHits)continue;
        next.push({
          selected:[...state.selected,{...d,slot:slot+1,recommendationScore:value,usefulHits,targets}],credit,utility:state.utility+value,covered,weakCovered,
          totalCondition:state.totalCondition+(Number(d.conditionDrop)||0),totalXp:state.totalXp+(Number(d.xpPerPlayer)||0)
        });
      }}
      if(!next.length)break;next.sort(compare);beam=next.slice(0,BEAM_WIDTH);
    }
    const best=beam.sort(compare)[0];
    return{
      drills:best?.selected||[],error:(best?.selected.length===slots)?null:'insufficient-legal-drills',
      meta:{groupKey,title:group.title,model:MODEL_VERSION,beamWidth:BEAM_WIDTH,selectedPlayerCount:prepared.valid.length,selectedPlayerKeys:prepared.valid.map(x=>x.id),excludedPlayers:prepared.excluded,totalUsefulScore:best?.utility||0,totalCondition:best?.totalCondition||0,totalXp:best?.totalXp||0,distinctPlayerAttributeHits:best?.covered.size||0,distinctWeakPlayerAttributeHits:best?.weakCovered.size||0,greyAttributesAffectScore:false,apkTeamPlayModeled:false,targetShapeAware:true,teamPlanContextApplied:!!tacticValues,developmentContextPlayers:prepared.valid.filter(x=>!!x.plannedDevelopment).map(x=>x.id),limitations:['TeamPlayTrainingDrill is a separate protocol system and is not modelled by this optimiser.','Player-specific age/development-rate weighting is not applied because the current age-rate thresholds and normal-training gain multipliers are server/runtime data; exact per-player gains remain unresolved.']}
    };
  }
  TE.TeamTraining={MODEL_VERSION,BEAM_WIDTH,buildTeamSession,preparePlayers};
})();
