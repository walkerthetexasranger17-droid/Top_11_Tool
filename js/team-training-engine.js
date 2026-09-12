(() => {
  const TE=window.TE5=window.TE5||{};const D=TE.Data,T=TE.Training;
  if(!D||!T)throw new Error('data.js and training-engine.js must load before team-training-engine.js');
  const MODEL_VERSION='30527-team-white-beam-v1',BEAM_WIDTH=250;

  function settingFor(profile,d){return profile?.drills?.[d.drillId]||{unlocked:!!d.capturedUnlocked,level:Number(d.capturedLevelId||0)};}
  function playerInGroup(p,group){return (Array.isArray(p?.roles)?p.roles:[p?.position]).some(r=>group.positions.includes(D.normaliseRole(r)));}
  function preparePlayers(players,group){
    const valid=[],excluded=[];
    for(const [idx,p] of (players||[]).entries()){
      if(!playerInGroup(p,group))continue;
      const roles=(p.roles||[p.position]).map(D.normaliseRole).filter(Boolean),white=D.whiteSkillsForRoles(roles),needs=T.buildNeeds(white,p.skills||{});
      if(needs.missing.length){excluded.push({player:p,missing:needs.missing});continue;}
      valid.push({id:p.key||`#${idx}`,player:p,white,whiteSet:new Set(white),weakSet:new Set(needs.weakAttributes),needs});
    }
    return{valid,excluded};
  }
  function candidates(profile){
    return D.NORMAL_DRILLS.map(d=>{
      const s=settingFor(profile,d),level=Number(s.level)||0;if(!s.unlocked||level<1||level>3)return null;
      const effectPct=T.levelEffectPct(level),strength=Number(d.xpPerPlayer)*(1+effectPct/100);
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
  function buildTeamSession(groupKey,{normalProfile,players=[],slots=6}={}){
    const group=D.TEAM_GROUPS[groupKey];if(!group)return{drills:[],error:'invalid-group'};
    const prepared=preparePlayers(players,group);
    if(!prepared.valid.length)return{drills:[],error:'no-complete-players',meta:{groupKey,title:group.title,excludedPlayers:prepared.excluded,model:MODEL_VERSION,apkTeamPlayModeled:false}};
    const cats=candidates(normalProfile);if(!cats.length)return{drills:[],error:'no-available-drills'};
    let beam=[{selected:[],credit:{},utility:0,covered:new Set(),weakCovered:new Set(),totalCondition:0,totalXp:0}];
    for(let slot=0;slot<slots;slot++){
      const next=[];
      for(const state of beam){for(const d of cats){
        let value=0,usefulHits=0;const credit={...state.credit},covered=new Set(state.covered),weakCovered=new Set(state.weakCovered),targets=[];
        for(const pp of prepared.valid){for(const a of d.skills){
          if(!pp.whiteSet.has(a))continue;
          const k=`${pp.id}|${a}`,eff=Math.max(1,Number(pp.needs.need[a]||1)-Number(state.credit[k]||0));
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
      meta:{groupKey,title:group.title,model:MODEL_VERSION,beamWidth:BEAM_WIDTH,selectedPlayerCount:prepared.valid.length,selectedPlayerKeys:prepared.valid.map(x=>x.id),excludedPlayers:prepared.excluded,totalUsefulScore:best?.utility||0,totalCondition:best?.totalCondition||0,totalXp:best?.totalXp||0,distinctPlayerAttributeHits:best?.covered.size||0,distinctWeakPlayerAttributeHits:best?.weakCovered.size||0,greyAttributesAffectScore:false,apkTeamPlayModeled:false,limitations:['TeamPlayTrainingDrill is a separate protocol system and is not modelled by this optimiser.']}
    };
  }
  TE.TeamTraining={MODEL_VERSION,BEAM_WIDTH,buildTeamSession,preparePlayers};
})();
